import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from .models import User, Product, Vendor, VendorProduct, PurchaseOrder, PurchaseItem, SalesOrder, SalesItem, Announcement, Notification, Feedback
from .serializers import VendorSerializer, SalesOrderSerializer, ProductSerializer
from django.utils import timezone
import uuid
import socket


# =========================
# REGISTER STAFF
# =========================
@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)

        if User.objects.filter(email=data.get("email")).exists():
            return JsonResponse({"message": "Email already exists"}, status=400)

        # Generate Temp Password
        from django.utils.crypto import get_random_string
        temp_password = get_random_string(length=10)

        # Create User
        try:
            User.objects.create(
                name=data.get("name"),
                email=data.get("email"),
                phone=data.get("phone"),
                password=make_password(temp_password),
                role=data.get("role", "staff")
            )
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)

        # Send HTML Email
        from django.core.mail import send_mail
        from django.conf import settings
        from django.template.loader import render_to_string
        from django.utils.html import strip_tags

        subject = "Welcome to INVORA - Your Login Details"
        login_url = f"http://{request.get_host()}/staff-login"
        
        html_message = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2a1b13;">INVORA</h1>
            </div>
            <p>Hello <strong>{data.get("name")}</strong>,</p>
            <p>Welcome to the team! You have been registered as a staff member.</p>
            
            <div style="background: #f9f5f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Email:</strong> {data.get("email")}</p>
                <p style="margin: 5px 0;"><strong>Temporary Password:</strong> {temp_password}</p>
            </div>

            <p>Please log in and change your password immediately.</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{login_url}" style="background: #2a1b13; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">If you did not request this account, please contact admin.</p>
        </div>
        """
        plain_message = strip_tags(html_message)
        
        try:
             send_mail(
                subject,
                plain_message,
                settings.EMAIL_HOST_USER,
                [data.get("email")],
                html_message=html_message,
                fail_silently=False
            )
             print(f"✅ Email sent to {data.get('email')}")
        except Exception as e:
            print(f"❌ Failed to send email: {e}")

        return JsonResponse({"message": "User registered successfully. Email sent."}, status=201)

    return JsonResponse({"message": "Invalid request"}, status=405)

from rest_framework.authtoken.models import Token

@csrf_exempt
def staff_login(request):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request"}, status=405)

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")

    if not password or len(password) < 4:
        return JsonResponse({"message": "Password must be at least 4 chars"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    if not check_password(password, user.password):
        return JsonResponse({"message": "Invalid password"}, status=400)

    if not user.is_active:
        return JsonResponse({"message": "Account is restricted. Contact Admin."}, status=403)

    if user.role not in ["staff", "admin"]:
        return JsonResponse({"message": "Unauthorized"}, status=403)

    # ✅ DRF TOKEN
    token, _ = Token.objects.get_or_create(user=user)


    return JsonResponse({
        "message": "Login successful",
        "token": token.key,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }, status=200)


# =========================
# STAFF DASHBOARD (JWT PROTECTED)
# =========================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def staff_dashboard(request):
    user = request.user

    # Double check if active in case status changed during session
    if not user.is_active:
         return Response({"message": "Account restricted"}, status=403)

    if user.role != "staff":
        return Response({"message": "Forbidden"}, status=403)

    return Response({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "status": "active" if user.is_active else "restricted",
    })


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data

    user.name = data.get("name", user.name)
    user.phone = data.get("phone", user.phone)
    
    new_email = data.get("email")
    if new_email and new_email != user.email:
        if User.objects.filter(email=new_email).exists():
            return Response({"message": "Email already in use"}, status=400)
        user.email = new_email

    user.save()

    return Response({
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        }
    })


# =========================
# PRODUCTS
# =========================
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def add_product(request):
    if request.method == "POST":
        # Handle both JSON and FormData
        if request.content_type == "application/json":
            data = json.loads(request.body)
        else:
            data = request.POST

        def safe_float(val, default=0.0):
             try: return float(val) if val and str(val).strip() else default
             except: return default

        def safe_int(val, default=0):
             try: return int(val) if val and str(val).strip() else default
             except: return default

        price = safe_float(data.get("price"))
        stock = safe_int(data.get("stock"))
        discount = safe_float(data.get("discount_percentage", 0))

        try:
            product = Product.objects.create(
                name=data.get("name"),
                category=data.get("category"),
                price=price,
                stock=stock,
                discount_percentage=discount,
                image_url=data.get("image_url", "")
            )
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)

        # Handle optional uploaded image file (overrides image_url if present)
        image_file = request.FILES.get("image")
        if image_file:
            import os
            from django.conf import settings
            
            media_root = getattr(settings, 'MEDIA_ROOT', None)
            media_url = getattr(settings, 'MEDIA_URL', '/media/')
            
            if media_root:
                upload_dir = os.path.join(media_root, "products")
                os.makedirs(upload_dir, exist_ok=True)
                ext = os.path.splitext(image_file.name)[1]
                filename = f"product_{product.id}{ext}"
                filepath = os.path.join(upload_dir, filename)
                
                with open(filepath, "wb+") as f:
                    for chunk in image_file.chunks():
                        f.write(chunk)
                
                product.image_url = f"{media_url}products/{filename}"
                product.save()

        return JsonResponse({"message": "Product added successfully", "id": product.id}, status=201)

    return JsonResponse({"message": "Invalid request"}, status=405)


@csrf_exempt
def delete_product(request, id):
    if request.method == "DELETE":
        Product.objects.filter(id=id).delete()
        return JsonResponse({"message": "Product deleted"})
    return JsonResponse({"message": "Invalid request"}, status=405)


@csrf_exempt
def update_product(request, id):
    if request.method == "POST" or request.method == "PUT":
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return JsonResponse({"message": "Product not found"}, status=404)

        # Handle both JSON and FormData
        if request.content_type == "application/json":
            import json
            data = json.loads(request.body)
        else:
            data = request.POST

        def safe_float(val, default=None):
            if default is None: default = 0.0
            try: 
                if val is None or str(val).strip() == "": return default
                return float(val)
            except: return default

        def safe_int(val, default=None):
            if default is None: default = 0
            try: 
                if val is None or str(val).strip() == "": return default
                return int(val)
            except: return default

        product.name = data.get("name", product.name)
        product.category = data.get("category", product.category)
        
        if "price" in data:
            product.price = safe_float(data.get("price"), product.price)
        if "stock" in data:
            product.stock = safe_int(data.get("stock"), product.stock)
        if "discount_percentage" in data:
            product.discount_percentage = safe_float(data.get("discount_percentage"), product.discount_percentage)
        
        # Handle optional uploaded image file
        image_file = request.FILES.get("image")
        if image_file:
            import os
            from django.conf import settings
            media_root = getattr(settings, 'MEDIA_ROOT', None)
            media_url = getattr(settings, 'MEDIA_URL', '/media/')
            
            if media_root:
                upload_dir = os.path.join(media_root, "products")
                os.makedirs(upload_dir, exist_ok=True)
                ext = os.path.splitext(image_file.name)[1]
                filename = f"product_{product.id}{ext}"
                filepath = os.path.join(upload_dir, filename)
                
                with open(filepath, "wb+") as f:
                    for chunk in image_file.chunks():
                        f.write(chunk)
                
                product.image_url = f"{media_url}products/{filename}"
        elif "image_url" in data:
            product.image_url = data.get("image_url", product.image_url)

        product.save()
        return JsonResponse({"message": "Product updated successfully"})

    return JsonResponse({"message": "Invalid request"}, status=405)


# =========================
# ANNOUNCEMENTS
# =========================
def get_announcements(request):
    announcements = Announcement.objects.all().order_by("-created_at").values()
    return JsonResponse(list(announcements), safe=False)


@csrf_exempt
def add_announcement(request):
    if request.method == "POST":
        data = json.loads(request.body)

        Announcement.objects.create(
            title=data.get("title"),
            message=data.get("message")
        )

        return JsonResponse({"message": "Announcement created"}, status=201)

    return JsonResponse({"message": "Invalid request"}, status=405)


@csrf_exempt
def delete_announcement(request, id):
    if request.method == "DELETE":
        try:
            announcement = Announcement.objects.get(id=id)
            announcement.delete()
            return JsonResponse({"message": "Announcement deleted successfully"})
        except Announcement.DoesNotExist:
            return JsonResponse({"message": "Announcement not found"}, status=404)
    return JsonResponse({"message": "Invalid request"}, status=405)


# =========================
# STAFF LIST & MANAGEMENT
# =========================
def get_staff(request):
    staff = User.objects.filter(role="staff").values(
        "id", "name", "email", "phone", "role", "is_active"
    )
    return JsonResponse(list(staff), safe=False)

@csrf_exempt
def update_staff_status(request, id):
    if request.method == "PUT":
        try:
            user = User.objects.get(id=id)
            data = json.loads(request.body)
            # Toggle is_active based on request
            if "is_active" in data:
                user.is_active = data["is_active"]
                user.save()
            return JsonResponse({"message": "Status updated successfully", "is_active": user.is_active})
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)
    return JsonResponse({"message": "Invalid request"}, status=405)

@csrf_exempt
def delete_staff(request, id):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=id)
            if user.role == 'admin':
                 return JsonResponse({"message": "Cannot delete admin user"}, status=403)
            user.delete()
            return JsonResponse({"message": "Staff member deleted successfully"})
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)
    return JsonResponse({"message": "Invalid request"}, status=405)
@csrf_exempt
def admin_login(request):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request"}, status=405)

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")

    if not password or len(password) < 4:
        return JsonResponse({"message": "Password must be at least 4 chars"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    if not check_password(password, user.password):
        return JsonResponse({"message": "Invalid password"}, status=400)

    if user.role != "admin":
        return JsonResponse({"message": "Access denied. Admin only."}, status=403)

    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        "message": "Admin login successful",
        "token": str(refresh.access_token),   # ✅ ADD THIS
        "admin": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }

    }, status=200)


@api_view(["POST"])
def create_vendor(request):
    vendor = Vendor.objects.create(**request.data)
    return Response({"id": vendor.id, "message": "Vendor created"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_vendors(request):
    vendors = Vendor.objects.all()
    serializer = VendorSerializer(vendors, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_vendor_by_product(request):
    product_name = request.query_params.get("name")
    if not product_name:
        return Response({"message": "Product name required"}, status=400)
    
    # improved matching: simple case-insensitive substring
    product = VendorProduct.objects.filter(name__icontains=product_name).first()
    
    if product:
        vendor = product.vendor
        return Response({
            "vendor": VendorSerializer(vendor).data,
            "product_id": product.id
        })
    
    return Response({"message": "No vendor found containing this product"}, status=404)


@api_view(["POST"])
def add_vendor_product(request, vendor_id):
    product = VendorProduct.objects.create(
        vendor_id=vendor_id,
        **request.data
    )

from django.db import transaction

# =========================
# SALES ORDER (CUSTOMER)
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def create_sales_order(request):
    data = request.data
    items = data.get("items", [])
    customer_name = data.get("customer_name")
    customer_email = data.get("customer_email")
    payment_method = data.get("payment_method", "Card")
    staff_id = data.get("staff_id")
    staff_code = data.get("staff_code")
    discount_amount = data.get("discount_amount", 0)
    final_total = data.get("final_total", 0)
    
    print(f"DEBUG: create_sales_order called. Email: '{customer_email}'. Items: {len(items)}") # DEBUG LOG
    
    # --- DEBUG FILE LOGGING (ROBUST) ---
    try:
        # Relies on CWD being correct, which we verified with list_dir
        import os
        with open("TEST_WRITE.txt", "a") as f:
            f.write(f"\n[REQUEST] Email='{customer_email}', Items={len(items)}\n")
            if not customer_email:
                f.write("[WARNING] Customer Email is MISSING in backend!\n")
            f.flush()
            os.fsync(f.fileno())
        print("DEBUG LOGGING ATTEMPTED")
    except Exception as e:
        print(f"Log Error: {e}")

    if not items:
        return Response({"message": "No items in order"}, status=400)

    try:
        with transaction.atomic():
            # 1. Create Order
            order = SalesOrder.objects.create(
                customer_name=customer_name,
                customer_email=customer_email,
                total_amount=0, # Will be updated
                discount_amount=discount_amount,
                final_total=final_total,
                payment_method=payment_method,
                staff_id=staff_id if staff_id else None,
                staff_code=staff_code
            )

            total_amount = 0
            
            # 2. Process Items
            for item in items:
                product_id = item.get("id")
                qty = int(item.get("quantity", 0))

                # Lock product for update to prevent race conditions
                product = Product.objects.select_for_update().get(id=product_id)
                
                if product.stock < qty:
                    raise ValueError(f"Insufficient stock for {product.name}")

                # Deduct Stock
                product.stock -= qty
                product.save()

                # Create Sales Item
                price = product.price 
                SalesItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=price
                )
                
                total_amount += (price * qty)

            # 3. Update Order Totals
            order.total_amount = total_amount
            # If final_total wasn't provided or seems wrong, we could recalculate:
            # order.final_total = float(total_amount) - float(discount_amount)
            # But let's trust the frontend/payload for now if it provides the final calc, 
            # OR better, enforce backend calculation:
            order.final_total = float(total_amount) - float(discount_amount)
            
            order.save()

            # Transaction commits here when we exit the block
        
        # --- SEND EMAIL CONFIRMATION (After Commit) ---
        if customer_email and not order.confirmation_email_sent:
            try:
                subject = f"Order Confirmation - INVORA #{order.id}"
                email_body = f"Dear {customer_name},\n\nThank you for shopping with INVORA!\n\nHere is your order summary:\n\nOrder ID: #{order.id}\nDate: {order.created_at.strftime('%Y-%m-%d %H:%M')}\n\n"
                
                items_str = ""
                # Since we are outside transaction, these queries are normal reads
                for s_item in SalesItem.objects.filter(order=order):
                        items_str += f"- {s_item.product.name}: {s_item.quantity} x Rs. {s_item.price}\n"
                
                email_body += items_str
                email_body += f"\n--------------------------------\n"
                email_body += f"Total: Rs. {order.total_amount}\n"
                if discount_amount > 0:
                    email_body += f"Discount: - Rs. {discount_amount}\n"
                email_body += f"Final Total: Rs. {final_total}\n"
                email_body += f"\nPayment Method: {payment_method}\n"
                email_body += f"\nThank you,\nTeam INVORA"

                print(f"DEBUG: Sending email to {customer_email} for Order #{order.id}") # DEBUG LOG
                
                send_mail(
                    subject,
                    email_body,
                    settings.DEFAULT_FROM_EMAIL,
                    [customer_email],
                    fail_silently=False,
                )
                print("DEBUG: Email sent successfully!")
                
                # Flag as sent
                order.confirmation_email_sent = True
                order.save(update_fields=["confirmation_email_sent"])
                
                with open("TEST_WRITE.txt", "a") as f:
                    f.write(f"[SUCCESS] Email sent to {customer_email}\n")

            except Exception as e:
                print(f"ERROR Sending Email: {e}")
                with open("TEST_WRITE.txt", "a") as f:
                    f.write(f"[ERROR] Failed to send: {e}\n")

        return Response({"message": "Order placed successfully", "order_id": order.id}, status=201)

    except Product.DoesNotExist:
        return Response({"message": "One or more products not found"}, status=404)
    except ValueError as e:
        return Response({"message": str(e)}, status=400)
    except Exception as e:
        return Response({"message": str(e)}, status=400)
        return Response({"message": "Product not found"}, status=404)
    except ValueError as e:
        return Response({"message": str(e)}, status=400)
    except Exception as e:
        return Response({"message": str(e)}, status=500)


@api_view(["GET"])
def vendor_products(request, vendor_id):
    products = VendorProduct.objects.filter(vendor_id=vendor_id).values()
    return Response(products)


@api_view(["POST"])
def create_purchase_order(request):
    vendor_id = request.data["vendor_id"]
    items = request.data["items"]
    idempotency_key = request.data.get("idempotency_key")

    if idempotency_key:
        existing_order = PurchaseOrder.objects.filter(idempotency_key=idempotency_key).first()
        if existing_order:
            return Response({
                "invoice_no": existing_order.invoice_no,
                "total_amount": existing_order.total_amount,
                "message": "Order already processed (Duplicate Request)."
            }, status=200)

    invoice = f"INV-{uuid.uuid4().hex[:8].upper()}"
    total = sum(i["price"] * i["quantity"] for i in items)

    order = PurchaseOrder.objects.create(
        vendor_id=vendor_id,
        invoice_no=invoice,
        total_amount=total,
        idempotency_key=idempotency_key
    )

    for i in items:
        # Create Purchase Item Record
        PurchaseItem.objects.create(
            order=order,
            product_id=i["product_id"],
            quantity=i["quantity"],
            price=i["price"]
        )

        # ✅ AUTOMATICALLY UPDATE MAIN INVENTORY STOCK
        try:
            # Get the vendor product to know its name
            vendor_product = VendorProduct.objects.get(id=i["product_id"])
            v_name = vendor_product.name.strip()
            
            # Find matching product in main inventory by NAME (Case-insensitive + Trimmed)
            main_product = Product.objects.filter(name__iexact=v_name).first()
            
            if main_product:
                main_product.stock += int(i["quantity"])
                main_product.save()
                print(f"✅ Updated stock for '{main_product.name}': +{i['quantity']} (Total: {main_product.stock})")
            else:
                print(f"⚠️ Product '{v_name}' not found in main inventory, skipping stock update.")
                
        except VendorProduct.DoesNotExist:
            print(f"⚠️ VendorProduct ID {i['product_id']} not found.")

    # ✅ SEND EMAIL TO VENDOR
    try:
        vendor = Vendor.objects.get(id=vendor_id)
        if vendor.email:
            subject = f"New Purchase Order: {invoice} - INVORA"
            
            # Format Items for Email
            items_text = ""
            for i in items:
                v_prod = VendorProduct.objects.get(id=i["product_id"])
                items_text += f"- {v_prod.name}: {i['quantity']} x Rs. {i['price']} = Rs. {i['quantity'] * i['price']}\n"

            message = f"""
Hello {vendor.name},

A new purchase order has been generated.

Invoice No: {invoice}
----------------------------------------
Items:
{items_text}
----------------------------------------
Total Amount: Rs. {total}

Please process this order immediately.

Regards,
INVORA Purchase Team
            """

            from django.core.mail import send_mail
            from django.conf import settings

            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,  # From
                [vendor.email],            # To
                fail_silently=False,
            )
            print(f"📧 Email sent to {vendor.email}")
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")

    # Prepare response data (full order for frontend invoice)
    items_data = []
    for i in items:
        v_prod = VendorProduct.objects.get(id=i["product_id"])
        items_data.append({
            "product_name": v_prod.name,
            "quantity": i["quantity"],
            "price": float(i["price"]),
            "total": float(i["quantity"] * i["price"])
        })

    response_data = {
        "id": order.id,
        "invoice_no": invoice,
        "vendor_name": vendor.name,
        "total_amount": float(total),
        "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
        "items": items_data,
        "message": "Purchase successful! Stock updated & Email Sent."
    }

    return Response(response_data)


@api_view(["GET"])
def get_public_staff(request):
    # Public endpoint to list staff names for checkout
    staff = User.objects.filter(role__in=["staff", "admin"], is_active=True)
    data = [{"id": s.id, "name": s.name, "role": s.role} for s in staff]
    return Response(data)


@api_view(["GET"])
def get_purchase_orders(request):
    orders = PurchaseOrder.objects.all().order_by("-created_at")
    data = []
    
    for order in orders:
        items = PurchaseItem.objects.filter(order=order)
        items_data = []
        for item in items:
            items_data.append({
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": item.price,
                "total": item.quantity * item.price
            })
            
        data.append({
            "id": order.id,
            "invoice_no": order.invoice_no,
            "vendor_name": order.vendor.name,
            "total_amount": order.total_amount,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "items": items_data
        })
        
    return Response(data)


from django.db import transaction

# =========================
# SALES ORDER (CUSTOMER)
# =========================



@api_view(["POST"])
def submit_feedback(request):
    try:
        data = request.data
        order_id = data.get("order_id")
        rating = data.get("rating")
        comment = data.get("comment", "")
        
        order = SalesOrder.objects.get(id=order_id)
        
        # Check if feedback already exists
        if Feedback.objects.filter(order=order).exists():
           return Response({"message": "Feedback already exists"}, status=400)
           
        Feedback.objects.create(
            order=order,
            staff=order.staff, # Auto link to staff who handled order
            rating=rating,
            comment=comment
        )
        
        return Response({"message": "Feedback submitted successfully"})
    except SalesOrder.DoesNotExist:
        return Response({"message": "Order not found"}, status=404)
    except Exception as e:
        return Response({"message": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_dashboard_feedback(request):
    user = request.user
    
    if user.role == "admin":
        feedbacks = Feedback.objects.all().order_by("-created_at")
    elif user.role == "staff":
        feedbacks = Feedback.objects.filter(staff=user).order_by("-created_at")
    else:
        return Response({"message": "Unauthorized"}, status=403)

    data = []
    for f in feedbacks:
        data.append({
            "id": f.id,
            "order_id": f.order.id,
            "staff_name": f.staff.name if f.staff else "Unassigned",
            "rating": f.rating,
            "comment": f.comment,
            "created_at": f.created_at
        })
    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_notification(request):
    message = request.data.get("message")
    if not message:
        return Response({"message": "Message required"}, status=400)
    
    Notification.objects.create(message=message, type="alert")
    return Response({"message": "Admin alerted successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    if request.user.role != "admin":
        return Response({"message": "Admin only"}, status=403)
        
    notifications = Notification.objects.all().order_by("-created_at")
    data = [{
        "id": n.id,
        "message": n.message,
        "type": n.type,
        "is_read": n.is_read,
        "created_at": n.created_at
    } for n in notifications]
    
    return Response(data)


@api_view(["GET"])
def get_server_ip(request):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # doesn't even have to be reachable
        s.connect(('10.254.254.254', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return Response({"ip": IP})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_sales_orders(request):
    user = request.user
    if user.role != "staff":
        return Response({"message": "Staff only"}, status=403)
        
    orders = SalesOrder.objects.filter(staff=user).order_by("-created_at")
    data = []
    for order in orders:
        items = order.items.all()
        items_data = [{
            "product_name": i.product.name,
            "quantity": i.quantity,
            "price": i.price
        } for i in items]
        
        # Check for feedback
        feedback = None
        if hasattr(order, 'feedback'):
            feedback = {
                 "rating": order.feedback.rating,
                 "comment": order.feedback.comment
            }

        data.append({
            "id": order.id,
            "status": order.status,
            "customer_name": order.customer_name,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "items": items_data,
            "feedback": feedback
        })
        
    return Response(data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_sales_order_status(request, id):
    user = request.user
    try:
        order = SalesOrder.objects.get(id=id)
        
        # Check permission: assigned staff or admin
        if user.role != "admin" and order.staff != user:
            return Response({"message": "You are not authorized to update this order"}, status=403)
            
        status = request.data.get("status")
        if status not in ["processing", "completed"]:
            return Response({"message": "Invalid status"}, status=400)
            
        order.status = status
        order.save()
        
        return Response({"message": f"Order status updated to {status}", "status": order.status})
        
    except SalesOrder.DoesNotExist:
        return Response({"message": "Order not found"}, status=404)
    except Exception as e:
        return Response({"message": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def send_contact_email(request):
    try:
        data = request.data
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        if not all([name, email, message]):
            return Response({"message": "All fields are required"}, status=400)

        subject = f"New Contact Message from {name} - INVORA"
        email_body = f"""
New Contact Form Submission

Name: {name}
Email: {email}

Message:
{message}
        """

        # Send email to admin (smartinventory05@gmail.com)
        from django.core.mail import EmailMessage
        email_msg = EmailMessage(
            subject=subject,
            body=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=["smartinventory05@gmail.com"],
            reply_to=[email]
        )
        email_msg.send(fail_silently=False)

        return Response({"message": "Message sent successfully!"}, status=200)

    except Exception as e:
        print(f"Error sending contact email: {e}")
        return Response({"message": "Failed to send message"}, status=500)


# =========================
# ANALYTICS DASHBOARD
# =========================
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDate
from datetime import timedelta
from django.utils import timezone

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Only logged-in staff/admin
def get_analytics_data(request):
    try:
        today = timezone.now().date()
        week_start = today - timedelta(days=7)
        month_start = today - timedelta(days=30)

        # 1. Total Sales (Revenue)
        daily_sales = SalesOrder.objects.filter(created_at__date=today).aggregate(Sum('final_total'))['final_total__sum'] or 0
        weekly_sales = SalesOrder.objects.filter(created_at__date__gte=week_start).aggregate(Sum('final_total'))['final_total__sum'] or 0
        monthly_sales = SalesOrder.objects.filter(created_at__date__gte=month_start).aggregate(Sum('final_total'))['final_total__sum'] or 0

        # 2. Low Stock Alerts (Stock < 10)
        low_stock_products = Product.objects.filter(stock__lt=10).values('name', 'stock', 'category')

        # 3. Top Selling Products (Limit 5)
        top_products = SalesItem.objects.values('product__name').annotate(
            total_sold=Sum('quantity')
        ).order_by('-total_sold')[:5]

        # 4. Sales by Category
        category_sales = SalesItem.objects.values('product__category').annotate(
            total_revenue=Sum(F('quantity') * F('price'))
        ).order_by('-total_revenue')

        # 5. Revenue Trend (Last 7 Days) for Graph
        # We need to fill in days with 0 sales if no data exists
        revenue_trend = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            sales = SalesOrder.objects.filter(created_at__date=date).aggregate(total=Sum('final_total'))['total'] or 0
            revenue_trend.append({"date": date.strftime("%a"), "sales": sales}) # Mon, Tue...

        data = {
            "daily_sales": daily_sales,
            "weekly_sales": weekly_sales,
            "monthly_sales": monthly_sales,
            "low_stock_products": list(low_stock_products),
            "top_products": [{"name": tp['product__name'], "sold": tp['total_sold']} for tp in top_products],
            "category_sales": [{"name": cs['product__category'], "value": cs['total_revenue']} for cs in category_sales],
            "revenue_trend": revenue_trend
        }

        return Response(data, status=200)

    except Exception as e:
        print(f"Error fetching analytics: {e}")
        return Response({"message": "Failed to load analytics"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def sales_prediction(request):
    try:
        today = timezone.now().date()
        # Last 6 months data
        data_points = []
        
        # Calculate start of current month
        current_month_start = today.replace(day=1)
        
        # Get data for last 6 months (excluding current incomplete month to be safe, or including?)
        # Let's include current month as month 6 if we want, or go back 1-6.
        # Let's go back 0 to 5 (0 is current month).
        
        for i in range(5, -1, -1):
            # i=5: 5 months ago... i=0: current month
            
            # Logic to get month start date
            y, m = current_month_start.year, current_month_start.month
            m = m - i
            while m <= 0:
                m += 12
                y -= 1
            
            start_date = current_month_start.replace(year=y, month=m, day=1)
            
            # End date = start of next month
            if m == 12:
                next_m = 1
                next_y = y + 1
            else:
                next_m = m + 1
                next_y = y
            
            end_date = start_date.replace(year=next_y, month=next_m, day=1)
            
            # Query Sales
            total_rev = SalesOrder.objects.filter(
                created_at__gte=start_date, 
                created_at__lt=end_date
            ).aggregate(Sum('final_total'))['final_total__sum'] or 0
            
            month_label = start_date.strftime("%b")
            
            data_points.append({
                "x": 6-i, # x values: 1(oldest) to 6(newest/current)
                "y": float(total_rev),
                "month": month_label
            })

        # Linear Regression (Least Squares)
        # X = [1, 2, 3, 4, 5, 6] representing the months chronologically
        # Y = Revenue
        
        n = len(data_points)
        sum_x = sum(p['x'] for p in data_points)
        sum_y = sum(p['y'] for p in data_points)
        sum_xy = sum(p['x'] * p['y'] for p in data_points)
        sum_x2 = sum(p['x'] ** 2 for p in data_points)
        
        denominator = (n * sum_x2 - sum_x ** 2)
        
        if denominator != 0:
            m = (n * sum_xy - sum_x * sum_y) / denominator
            b = (sum_y - m * sum_x) / n
        else:
            m = 0
            b = 0
            
        # Predict Next Month (x = 7)
        predicted_revenue = m * 7 + b
        predicted_revenue = max(0, round(predicted_revenue, 2))
        
        return Response({
            "history": data_points,
            "prediction": predicted_revenue,
            "formula": f"y = {round(m, 2)}x + {round(b, 2)}"
        })

    except Exception as e:
        print(f"Error in sales prediction: {e}")
        return Response({"message": str(e)}, status=500)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_invoice(request, id):
    try:
        from django.http import HttpResponse
        from django.template.loader import render_to_string
        
        order = SalesOrder.objects.get(id=id)
        
        # Check permission: assigned staff or admin
        if request.user.role != "admin" and order.staff != request.user:
            return Response({"message": "Unauthorized"}, status=403)
            
        context = {
            "order": order,
            "items": order.items.all(),
            "date": order.created_at.strftime("%B %d, %Y")
        }
        
        # A simple HTML template for the invoice
        invoice_html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; color: #333; }}
                .invoice-box {{ max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }}
                .header {{ display: flex; justify-content: space-between; margin-bottom: 20px; }}
                .title {{ font-size: 24px; font-weight: bold; color: #0a3a52; }}
                .info {{ margin-bottom: 20px; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th {{ background: #f8f9fa; text-align: left; padding: 10px; border-bottom: 2px solid #eee; }}
                td {{ padding: 10px; border-bottom: 1px solid #eee; }}
                .total {{ text-align: right; padding: 20px 0; font-size: 18px; font-weight: bold; color: #2ecc71; }}
                .footer {{ margin-top: 50px; text-align: center; color: #999; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="header">
                    <div class="title">INVORA INVOICE</div>
                    <div>Date: {context['date']}</div>
                </div>
                
                <div class="info">
                    <strong>Invoice No:</strong> #ORD-{order.id}<br>
                    <strong>Customer:</strong> {order.customer_name}<br>
                    <strong>Email:</strong> {order.customer_email}<br>
                    <strong>Payment:</strong> {order.payment_method}
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
        """
        
        for item in context['items']:
            invoice_html += f"""
                <tr>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price}</td>
                    <td>Rs. {item.quantity * item.price}</td>
                </tr>
            """
            
        invoice_html += f"""
                    </tbody>
                </table>
                
                <div class="total">
                    Total Amount: Rs. {order.total_amount}<br>
                    Discount: - Rs. {order.discount_amount}<br>
                    Final Total: Rs. {order.final_total}
                </div>
                
                <div class="footer">
                    Thank you for shopping with INVORA!<br>
                    This is a computer-generated invoice.
                </div>
            </div>
        </body>
        </html>
        """
        
        response = HttpResponse(invoice_html, content_type="text/html")
        response["Content-Disposition"] = f'attachment; filename="invoice_{order.id}.html"'
        return response
        
    except SalesOrder.DoesNotExist:
        return Response({"message": "Order not found"}, status=404)
    except Exception as e:
        return Response({"message": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_all_my_orders(request):
    user = request.user
    if user.role != "staff":
        return Response({"message": "Staff only"}, status=403)
        
    updated = SalesOrder.objects.filter(staff=user, status="processing").update(status="completed")
    return Response({"message": f"Successfully marked {updated} orders as completed.", "count": updated})

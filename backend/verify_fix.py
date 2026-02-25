import os
import django
import json
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product, Vendor, VendorProduct, PurchaseOrder, PurchaseItem

def simulate_purchase():
    print("=== STARTING PURCHASE SIMULATION ===")
    
    # 1. Ensure we have a product and a vendor product with slightly different case/spacing
    p, _ = Product.objects.get_or_create(
        name="Test Gadget Pro",
        defaults={"category": "gadget", "price": 1000, "stock": 5}
    )
    p.stock = 5
    p.save()
    
    v, _ = Vendor.objects.get_or_create(name="Diagnostic Vendor", category="gadget")
    
    vp, _ = VendorProduct.objects.get_or_create(
        vendor=v,
        name="  test gadget pro  ", # Different case and spacing
        defaults={"cost_price": 800, "stock": 100}
    )
    
    print(f"Main Product: '{p.name}' | Stock: {p.stock}")
    print(f"Vendor Product: '{vp.name}'")
    
    # 2. Simulate the backend create_purchase_order logic
    print("\nSimulating purchase of 10 units...")
    invoice = f"TEST-{uuid.uuid4().hex[:8].upper()}"
    qty = 10
    
    # This mimics the logic in views.py
    v_product = VendorProduct.objects.get(id=vp.id)
    v_name = v_product.name.strip()
    main_product = Product.objects.filter(name__iexact=v_name).first()
    
    if main_product:
        old_stock = main_product.stock
        main_product.stock += qty
        main_product.save()
        print(f"✅ SUCCESS: Stock updated for '{main_product.name}': {old_stock} -> {main_product.stock}")
        if main_product.stock == 15:
            print("=== VERIFICATION PASSED ===")
        else:
            print("=== VERIFICATION FAILED: Unexpected stock count ===")
    else:
        print(f"❌ FAILED: Product '{v_name}' not found in main inventory.")

if __name__ == "__main__":
    simulate_purchase()

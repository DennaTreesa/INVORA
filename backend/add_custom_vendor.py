import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor, VendorProduct

def add_custom_vendor():
    name = "Denna Electronics" # Derived from email/context
    email = "dennathomas46@gmail.com"
    category = "laptop"
    phone = "+1 555-9999"

    # Check if exists
    if Vendor.objects.filter(email=email).exists():
        print(f"⚠️ Vendor with email {email} already exists.")
        return

    vendor = Vendor.objects.create(
        name=name,
        category=category,
        email=email,
        phone=phone
    )
    print(f"✅ Created Vendor: {vendor.name} ({vendor.category}) [{vendor.email}]")

    # Add some sample products
    products = [
        {"name": "MacBook Air M2", "cost_price": 95000.00},
        {"name": "Asus ZenBook 14", "cost_price": 85000.00}
    ]

    for p in products:
        VendorProduct.objects.create(
            vendor=vendor,
            name=p["name"],
            cost_price=p["cost_price"],
            stock=100
        )
        print(f"   -> Added Product: {p['name']}")

if __name__ == "__main__":
    add_custom_vendor()

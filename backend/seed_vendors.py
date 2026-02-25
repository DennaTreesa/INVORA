import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor, VendorProduct

vendors_data = [
    # LAPTOP VENDORS
    {
        "name": "TechGiant Suppliers",
        "category": "laptop",
        "email": "contact@techgiant.com",
        "phone": "+1 555-0101",
        "products": [
            {"name": "MacBook Pro M3", "cost_price": 185000.00},
            {"name": "Dell XPS 15", "cost_price": 135000.00},
            {"name": "HP Spectre x360", "cost_price": 125000.00},
            {"name": "Asus ROG Zephyrus", "cost_price": 170000.00}
        ]
    },
    {
        "name": "Global Laptops Inc.",
        "category": "laptop",
        "email": "sales@globallaptops.com",
        "phone": "+1 555-0102",
        "products": [
            {"name": "Dell XPS 15", "cost_price": 134500.00},
            {"name": "Lenovo ThinkPad X1", "cost_price": 140000.00}, # New
             {"name": "MacBook Pro M3", "cost_price": 184000.00}
        ]
    },

    # PHONE VENDORS
    {
        "name": "Mobile World Distributors",
        "category": "phone",
        "email": "orders@mobileworld.com",
        "phone": "+1 555-0201",
        "products": [
            {"name": "iPhone 15 Pro Max", "cost_price": 145000.00},
            {"name": "Samsung Galaxy S24 Ultra", "cost_price": 115000.00},
            {"name": "Google Pixel 8 Pro", "cost_price": 95000.00}
        ]
    },
    {
        "name": "Samsung Bulk Suppliers",
        "category": "phone",
        "email": "b2b@samsungbulk.com",
        "phone": "+1 555-0202",
        "products": [
            {"name": "Samsung Galaxy S24 Ultra", "cost_price": 112000.00},
             {"name": "OnePlus 12", "cost_price": 62000.00}
        ]
    },

    # GADGET VENDORS
    {
        "name": "General Gadgets Inc",
        "category": "gadget",
        "email": "info@generalgadgets.com",
        "phone": "+1 555-0301",
        "products": [
            {"name": "Sony WH-1000XM5", "cost_price": 24000.00},
            {"name": "Apple Watch Series 9", "cost_price": 38000.00},
            {"name": "GoPro Hero 12", "cost_price": 35000.00}
        ]
    },
     {
        "name": "FastTrack Electronics",
        "category": "gadget",
        "email": "sales@fasttrack.com",
        "phone": "+1 555-0302",
        "products": [
            {"name": "Logitech MX Master 3S", "cost_price": 8500.00},
             {"name": "Sony WH-1000XM5", "cost_price": 23500.00}
        ]
    }
]

print(f"Adding vendors and products...")

for v_data in vendors_data:
    vendor, created = Vendor.objects.get_or_create(
        name=v_data["name"],
        defaults={
            "category": v_data["category"],
            "email": v_data["email"],
            "phone": v_data["phone"]
        }
    )
    if created:
        print(f"✅ Created Vendor: {vendor.name} ({vendor.category})")
    else:
        print(f"ℹ️ Vendor exists: {vendor.name}")

    # Add products for this vendor
    for p_data in v_data["products"]:
        vp, created_p = VendorProduct.objects.get_or_create(
            vendor=vendor,
            name=p_data["name"],
            defaults={
                "cost_price": p_data["cost_price"],
                "stock": 1000 # Vendor creates infinite stock basically
            }
        )
        if created_p:
             print(f"   -> Added Product: {vp.name} @ {vp.cost_price}")

print("\nDone! Vendors seeded.")

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product, Vendor, VendorProduct

def check_and_add_data():
    print("=== CURRENT VENDORS ===")
    vendors = Vendor.objects.all()
    denna = None
    for v in vendors:
        print(f"ID: {v.id} | Name: {v.name} | Category: {v.category}")
        if "Denna" in v.name:
            denna = v
    
    if not denna:
        print("Creating Denna Electronics...")
        denna = Vendor.objects.create(name="Denna Electronics", category="laptop")
    
    print("\n=== CURRENT PRODUCTS ===")
    products = Product.objects.all()
    for p in products:
        print(f"ID: {p.id} | Name: {p.name} | Stock: {p.stock} | Price: {p.price}")

    print("\n=== ADDING LOW STOCK PRODUCTS TO DENNA ELECTRONICS ===")
    # Add some products to Denna Electronics that match existing products
    # This will help test the stock update logic
    
    target_products = [
        {"name": "Gaming Laptop Pro", "price": 45000, "category": "laptop"},
        {"name": "Wireless Mouse X", "price": 1200, "category": "gadget"},
        {"name": "iPhone 15 Pro", "price": 120000, "category": "phone"}
    ]
    
    for p_data in target_products:
        # Create main product if not exists
        p, created = Product.objects.get_or_create(
            name=p_data["name"],
            defaults={"category": p_data["category"], "price": p_data["price"], "stock": 5}
        )
        if created:
            print(f"Created main product: {p.name}")
        else:
            # Ensure it is low stock for testing
            p.stock = 5
            p.save()
            print(f"Updated {p.name} to low stock (5)")
            
        # Add to Denna Electronics
        vp, created = VendorProduct.objects.get_or_create(
            vendor=denna,
            name=p.name,
            defaults={"cost_price": p_data["price"] * 0.8, "stock": 100}
        )
        if created:
            print(f"Added {p.name} to Denna Electronics")
        else:
            print(f"{p.name} already in Denna Electronics")

if __name__ == "__main__":
    check_and_add_data()

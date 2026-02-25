Add a product discount feature to the system. For products that have a discount, display the original price with a strikethrough line and show the discounted price clearly next to it. The discounted price should be calculated automatically based on the discount value and used everywhere in the system, including the product listing, product details page, cart, and checkout. Products without a discount should continue to display only the regular price.import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product, Vendor, VendorProduct

def create_real_products_v2():
    print("🚀 Starting to add 20 REAL products with ACCURATE IMAGES...")

    # Ensure a vendor exists
    vendor = Vendor.objects.filter(category="gadget").first()
    if not vendor:
        vendor = Vendor.objects.first()
        
    if not vendor:
        vendor = Vendor.objects.create(
            name="Premium Tech Imports",
            category="gadget",
            email="imports@premiumtech.com",
            phone="1234567890"
        )
    
    print(f"👉 Adding products to vendor: {vendor.name}")

    # Data from DummyJSON (Reliable, permanent URLs)
    real_products = [
        # SMARTPHONES
        {
            "name": "iPhone 13 Pro", 
            "category": "Phone", 
            "price": 89999, 
            "stock": 25, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp"
        },
        {
            "name": "iPhone X", 
            "category": "Phone", 
            "price": 45000, 
            "stock": 15, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp"
        },
        {
            "name": "iPhone 5s", 
            "category": "Phone", 
            "price": 15000, 
            "stock": 5, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp"
        },
        {
            "name": "iPhone 6", 
            "category": "Phone", 
            "price": 20000, 
            "stock": 12, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp"
        },
        {
            "name": "Oppo F19 Pro Plus", 
            "category": "Phone", 
            "price": 25990, 
            "stock": 30, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/thumbnail.webp"
        },
        {
            "name": "Oppo A57", 
            "category": "Phone", 
            "price": 14990, 
            "stock": 22, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp"
        },
        {
            "name": "Realme C35", 
            "category": "Phone", 
            "price": 11999, 
            "stock": 40, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp"
        },
        {
            "name": "Realme X", 
            "category": "Phone", 
            "price": 17999, 
            "stock": 18, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/realme-x/thumbnail.webp"
        },
        
        # LAPTOPS
        {
            "name": "MacBook Pro 14", 
            "category": "Laptop", 
            "price": 169900, 
            "stock": 10, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp"
        },
        {
            "name": "Asus Zenbook Pro Duo", 
            "category": "Laptop", 
            "price": 145000, 
            "stock": 8, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp"
        },
        {
            "name": "Huawei Matebook X Pro", 
            "category": "Laptop", 
            "price": 125000, 
            "stock": 12, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp"
        },
        {
            "name": "Lenovo Yoga 920", 
            "category": "Laptop", 
            "price": 110000, 
            "stock": 14, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp"
        },
        {
            "name": "Dell XPS 13 9300", 
            "category": "Laptop", 
            "price": 134900, 
            "stock": 6, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp"
        },
        
        # TABLETS / GADGETS
        {
            "name": "iPad Mini 2021", 
            "category": "Gadget", 
            "price": 45900, 
            "stock": 20, 
            "image_url": "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp"
        },
        {
            "name": "Samsung Galaxy Tab S8+", 
            "category": "Gadget", 
            "price": 65999, 
            "stock": 15, 
            "image_url": "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp"
        },
         {
            "name": "Samsung Galaxy Tab A8", 
            "category": "Gadget", 
            "price": 18999, 
            "stock": 35, 
            "image_url": "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/thumbnail.webp"
        },
        
        # ADDITIONAL ITEMS (Reusing images for variants to reach 20)
        {
            "name": "iPhone 13 Pro Max", 
            "category": "Phone", 
            "price": 99999, 
            "stock": 10, 
            "image_url": "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp" # Alt image
        },
        {
            "name": "MacBook Pro 16", 
            "category": "Laptop", 
            "price": 249900, 
            "stock": 5, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp" # Alt image
        },
        {
            "name": "Asus Zenbook Flip", 
            "category": "Laptop", 
            "price": 95000, 
            "stock": 11, 
            "image_url": "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp"
        },
        {
            "name": "Samsung Galaxy Tab S9 Ultra", 
            "category": "Gadget", 
            "price": 105999, 
            "stock": 7, 
            "image_url": "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/2.webp"
        }
    ]

    count = 0
    for p in real_products:
        # 1. Update/Create User's Inventory (Product model)
        # Using update_or_create to ensure image_url gets fixed if product exists
        prod, created = Product.objects.update_or_create(
            name=p["name"],
            defaults={
                "category": p["category"],
                "price": p["price"],
                "stock": p["stock"],
                "image_url": p["image_url"] 
            }
        )
        
        # 2. Update/Create Vendor's Catalog
        cost_price = int(p["price"] * 0.85) # 15% margin
        VendorProduct.objects.update_or_create(
            vendor=vendor,
            name=p["name"],
            defaults={
                "cost_price": cost_price,
                "stock": 100 
            }
        )
        
        action = "Created" if created else "Updated"
        print(f"   ✅ {action}: {p['name']}")
        count += 1

    print(f"\n🎉 Successfully processed {count} REAL products with correct images!")

if __name__ == "__main__":
    create_real_products_v2()

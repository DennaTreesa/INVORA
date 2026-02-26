import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

def add_iphone_products():
    print("🚀 Adding iPhone 15 Pro and iPhone 17 Pro...")

    # Using prices found in research (converted to reasonable 2026 values or matching existing patterns)
    # iPhone 15 Pro: $999 (Original) -> Using as reasonable stock value
    # iPhone 17 Pro: $1099 (Starting) -> Using as reasonable stock value
    
    products = [
        {
            "name": "iPhone 15 Pro",
            "category": "Phone",
            "price": 999.00,
            "stock": 25,
            "discount_percentage": 0.00,
            "image_url": "https://m.media-amazon.com/images/I/81SigAnN7KL._AC_SL1500_.jpg",
        },
        {
            "name": "iPhone 17 Pro",
            "category": "Phone",
            "price": 1099.00,
            "stock": 20,
            "discount_percentage": 0.00,
            "image_url": "https://m.media-amazon.com/images/I/81L7uX3e22L._AC_SL1500_.jpg", 
        },
    ]

    for p in products:
        obj, created = Product.objects.update_or_create(
            name=p["name"],
            defaults={
                "category": p["category"],
                "price": p["price"],
                "stock": p["stock"],
                "discount_percentage": p["discount_percentage"],
                "image_url": p["image_url"],
            },
        )
        if created:
            print(f"  ✅ Created: {p['name']}")
        else:
            print(f"  🔄 Updated: {p['name']}")

if __name__ == "__main__":
    add_iphone_products()

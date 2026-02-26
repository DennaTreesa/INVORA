import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

def add_batch_products():
    print("🚀 Adding 15 new products (Laptops, Phones, Gadgets)...")

    products = [
        # --- PHONES ---
        {"name": "iPhone 14", "category": "Phone", "price": 69900.00, "stock": 30, "discount_percentage": 5.00, "image_url": "https://th.bing.com/th?q=iPhone+14+Official"},
        {"name": "Samsung Galaxy S24 Ultra", "category": "Phone", "price": 129999.00, "stock": 15, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=Samsung+Galaxy+S24+Ultra+Official"},
        {"name": "Google Pixel 8 Pro", "category": "Phone", "price": 106990.00, "stock": 20, "discount_percentage": 8.00, "image_url": "https://th.bing.com/th?q=Google+Pixel+8+Pro+Official"},
        {"name": "OnePlus 12", "category": "Phone", "price": 64999.00, "stock": 25, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=OnePlus+12+Official"},
        {"name": "Xiaomi 14", "category": "Phone", "price": 69999.00, "stock": 18, "discount_percentage": 10.00, "image_url": "https://th.bing.com/th?q=Xiaomi+14+Official"},

        # --- LAPTOPS ---
        {"name": "MacBook Pro M3", "category": "Laptop", "price": 169900.00, "stock": 12, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=MacBook+Pro+M3+Official"},
        {"name": "Dell XPS 13", "category": "Laptop", "price": 114990.00, "stock": 10, "discount_percentage": 5.00, "image_url": "https://th.bing.com/th?q=Dell+XPS+13+Official"},
        {"name": "HP Spectre x360 2024", "category": "Laptop", "price": 154999.00, "stock": 8, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=HP+Spectre+x360+2024+Official"},
        {"name": "Lenovo Yoga 9i", "category": "Laptop", "price": 139990.00, "stock": 14, "discount_percentage": 7.00, "image_url": "https://th.bing.com/th?q=Lenovo+Yoga+9i+Official"},
        {"name": "ASUS ROG Zephyrus G14", "category": "Laptop", "price": 159990.00, "stock": 6, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=ASUS+ROG+Zephyrus+G14+Official"},

        # --- GADGETS ---
        {"name": "Apple Watch Ultra 2", "category": "Gadget", "price": 89900.00, "stock": 20, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=Apple+Watch+Ultra+2+Official"},
        {"name": "Sony WF-1000XM5", "category": "Gadget", "price": 24990.00, "stock": 40, "discount_percentage": 15.00, "image_url": "https://th.bing.com/th?q=Sony+WF-1000XM5+Official"},
        {"name": "Nintendo Switch OLED", "category": "Gadget", "price": 32990.00, "stock": 35, "discount_percentage": 5.00, "image_url": "https://th.bing.com/th?q=Nintendo+Switch+OLED+Official"},
        {"name": "Meta Quest 3", "category": "Gadget", "price": 49999.00, "stock": 15, "discount_percentage": 0.00, "image_url": "https://th.bing.com/th?q=Meta+Quest+3+Official"},
        {"name": "Bose QuietComfort Ultra", "category": "Gadget", "price": 35900.00, "stock": 28, "discount_percentage": 10.00, "image_url": "https://th.bing.com/th?q=Bose+QuietComfort+Ultra+Official"},
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
    add_batch_products()

import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

products_data = [
    {
        "name": "Sony WH-1000XM5",
        "category": "Gadget",
        "price": 29999,
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "MacBook Air M2",
        "category": "Laptop",
        "price": 99900,
        "stock": 10,
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Samsung Galaxy S23 Ultra",
        "category": "Phone",
        "price": 124999,
        "stock": 15,
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Dell XPS 13",
        "category": "Laptop",
        "price": 115000,
        "stock": 8,
        "image_url": "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "iPhone 15 Pro",
        "category": "Phone",
        "price": 134900,
        "stock": 20,
        "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Logitech MX Master 3S",
        "category": "Accessories",
        "price": 9995,
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800"
    },
    {
        "name": "Sony PlayStation 5",
        "category": "Gadget",
        "price": 54990,
        "stock": 12,
        "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800"
    },
]

print(f"Adding {len(products_data)} products...")

for p in products_data:
    obj, created = Product.objects.get_or_create(
        name=p["name"],
        defaults={
            "category": p["category"],
            "price": p["price"],
            "stock": p["stock"],
            "image_url": p["image_url"]
        }
    )
    if created:
        print(f"✅ Created: {p['name']}")
    else:
        print(f"ℹ️ Exists: {p['name']}")

print("\nDone! Please refresh your dashboard.")

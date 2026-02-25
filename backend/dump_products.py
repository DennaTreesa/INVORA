import os
import django
import sys
import json

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

products = Product.objects.all()
data = []
for p in products:
    data.append({
        "id": p.id,
        "name": p.name,
        "stock": p.stock,
        "price": float(p.price),
        "discount_percentage": float(p.discount_percentage)
    })

print(json.dumps(data, indent=2))

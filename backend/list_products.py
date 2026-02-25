import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

products = Product.objects.all()
for p in products:
    print(f"Name: {p.name}, Category: {p.category}, Image: {p.image_url}")

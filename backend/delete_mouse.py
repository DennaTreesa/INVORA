import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

product_name = "Wireless Mouse X"
try:
    product = Product.objects.get(name=product_name)
    product.delete()
    print(f"Product '{product_name}' deleted successfully.")
except Product.DoesNotExist:
    print(f"Product '{product_name}' not found.")
except Exception as e:
    print(f"Error: {e}")

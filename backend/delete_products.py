import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

ids_to_delete = [10, 11, 18, 16, 15, 13, 9, 8, 7, 6, 5]

print(f"Attempting to delete products with IDs: {ids_to_delete}")

# Check which ones exist before deleting for better reporting
existing_ids = list(Product.objects.filter(id__in=ids_to_delete).values_list('id', flat=True))
print(f"Found {len(existing_ids)} products to delete: {existing_ids}")

if existing_ids:
    deleted_count, _ = Product.objects.filter(id__in=ids_to_delete).delete()
    print(f"Successfully deleted {deleted_count} products.")
else:
    print("No matching products found to delete.")

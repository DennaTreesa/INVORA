import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor

def check_vendors():
    count = Vendor.objects.count()
    print(f"Total Vendors found: {count}")
    if count > 0:
        for v in Vendor.objects.all():
            print(f"- {v.name} (ID: {v.id})")
    else:
        print("No vendors found in database.")

if __name__ == "__main__":
    check_vendors()

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor

def update_vendor_emails():
    target_email = "dennatreesa46@gmail.com"
    count = Vendor.objects.all().update(email=target_email)
    print(f"✅ Successfully updated {count} vendors with email: {target_email}")

if __name__ == "__main__":
    update_vendor_emails()

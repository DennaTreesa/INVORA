import os
import django
from django.core.mail import send_mail
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor

def test_vendor_email():
    email_to_find = "dennathomas46@gmail.com"
    print(f"🔍 Looking for vendor with email: {email_to_find}")
    
    try:
        vendor = Vendor.objects.get(email=email_to_find)
        print(f"✅ Found Vendor: {vendor.name} (ID: {vendor.id})")
        print(f"   Email found in DB: '{vendor.email}'") # Check for hidden spaces
        
        print("\n📧 Attempting to send test email to this vendor...")
        
        if not vendor.email:
            print("❌ Vendor has no email field set!")
            return

        subject = "Test Notification for Denna Electronics"
        message = f"Hello {vendor.name},\n\nThis is a test to confirm your email is correctly stored and reachable from the system.\n\nRegards,\nINVORA Team"
        
        try:
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [vendor.email],
                fail_silently=False,
            )
            print(f"✅ Email sent successfully to {vendor.email}")
        except Exception as e:
             print(f"❌ Failed to send email: {e}")

    except Vendor.DoesNotExist:
        print("❌ Vendor not found in database!")
    except Vendor.MultipleObjectsReturned:
        print("❌ Multiple vendors found with this email!")

if __name__ == "__main__":
    test_vendor_email()

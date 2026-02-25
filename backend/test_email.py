import os
import django
from django.core.mail import send_mail
from django.conf import settings
import smtplib

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_email():
    print("📧 Testing Email Configuration...")
    print(f"Host: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
    print(f"User: {settings.EMAIL_HOST_USER}")
    # Mask password for security in logs
    masked_pwd = settings.EMAIL_HOST_PASSWORD[:2] + "****" if settings.EMAIL_HOST_PASSWORD else "None"
    print(f"Password: {masked_pwd}")

    try:
        send_mail(
            'Test Email from INVORA',
            'This is a test email to verify SMTP settings.',
            settings.EMAIL_HOST_USER,
            ['dennathomas46@gmail.com'], # Sending to the new vendor for test
            fail_silently=False,
        )
        print("✅ Email sent successfully!")
    except smtplib.SMTPAuthenticationError as e:
        print("\n❌ SMTP Authentication Error!")
        print(f"Error Code: {e.smtp_code}")
        print(f"Error Message: {e.smtp_error}")
        print("\n💡 TIP: If you are using Gmail, you MUST use an 'App Password', not your regular password.")
        print("1. Go to https://myaccount.google.com/security")
        print("2. Enable 2-Step Verification")
        print("3. Search for 'App Passwords'")
        print("4. Create one for 'Mail' and paste it into settings.py")
    except Exception as e:
        print(f"\n❌ Failed to send email: {e}")

if __name__ == "__main__":
    test_email()

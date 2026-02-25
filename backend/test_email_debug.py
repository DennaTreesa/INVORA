
import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings
import traceback

print(f"Testing email configuration...")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
# Mask password
masked_pwd = settings.EMAIL_HOST_PASSWORD[:4] + "***" if settings.EMAIL_HOST_PASSWORD else "None"
print(f"EMAIL_HOST_PASSWORD: {masked_pwd}")

try:
    print("\nAttempting to send test email...")
    send_mail(
        'Test Subject (Reply-To)',
        'Test Body with Reply-To',
        settings.EMAIL_HOST_USER,
        ['smartinventory05@gmail.com'],
        fail_silently=False,
        reply_to=['test@example.com']
    )
    print("✅ Email sent successfully!")
except Exception as e:
    print("❌ Failed to send email.")
    print("Error details:")
    traceback.print_exc()

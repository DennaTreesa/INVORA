import os
import django
import json
import requests
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

# 1. Create Test Admin
email = "testadmin@example.com"
password = "admin123"

try:
    user = User.objects.get(email=email)
    print(f"User {email} already exists. Updating password...")
    user.set_password(password)
    user.role = "admin"
    user.save()
except User.DoesNotExist:
    print(f"Creating new admin user {email}...")
    User.objects.create_user(email=email, password=password, role="admin", name="Test Admin")

print(f"✅ Admin ready: {email} / {password}")

# 2. Test Announcements API
print("\nTesting GET /api/announcements/ ...")
try:
    response = requests.get("http://127.0.0.1:8000/api/announcements/")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response:", response.json())
        print("✅ Announcements API is WORKING")
    else:
        print("❌ Announcements API FAILED")
        print(response.text)
except Exception as e:
    print(f"❌ Connection Failed: {e}")

# 3. Test Admin Login API
print(f"\nTesting POST /api/admin-login/ with {email}...")
try:
    payload = {"email": email, "password": password}
    response = requests.post("http://127.0.0.1:8000/api/admin-login/", json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response:", response.json())
        print("✅ Admin Login API is WORKING")
    else:
        print("❌ Admin Login API FAILED")
        print(response.text)
except Exception as e:
    print(f"❌ Connection Failed: {e}")

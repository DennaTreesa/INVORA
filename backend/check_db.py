import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Announcement

print("--- USERS ---")
for u in User.objects.all():
    print(f"ID: {u.id} | Email: {u.email} | Role: {u.role} | Active: {u.is_active} | Superuser: {u.is_superuser}")

print("\n--- ANNOUNCEMENTS ---")
announcements = Announcement.objects.all()
if announcements.exists():
    for a in announcements:
        print(f"ID: {a.id} | Title: {a.title}")
else:
    print("No announcements found.")

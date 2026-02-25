import os
import django
from django.contrib.auth.hashers import check_password

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Announcement

print("===== USERS =====")
users = User.objects.all()
if not users.exists():
    print("No users found!")
for u in users:
    print(f"ID: {u.id}")
    print(f"Email: {u.email}")
    print(f"Role: {u.role}")
    print(f"Is Staff: {u.is_staff}")
    print(f"Is Superuser: {u.is_superuser}")
    # Check if this user can login as admin
    if u.role == 'admin':
        print(f"-> VALID CANDIDATE FOR ADMIN LOGIN")
    else:
        print(f"-> NOT AN ADMIN")
    print("-" * 20)

print("\n===== ANNOUNCEMENTS =====")
announcements = Announcement.objects.all()
print(f"Total Announcements: {announcements.count()}")
for a in announcements:
    print(f"ID: {a.id} | Title: {a.title}")

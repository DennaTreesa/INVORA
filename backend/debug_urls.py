import os
import django
from django.urls import get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def print_urls(urlpatterns, prefix=""):
    for entry in urlpatterns:
        if hasattr(entry, 'url_patterns'):
            print_urls(entry.url_patterns, prefix + entry.pattern.regex.pattern)
        else:
            print(prefix + entry.pattern.regex.pattern)

print("Resolved URLs:")
print_urls(get_resolver().url_patterns)

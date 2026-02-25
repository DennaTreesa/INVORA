import os
import django

# Setup Django FIRST
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# THEN imports
from rest_framework.test import APIRequestFactory
import users.views
from users.views import create_sales_order
from users.models import Product

print(f"🔍 DEBUG: Loading views from: {users.views.__file__}")

def test_customer_email():
    print("🚀 Starting Customer Order Email Test...")
    product = Product.objects.first()
    payload = {
        "customer_name": "Test Customer",
        "customer_email": "smartinventory05@gmail.com",
        "payment_method": "Card",
        "items": [{"id": product.id, "quantity": 1}],
        "final_total": float(product.price)
    }
    factory = APIRequestFactory()
    request = factory.post('/api/sales/orders/', data=payload, format='json')

    try:
        response = create_sales_order(request)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            print("✅ Order Created Successfully!")
        else:
            print("❌ Order Creation Failed!")
    except Exception as e:
        print(f"💥 CRASHED: {e}")

if __name__ == "__main__":
    test_customer_email()

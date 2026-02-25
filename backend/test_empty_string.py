import os
import django
import json
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product
from users.views import update_product
from django.test import RequestFactory

def test_empty_string_update():
    print("--- Testing Empty String Update ---")
    
    p = Product.objects.create(
        name="Test Empty",
        category="Test",
        price=Decimal("100.00"),
        stock=10,
        discount_percentage=Decimal("20.00")
    )
    
    factory = RequestFactory()
    data = {"discount_percentage": ""} # Simulating cleared input
    request = factory.put(
        f'/api/update-product/{p.id}/',
        data=json.dumps(data),
        content_type='application/json'
    )
    
    try:
        response = update_product(request, p.id)
        print(f"Response Status: {response.status_code}")
        if response.status_code != 200:
             print(f"Response Content: {response.content}")
        
        p.refresh_from_db()
        print(f"Updated Discount: {p.discount_percentage}")
        
    except Exception as e:
        print(f"❌ Exception caught: {e}")
        
    p.delete()

if __name__ == "__main__":
    test_empty_string_update()

import os
import django
import json
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product
from django.test import RequestFactory
from users.views import update_product

def test_zero_discount_update():
    print("--- Testing Zero Discount Update ---")
    
    # 1. Create a product with a discount
    p = Product.objects.create(
        name="Test Update Product",
        category="Test",
        price=Decimal("100.00"),
        stock=10,
        discount_percentage=Decimal("20.00")
    )
    print(f"Created product with {p.discount_percentage}% discount.")

    # 2. Simulate Update Request with 0 discount
    factory = RequestFactory()
    data = {"discount_percentage": 0} # Sending integer 0
    request = factory.put(
        f'/api/update-product/{p.id}/',
        data=json.dumps(data),
        content_type='application/json'
    )
    
    try:
        response = update_product(request, p.id)
        print(f"Response Status: {response.status_code}")
        print(f"Response Content: {response.content}")
        
        p.refresh_from_db()
        print(f"Updated Discount Percentage: {p.discount_percentage}")
        
        if p.discount_percentage == 0:
            print("✅ Successfully updated to 0 using int 0")
        else:
            print("❌ Failed to update to 0 using int 0")

    except Exception as e:
        print(f"❌ Exception with int 0: {e}")

    # 3. Simulate Update Request with "0" string
    data = {"discount_percentage": "0"}
    request = factory.put(
        f'/api/update-product/{p.id}/',
        data=json.dumps(data),
        content_type='application/json'
    )
    
    try:
        response = update_product(request, p.id)
        p.refresh_from_db()
        print(f"Updated Discount Percentage (str '0'): {p.discount_percentage}")
        
        if p.discount_percentage == 0:
            print("✅ Successfully updated to 0 using str '0'")
        else:
            print("❌ Failed to update to 0 using str '0'")

    except Exception as e:
        print(f"❌ Exception with str '0': {e}")
        
    p.delete()

if __name__ == "__main__":
    test_zero_discount_update()

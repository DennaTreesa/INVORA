import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor, VendorProduct, Product
from django.db import transaction

def distribute_equally():
    print("🚀 Starting Equal Categorized Product Distribution...")

    with transaction.atomic():
        # 1. Clear Vendor Products
        print("\n--- Clearing all VendorProducts ---")
        vp_count = VendorProduct.objects.count()
        VendorProduct.objects.all().delete()
        print(f"  - Deleted {vp_count} vendor product(s).")

        # 2. Map Vendors by Category
        print("\n--- Mapping Vendors by Category ---")
        category_map = {}
        for vendor in Vendor.objects.all():
            cat = vendor.category.lower()
            if cat not in category_map:
                category_map[cat] = []
            category_map[cat].append(vendor)
        
        for cat, vendors in category_map.items():
            print(f"  - {cat.capitalize()}: {[v.name for v in vendors]}")

        # 3. Initialize Counters for Round-Robin
        v_index = {cat: 0 for cat in category_map.keys()}

        # 4. Distribute Products
        print("\n--- Distributing Products Equally ---")
        main_products = Product.objects.all()
        created_count = 0
        skipped_count = 0
        
        for p in main_products:
            p_cat = p.category.lower()
            
            # Normalize
            if "laptop" in p_cat:
                target_cat = "laptop"
            elif "phone" in p_cat or "iphone" in p_cat:
                target_cat = "phone"
            elif "gadget" in p_cat or "accessory" in p_cat or "accessories" in p_cat:
                target_cat = "gadget"
            else:
                target_cat = p_cat

            target_vendors = category_map.get(target_cat)
            
            if target_vendors:
                # Round-robin selection
                idx = v_index[target_cat]
                vendor = target_vendors[idx % len(target_vendors)]
                v_index[target_cat] += 1
                
                VendorProduct.objects.create(
                    vendor=vendor,
                    name=p.name,
                    cost_price=p.price,
                    stock=p.stock
                )
                created_count += 1
                print(f"  ✅ Assigned '{p.name}' to '{vendor.name}'")
            else:
                print(f"  ⚠️ No vendor found for category '{target_cat}'. Skipping '{p.name}'.")
                skipped_count += 1

        print(f"\n✨ Successfully assigned {created_count} products.")
        print("\n--- Final Counts ---")
        for v in Vendor.objects.all():
            print(f"  - {v.name}: {v.products.count()} items")

if __name__ == "__main__":
    distribute_equally()

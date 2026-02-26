import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Vendor, VendorProduct, Product
from django.db import transaction

def cleanup_and_sync():
    print("🚀 Starting Vendor Cleanup and Product Sync...")

    with transaction.atomic():
        # 1. Deduplicate Vendors
        print("\n--- Deduplicating Vendors ---")
        vendor_names = Vendor.objects.values_list('name', flat=True).distinct()
        for name in vendor_names:
            vendors = Vendor.objects.filter(name=name).order_by('id')
            if vendors.count() > 1:
                keep_vendor = vendors[0]
                duplicates = vendors[1:]
                print(f"  - Keeping vendor '{name}' (ID: {keep_vendor.id})")
                for dup in duplicates:
                    print(f"    - Deleting duplicate (ID: {dup.id})")
                    dup.delete()

        # 2. Clear Vendor Products
        print("\n--- Clearing all VendorProducts ---")
        vp_count = VendorProduct.objects.count()
        VendorProduct.objects.all().delete()
        print(f"  - Deleted {vp_count} vendor product(s).")

        # 3. Find target vendor (TechGiant Suppliers or first available)
        target_vendor = Vendor.objects.filter(name__icontains="TechGiant").first()
        if not target_vendor:
            target_vendor = Vendor.objects.first()
        
        if not target_vendor:
            print("❌ Error: No vendors found in database. Please add a vendor first.")
            return

        print(f"\n--- Syncing Products to Vendor: {target_vendor.name} (ID: {target_vendor.id}) ---")
        
        # 4. Sync Main Products to VendorProducts
        main_products = Product.objects.all()
        created_count = 0
        for p in main_products:
            VendorProduct.objects.create(
                vendor=target_vendor,
                name=p.name,
                cost_price=p.price,
                stock=p.stock
            )
            created_count += 1
            print(f"  ✅ Synced: {p.name}")

        print(f"\n✨ Successfully synced {created_count} products.")

if __name__ == "__main__":
    cleanup_and_sync()

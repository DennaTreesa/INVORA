import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

def add_more_products():
    print("🚀 Adding/Updating products with EXACT matching real images...")

    products = [

        # ─── PHONES ─────────────────────────────────────────────
        {
            "name": "Samsung Galaxy S23 Ultra",
            "category": "Phone",
            "price": 124999,
            "stock": 18,
            "discount_percentage": 5,
            "image_url": "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s918bzgcins/gallery/in-galaxy-s23-ultra-s918-446655-sm-s918bzgcins-534863401",
        },
        {
            "name": "Samsung Galaxy A54",
            "category": "Phone",
            "price": 38999,
            "stock": 30,
            "discount_percentage": 8,
            "image_url": "https://images.samsung.com/is/image/samsung/p6pim/in/sm-a546elbgins/gallery/in-galaxy-a54-5g-a546-sm-a546elbgins-535699126",
        },
        {
            "name": "OnePlus 11",
            "category": "Phone",
            "price": 61999,
            "stock": 22,
            "discount_percentage": 0,
            "image_url": "https://image01.oneplus.net/ebp/202301/31/1-m00-3f-45-cpgm7gmpzv-aagx7aaqq3zq1xw757.png",
        },
        {
            "name": "OnePlus Nord CE 3",
            "category": "Phone",
            "price": 26999,
            "stock": 35,
            "discount_percentage": 10,
            "image_url": "https://image01.oneplus.net/ebp/202307/05/1-m00-53-2f-cpgm7msoxokacjweaaewm4jswdy430.png",
        },
        {
            "name": "Xiaomi 13 Pro",
            "category": "Phone",
            "price": 79999,
            "stock": 14,
            "discount_percentage": 0,
            "image_url": "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-13-pro/specs/xiaomi-13-pro-black.png",
        },
        {
            "name": "Xiaomi Redmi Note 12 Pro",
            "category": "Phone",
            "price": 22999,
            "stock": 45,
            "discount_percentage": 12,
            "image_url": "https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-12-pro/specs/redmi-note-12-pro-blue.png",
        },
        {
            "name": "Vivo V27 Pro",
            "category": "Phone",
            "price": 34999,
            "stock": 28,
            "discount_percentage": 5,
            "image_url": "https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1677473037468/4a4dfd7460cc3e1b4e0d09d3fa36df49.png",
        },
        {
            "name": "Google Pixel 7",
            "category": "Phone",
            "price": 59999,
            "stock": 16,
            "discount_percentage": 7,
            "image_url": "https://lh3.googleusercontent.com/nu6FW7HFSmN3oFuiPBT1pHrpRpOqvxqOzVyNlVKG3JdqF2SOYF_CsO5oMKgB-h7DW7FJmPVuuOqVCYTrOyQ35bFXNBVeA=rw-e365-w1440",
        },
        {
            "name": "Motorola Edge 40",
            "category": "Phone",
            "price": 29999,
            "stock": 25,
            "discount_percentage": 0,
            "image_url": "https://motorolaimgrepo.vtexassets.com/arquivos/ids/156329-800-auto",
        },
        {
            "name": "Nokia G42 5G",
            "category": "Phone",
            "price": 18999,
            "stock": 40,
            "discount_percentage": 5,
            "image_url": "https://nokia-phones-cdn2.nokia.com/ms/media/nokia-phones-cms/nokia_g42_5g/Nokia-G42-5G-So-Pink-Front.png",
        },

        # ─── LAPTOPS ────────────────────────────────────────────
        {
            "name": "HP Spectre x360",
            "category": "Laptop",
            "price": 149990,
            "stock": 9,
            "discount_percentage": 0,
            "image_url": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08671960.png",
        },
        {
            "name": "HP Pavilion 15",
            "category": "Laptop",
            "price": 65990,
            "stock": 20,
            "discount_percentage": 10,
            "image_url": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08094450.png",
        },
        {
            "name": "Dell Inspiron 15",
            "category": "Laptop",
            "price": 72990,
            "stock": 15,
            "discount_percentage": 8,
            "image_url": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron/inspiron-15-3520.png",
        },
        {
            "name": "Acer Aspire 7",
            "category": "Laptop",
            "price": 62990,
            "stock": 12,
            "discount_percentage": 5,
            "image_url": "https://static.acer.com/up/Resource/Acer/Laptops/Aspire_7/Images/20220809/acer-aspire-7-a715-76g-main.png",
        },
        {
            "name": "Acer Predator Helios 300",
            "category": "Laptop",
            "price": 129990,
            "stock": 7,
            "discount_percentage": 0,
            "image_url": "https://static.acer.com/up/Resource/Acer/Gaming/Predator_Helios_300/Images/20220124/acer-predator-helios-300-ph315-55-main.png",
        },
        {
            "name": "MSI Raider GE76",
            "category": "Laptop",
            "price": 219900,
            "stock": 4,
            "discount_percentage": 0,
            "image_url": "https://asset.msi.com/resize/image/global/product/product_1639467855d3e5db97c86a03c22b2fa21f07ca5e1d.png62405b38d7f13f36bf4025e8.png",
        },
        {
            "name": "Lenovo ThinkPad X1 Carbon",
            "category": "Laptop",
            "price": 184990,
            "stock": 6,
            "discount_percentage": 0,
            "image_url": "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjQxNjg1fGltYWdlL3BuZ3xoMDYvaDMzLzE0NTUxNzYzNjkzNDA2LnBuZ3w5YzQ0OGRhOTJhNmEzN2Y4NjYzMWEzMGE5NDJlMDhlYmUwMjY3ZWE4N2FhZDIwY2Q2NGQ0OTFhNjY3YzhlYjI0/lenovo-thinkpad-x1-carbon-gen-11-hero.png",
        },
        {
            "name": "Lenovo IdeaPad Slim 5",
            "category": "Laptop",
            "price": 59990,
            "stock": 18,
            "discount_percentage": 10,
            "image_url": "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MTU1MTUyfGltYWdlL3BuZ3xoMzQvaGJkLzE0Mzk3MDQ3OTM2Mjg2LnBuZ3w5MzAyOTI0OWFkODljNzljZWI2MzA1ZGM5YmEyMjI5MWFhNzM2YzAzZGEyOTY4MWNhNTM5YThkOGFhZGY1MjQ4/ideapad-slim-5i-15-hero.png",
        },
        {
            "name": "Razer Blade 15",
            "category": "Laptop",
            "price": 249900,
            "stock": 5,
            "discount_percentage": 0,
            "image_url": "https://assets2.razerzone.com/images/pnx.assets/c7bde96d4aebdf4f5ef76a1a5b7f8264/razer-blade-15-2023-500x500.webp",
        },
        {
            "name": "Surface Laptop 5",
            "category": "Laptop",
            "price": 139990,
            "stock": 8,
            "discount_percentage": 5,
            "image_url": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4Zcrs?ver=cba7&q=90&m=6&h=450&w=600&b=%23FFFFFF&f=jpg&o=f&p=140&aim=true",
        },

        # ─── GADGETS / ACCESSORIES ──────────────────────────────
        {
            "name": "Sony WH-1000XM5 Headphones",
            "category": "Gadget",
            "price": 29990,
            "stock": 25,
            "discount_percentage": 15,
            "image_url": "https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
        },
        {
            "name": "Apple AirPods Pro 2",
            "category": "Gadget",
            "price": 24900,
            "stock": 30,
            "discount_percentage": 5,
            "image_url": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=532&hei=582&fmt=png-alpha&.v=1660803972361",
        },
        {
            "name": "Apple Watch Series 9",
            "category": "Gadget",
            "price": 41900,
            "stock": 20,
            "discount_percentage": 0,
            "image_url": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=750&hei=712&trim=1&fmt=p-jpg&.v=1693424608152",
        },
        {
            "name": "Samsung Galaxy Watch 6",
            "category": "Gadget",
            "price": 27999,
            "stock": 22,
            "discount_percentage": 8,
            "image_url": "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-watch/all-galaxy-watches/07172023/SM-R930NZKAXAA_001_Front_Graphite.jpg",
        },
        {
            "name": "Boat Rockerz 550 Headphones",
            "category": "Gadget",
            "price": 2499,
            "stock": 60,
            "discount_percentage": 30,
            "image_url": "https://rukminim2.flixcart.com/image/832/832/kqu6myw0/headphone/h/z/7/rockerz-550-boat-original-imag4dghgmtuzyfq.jpeg",
        },
        {
            "name": "JBL Charge 5 Speaker",
            "category": "Gadget",
            "price": 14999,
            "stock": 35,
            "discount_percentage": 10,
            "image_url": "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw0ddab1fd/JBL_CHARGE5_HERO_BLU_0063.png?sw=600&sh=600",
        },
        {
            "name": "Anker 65W GaN Charger",
            "category": "Gadget",
            "price": 3499,
            "stock": 80,
            "discount_percentage": 5,
            "image_url": "https://m.media-amazon.com/images/I/51WhI8XWJIL._SL1500_.jpg",
        },
        {
            "name": "Logitech MX Master 3 Mouse",
            "category": "Gadget",
            "price": 8995,
            "stock": 40,
            "discount_percentage": 0,
            "image_url": "https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png",
        },
        {
            "name": "Keychron K2 Mechanical Keyboard",
            "category": "Gadget",
            "price": 11999,
            "stock": 20,
            "discount_percentage": 0,
            "image_url": "https://www.keychron.com/cdn/shop/products/Keychron-K2-version-2-wireless-mechanical-keyboard-with-hot-swappable-switch-for-Mac-Windows-RGB-backlight-brown-switch_1946x.jpg",
        },
        {
            "name": "Samsung 27\" 4K Monitor",
            "category": "Gadget",
            "price": 36990,
            "stock": 12,
            "discount_percentage": 12,
            "image_url": "https://image-us.samsung.com/SamsungUS/home/computing/monitors/all-monitors/06282022/U28B550N_002_Front_Black.jpg",
        },
        {
            "name": "iPad Pro 12.9\" (M2)",
            "category": "Gadget",
            "price": 109900,
            "stock": 10,
            "discount_percentage": 0,
            "image_url": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210?wid=592&hei=696&fmt=jpeg&qlt=95&.v=1664411207213",
        },
        {
            "name": "Mi Smart Band 8",
            "category": "Gadget",
            "price": 3499,
            "stock": 75,
            "discount_percentage": 10,
            "image_url": "https://i02.appmifile.com/mi_files/images/product/mi-smart-band-8/mi-smart-band-8_m.png",
        },
        {
            "name": "Realme Buds Air 5",
            "category": "Gadget",
            "price": 2999,
            "stock": 50,
            "discount_percentage": 15,
            "image_url": "https://image.realme.com/content/dam/realmecoms/product_image/global/realme-buds-air-5/buds-air-5-index-1.png",
        },
        {
            "name": "DJI Mini 3 Drone",
            "category": "Gadget",
            "price": 54990,
            "stock": 8,
            "discount_percentage": 0,
            "image_url": "https://store.dji.com/cdn-cgi/image/format=auto/materials/product/dji-mini-3/20221108/c15d9a9a6d2f3b7e8a8f0ced0e1b5f36/dji-mini-3.jpg",
        },
        {
            "name": "GoPro Hero 12",
            "category": "Gadget",
            "price": 39990,
            "stock": 15,
            "discount_percentage": 5,
            "image_url": "https://community.gopro.com/t5/image/serverpage/image-id/216783iAA5C4DB17D63DB03/image-size/large?v=v2&px=999",
        },
        {
            "name": "Amazon Echo Dot (5th Gen)",
            "category": "Gadget",
            "price": 4499,
            "stock": 55,
            "discount_percentage": 20,
            "image_url": "https://m.media-amazon.com/images/I/718l9r7KQBL._AC_SL1500_.jpg",
        },
        {
            "name": "Seagate 2TB Portable HDD",
            "category": "Gadget",
            "price": 5999,
            "stock": 45,
            "discount_percentage": 5,
            "image_url": "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/product-content/seagate-backup-plus/backup-plus-slim-2tb/backup-plus-slim-2tb-black-1000x1000.png",
        },
        {
            "name": "Samsung 1TB SSD (T7 Shield)",
            "category": "Gadget",
            "price": 8999,
            "stock": 35,
            "discount_percentage": 8,
            "image_url": "https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/portable-solid-state-drives/04152022/MU-PE1T0S_ZA_001_Front_Titan-Gray.jpg",
        },
        {
            "name": "Xiaomi Smart Projector 2",
            "category": "Gadget",
            "price": 54999,
            "stock": 6,
            "discount_percentage": 0,
            "image_url": "https://i02.appmifile.com/mi_files/images/product/xiaomi-smart-projector-2/xiaomi-smart-projector-2_index.png",
        },
        {
            "name": "TP-Link Wi-Fi 6 Router AX3000",
            "category": "Gadget",
            "price": 7999,
            "stock": 30,
            "discount_percentage": 5,
            "image_url": "https://static.tp-link.com/Archer%20AX55_US_V1_1.0_01_large_1623820813255h.jpg",
        },
    ]

    created_count = 0
    updated_count = 0

    for p in products:
        obj, created = Product.objects.update_or_create(
            name=p["name"],
            defaults={
                "category": p["category"],
                "price": p["price"],
                "stock": p["stock"],
                "discount_percentage": p["discount_percentage"],
                "image_url": p["image_url"],
            },
        )
        if created:
            created_count += 1
            print(f"  ✅ Created: {p['name']}")
        else:
            updated_count += 1
            print(f"  🔄 Updated image: {p['name']}")

    print(f"\n🎉 Done! {created_count} created, {updated_count} images updated.")
    print(f"📦 Total products in DB: {Product.objects.count()}")

if __name__ == "__main__":
    add_more_products()

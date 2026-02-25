import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Product

names = [
    'Samsung Galaxy S23 Ultra', 'Samsung Galaxy A54', 'OnePlus 11', 'OnePlus Nord CE 3',
    'Xiaomi 13 Pro', 'Xiaomi Redmi Note 12 Pro', 'Vivo V27 Pro', 'Google Pixel 7',
    'Motorola Edge 40', 'Nokia G42 5G', 'HP Spectre x360', 'HP Pavilion 15',
    'Dell Inspiron 15', 'Acer Aspire 7', 'Acer Predator Helios 300', 'MSI Raider GE76',
    'Lenovo ThinkPad X1 Carbon', 'Lenovo IdeaPad Slim 5', 'Razer Blade 15', 'Surface Laptop 5',
    'Sony WH-1000XM5 Headphones', 'Apple AirPods Pro 2', 'Apple Watch Series 9',
    'Samsung Galaxy Watch 6', 'Boat Rockerz 550 Headphones', 'JBL Charge 5 Speaker',
    'Anker 65W GaN Charger', 'Logitech MX Master 3 Mouse', 'Keychron K2 Mechanical Keyboard',
    'Samsung 27" 4K Monitor', 'iPad Pro 12.9" (M2)', 'Mi Smart Band 8', 'Realme Buds Air 5',
    'DJI Mini 3 Drone', 'GoPro Hero 12', 'Amazon Echo Dot (5th Gen)', 'Seagate 2TB Portable HDD',
    'Samsung 1TB SSD (T7 Shield)', 'Xiaomi Smart Projector 2', 'TP-Link Wi-Fi 6 Router AX3000'
]

deleted, _ = Product.objects.filter(name__in=names).delete()
print(f'Deleted {deleted} products.')
print(f'Remaining products in DB: {Product.objects.count()}')

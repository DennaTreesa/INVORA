import requests
try:
    res = requests.get("http://localhost:8000/api/products/")
    print(f"Status: {res.status_code}")
    print(f"Data: {res.json()[:2] if res.status_code == 200 else 'Error'}")
except Exception as e:
    print(f"Error: {e}")

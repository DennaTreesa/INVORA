import requests

API_URL = "http://127.0.0.1:8000/api/vendors/"

try:
    print(f"Testing GET {API_URL} ...")
    response = requests.get(API_URL)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        vendors = response.json()
        print(f"Success! Found {len(vendors)} vendors.")
        for v in vendors:
            print(f"- {v.get('name')} ({v.get('category')})")
    else:
        print(f"Failed. Response: {response.text}")

except Exception as e:
    print(f"Error: {e}")

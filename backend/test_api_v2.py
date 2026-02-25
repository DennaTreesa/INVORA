import requests

print("Testing GET http://127.0.0.1:8000/api/announcements/ ...")
try:
    response = requests.get("http://127.0.0.1:8000/api/announcements/")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Failed. Response text (first 1000 chars):")
        print(response.text[:1000])
except Exception as e:
    print(f"Connection failed: {e}")

print("\n------------------------------------------------\n")

print("Testing POST http://127.0.0.1:8000/api/admin-login/ ...")
try:
    # Use known credential
    response = requests.post("http://127.0.0.1:8000/api/admin-login/", json={
        "email": "testadmin@example.com",
        "password": "admin123"
    })
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Failed. Response text:")
        print(response.text[:1000])
except Exception as e:
    print(f"Connection failed: {e}")

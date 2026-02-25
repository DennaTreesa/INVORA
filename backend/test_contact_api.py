
import urllib.request
import json
import traceback

url = "http://localhost:8000/api/contact-us/"
data = {
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from debug script."
}

headers = {
    "Content-Type": "application/json"
}

try:
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method="POST")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print("Error:")
    traceback.print_exc()

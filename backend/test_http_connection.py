import urllib.request
import json
import ssl

def test_connection():
    url = "http://127.0.0.1:8000/api/sales/orders/"
    print(f"📡 Connecting to {url}...")
    
    payload = {
        "customer_name": "HTTP Test",
        "customer_email": "smartinventory05@gmail.com",
        "items": [] # Empty items should trigger 400 Bad Request but still hit the view
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        # Create unverified context to avoid SSL errors just in case
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=context) as response:
            print(f"✅ Response Code: {response.getcode()}")
            print(f"✅ Response Body: {response.read().decode()}")
            print("👉 The view WAS reached!")
            
    except urllib.error.HTTPError as e:
        print(f"⚠️ HTTP Error: {e.code} - {e.read().decode()}")
        print("👉 The view WAS reached (probably)!")
    except urllib.error.URLError as e:
        print(f"❌ Connection Failed: {e.reason}")
        print("👉 Server is NOT reachable at this address.")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    test_connection()

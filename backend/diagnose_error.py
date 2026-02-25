import requests
import re

def test_url(url, method="GET", json_data=None):
    print(f"Testing {method} {url} ...")
    try:
        if method == "POST":
            response = requests.post(url, json=json_data)
        else:
            response = requests.get(url)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            # Try to extract Django error
            text = response.text
            title = re.search(r'<title>(.*?)</title>', text)
            exception = re.search(r'class="exception_value">(.*?)<', text, re.DOTALL)
            
            if title:
                print(f"Page Title: {title.group(1)}")
            if exception:
                print(f"Exception: {exception.group(1).strip()}")
            else:
                # If no exception found, maybe it's a 404 list
                if "Using the URLconf defined" in text:
                    print("This is a 404 Page. Analyzing patterns...")
                    patterns = re.findall(r'\^.*', text)
                    print(f"Found {len(patterns)} URL patterns in 404 page.")
                    # for p in patterns[:5]: print(p)

    except Exception as e:
        print(f"Connection failed: {e}")

test_url("http://127.0.0.1:8000/api/announcements/")
test_url("http://127.0.0.1:8000/api/admin-login/", method="POST", json_data={"email": "testadmin@example.com", "password": "admin123"})

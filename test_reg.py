import requests
import json

url = "http://127.0.0.1:8000/api/users/register/"
headers = {"Content-Type": "application/json"}
data = {
    "username": "STU-COL-G-8-S9999",
    "password": "password123",
    "email": "teststudent9999@example.com",
    "role": "student",
    "name": "Test Student",
    "phone": "0771234567",
    "address": "123 Test St",
    "district": "COL",
    "current_grade": "G-8"
}

try:
    print(f"Sending request to {url}...")
    print(f"Data: {json.dumps(data, indent=2)}")
    response = requests.post(url, json=data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
        
except Exception as e:
    print(f"An error occurred: {e}")

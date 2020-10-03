import requests 


url = "http://127.0.0.1:8000/addmail"
data = {
    "username":"chenxiaojain",
    "sms":"123",
    "write_phone":"1123",
    "accept_phone":"1123"
}

r = requests.post(url=url, json=data)
print("11")
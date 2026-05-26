import json,random 
from datetime import datetime, timedelta, timezone
import requests

BACKEND_URL = "http://localhost:8000/analyze"

def generate_test_data(start_price:float,days:int,seed:int)->list:
    random.seed(seed)
    data = []
    current_price = start_price
    for i in range(days):
        date = (datetime.now(timezone.utc) - timedelta(days=days - i)).isoformat()
        price = current_price 
        
        for i in range(days):
            change = random.gauss(0.05,1.5)
            new_price = max(0.1, current_price + change)
            open = price
            close = new_price
            high = max(open, new_price) + random.uniform(0, 0.5)
            low = min(open, new_price) - random.uniform(0, 0.5)
            volume = random.uniform(1000, 5000)
            data.append({
                "time": date,
                "open": round(open, 2),
                "high": round(high, 2),
                "low": round(low, 2),
                "close": round(close, 2),
                "volume": volume
            })
        price  = new_price
    return data

def main():
    payload = {
        "uid": "test_user_001",
        "data": {
            "TEST": {
                "ticker": "TEST",
                "data": generate_test_data(100.0, 250, seed=42)
            }
        }}
    try:
        response = requests.post(BACKEND_URL, json=payload,timeout=10)
        response.raise_for_status()
        print("Response from backend:")
        print(json.dumps(response.json(), indent=4))
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with backend: {e}")
    print("Test completed.")

if __name__ == "__main__":
    main()
    
    
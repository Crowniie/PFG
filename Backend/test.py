import json,random 
from datetime import datetime, timedelta, timezone
import requests

BACKEND_URL = "http://localhost:8000/analyze"

#--------------------------Functions used to generate test data-----------------------------
def generate_test_data(date:datetime,close:float)->list[dict]:

    return {
        "time":date.isoformat(),
        "open": round(close -0.5, 2),
        "high": round(close, 2),
        "low": round(close -0.5, 2),
        "close": round(close, 2),
        "volume": random.uniform(1000, 5000),
        "volume_weighted_price": round(close -0.25, 2)  
    }
def build_price_series(closes:list, start_date:datetime = None)->list:
    if start_date is None:
        start_date = datetime(2025,1,1, tzinfo=timezone.utc)
    return [generate_test_data(start_date + timedelta(days=i), close) for i, close in enumerate(closes)]

#---------------------------Functions to generate specific triggers-----------------------------
def series_buy_100()->list[float]:
    """
    Generates a trigger at the end of the time series in the following way:
    Has a list of 200 days with price 100, then one price lowers to 99.5 generating a descending MACD and MA,
    Then the last day goes to 101 generating an upshift in MACD and crossing over the MA
    """
    closes = [100.0] * 200 + [99.5] + [101.0]
    return closes

def series_sell_100()->list[float]:
    """
    Generates a trigger at the end of the time series in the following way:
    Has a list of 200 days with price 100, then one price raises to 100.5 generating an ascending MACD and MA,
    Then the last day goes to 99 generating a downshift in MACD and crossing under the MA
    """
    closes = [100.0] * 200 + [100.5] + [99.0]
    return closes

def series_hold()->list[float]:
    """
    Generates a trigger at the end of the time series in the following way:
    Has a list of 200 days with price 100, then one price stays at 100 generating a neutral MACD and MA,
    Then the last day goes to 100 generating no shift in MACD and no crossing of the MA
    """
    closes = [100.0] * 200 + [100.0]
    return closes
def series_insufficient_data()->list[float]:
    """
    Generates a trigger at the end of the time series in the following way:
    Has a list of only 10 days with price 100, which is insufficient for MACD and MA calculations, so it should return HOLD
    """
    closes = [100.0] * 10
    return closes

#---------------------------Main function to run the test-----------------------------
EXPECTED_RESULTS = {
    "TEST_BUY_100": "BUY_100",
    "TEST_SELL_100": "SELL_100",
    "TEST_HOLD_100": "HOLD",
    "TEST_INSUFFICIENT_DATA": "HOLD"
} 

def main():
    payload = {
        "uid":"test_user",
        "data": {
            "TEST_BUY_100": {
                "ticker": "TEST_BUY_100",
                "data": build_price_series(series_buy_100())
            },
            "TEST_SELL_100": {
                "ticker": "TEST_SELL_100",
                "data": build_price_series(series_sell_100())
            },
            "TEST_HOLD_100": {
                "ticker": "TEST_HOLD_100",
                "data": build_price_series(series_hold())
            },
            "TEST_INSUFFICIENT_DATA": {
                "ticker": "TEST_INSUFFICIENT_DATA",
                "data": build_price_series(series_insufficient_data())
            }
        }
    }
    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=10)
        response.raise_for_status()
    except requests.exceptions.HTTPError:
        print(f"ERROR HTTP {response.status_code}:")
        try:
            error_detail = response.json()
            print(json.dumps(error_detail, indent=2, ensure_ascii=False))
        except Exception:
            print(response.text)
        return
    
    result = response.json()
    print("Received response:")
    print(json.dumps(result, indent=2))
    
    for signal in result["signals"]:
        expected = EXPECTED_RESULTS[signal["ticker"]]
    
        actual = signal["signal"]
        if actual == expected:
            print(f"{signal['ticker']}: PASS (Expected: {expected}, Actual: {actual})")
        else:
            print(f"{signal['ticker']}: FAIL (Expected: {expected}, Actual: {actual})")
        
        
if __name__ == "__main__":
    main()
    
    
from typing import Dict,List,Optional
def analyze_ticker(ticker:str, data:List[Dict])->Dict:
    #Extract closing prices from the provided data
    closing_data = [Data["close"] for Data in data]
    current_price = closing_data[-1]
    
    #Check if there is enough data to calculate the full 200 day MA
    if len(closing_data) < 200:
        return {
            "ticker": ticker,
            "signal": "hold",
            "reason": "Not enough data available for analysis",
            "price": current_price
        }
    #Calculate the 200 day moving average
    ma_200 = calculate_ma_200(closing_data)
    #Generate trading signal based on the current price and the 200 day MA
    return{
        "ticker": ticker,
        "signal":"hold",
        "reason":"hold",
        "price": current_price
    }
def calculate_ma_200(closing_data:List[float])->float:
    ma_200 = sum(closing_data[-200:]) / 200
    return ma_200

def calculate_ema(closing_data:List[float], period:int)->float:
    return NotImplementedError("EMA calculation is not implemented yet")

def calculate_macd(closing_data:List[float])->Dict:
    return NotImplementedError("MACD calculation is not implemented yet")
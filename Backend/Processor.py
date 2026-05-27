from typing import Dict,List,Optional
#------------------Helper Functions----------------------------------
def calculate_ma_200(closing_data:List[float])->float:
    if len (closing_data) < 200:
        return None
    
    ma_200 = sum(closing_data[-200:]) / 200
    return ma_200

def calculate_ema(closing_data:List[float], period:int)->List[float]:
    if len(closing_data) < period:
        return [None] * len(closing_data)
    alpha = 2/(period + 1)
    ema:List[float] = [closing_data[0]]  # Start with the first closing price as the initial EMA
    
    alpha = 2/(period + 1)
    ema:List = [None]*(period-1)
    seed = sum(closing_data[:period]) / period
    ema.append(seed)
    
    for i in range(1, len(closing_data)):
        previous = ema[-1]
        new_ema = alpha*closing_data[i] + (1-alpha)*previous
        ema.append(new_ema)
    return ema

def calculate_macd(closing_data:List[float])->Dict:
    return NotImplementedError("MACD calculation is not implemented yet")

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
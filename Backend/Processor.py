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

def calculate_macd(closing_data:List[float],)->Dict[str,List[Optional[float]]]:
    fast_ema = calculate_ema(closing_data, 12)
    slow_ema = calculate_ema(closing_data, 26)
    
    macd_line:List[Optional[float]] = []
    for fast, slow in zip(fast_ema, slow_ema):
        if fast is None or slow is None:
            macd_line.append(None)
        else:
            macd_line.append(fast - slow)
            
    #Fallback in case all of the series is none
    valid_start = len(closing_data)
    
    #Safeguard against insufficient data for MACD calculation
    for i in range(valid_start):
        if macd_line[i] is not None:
            valid_start = i
            break
    
    valid_macd_line:List[Optional[float]] = None
    
    for i in range(valid_start, len(closing_data)):
        valid_macd_line.append(macd_line[i])
    
    signal_line: List[Optional[float]] = []
    if len(valid_macd_line) < 9:
        for i in range(len(closing_data)):
            signal_line.append(None)
    else:
        signal_line = calculate_ema(valid_macd_line, 9)
        for i in range(valid_start):
            signal_line.append(None)
            
        for  value in valid_macd_line:
                signal_line.append(value)
                
    return {"macd_line": macd_line, "signal_line": signal_line}

#-------------------------Trigger detection functions----------------------------
def macd_cross(macd_today:Optional[float], macd_yesterday:Optional[float], signal_today:Optional[float], signal_yesterday:Optional[float])->str:
   
    if macd_today is None or macd_yesterday is None or signal_today is None or signal_yesterday is None:
        return None
    
    was_below = macd_yesterday < signal_yesterday
    is_above = macd_today > signal_today
    
    if was_below and is_above:
        return "upward_cross"

    was_above = macd_yesterday > signal_yesterday
    is_below = macd_today < signal_today
    if was_above and is_below:
        return "downward_cross"
    
    return None 
def ma_cross(current_price:float, previous_price:float, ma_today:Optional[float], ma_yesterday:Optional[float])->str:
    if ma_today is None or ma_yesterday is None:
        return None
    
    was_below = previous_price < ma_yesterday
    is_above = current_price > ma_today
    
    if was_below and is_above:
        return "upward_cross"
    
    was_above = previous_price > ma_yesterday
    is_below = current_price < ma_today
    if was_above and is_below:
        return "downward_cross"
    
    return None
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
    #Calculate Indicators:
    ma_today = calculate_ma_200(closing_data)
    ma_yesterday = calculate_ma_200(closing_data[:-1])
    macd_today = calculate_macd(closing_data)["macd_line"][-1]
    macd_yesterday = calculate_macd(closing_data[:-1])["macd_line"][-2]
    signal_today = calculate_macd(closing_data)["signal_line"][-1]
    signal_yesterday = calculate_macd(closing_data[:-1])["signal_line"][-2]
    
    macd_cross_result = macd_cross(macd_today, macd_yesterday, signal_today, signal_yesterday)
    ma_cross_result = ma_cross(current_price, closing_data[-2], ma_today, ma_yesterday)
    
    #Check to see if signals 
    price_above_ma = current_price > ma_today
    price_below_ma = current_price < ma_today
    
    if ma_cross_result == "upward_cross" and price_above_ma:
        return {
            "ticker": ticker,
            "signal": "buy",
            "reason": f"The price cut the MA(200) above, indicating a potential trend upwards.",
            "price": round(current_price, 4)
        }
    if ma_cross_result == "upward_cross" and price_below_ma:
        return _build_response(
            ticker, "BUY_100",
            reason="The price cut the MA(200) above, indicating a potential trend upwards.",
            current_price=current_price, ma200=ma_today,
            macd_value=macd_today, macd_signal=signal_today,
        )
 
    if ma_cross_result == "downward_cross" and price_above_ma:
        return _build_response(
            ticker, "SELL_100",
            reason="MA (200) was cut downwards by the price, indicating a potential trend downwards (strong exit signal)",
            current_price=current_price, ma200=ma_today,
            macd_value=macd_today, macd_signal=signal_today,
        )
 
    if macd_cross_result == "upward_cross" and price_below_ma:
        return _build_response(
            ticker, "BUY_50",
            reason="MACD indicator showed an upward cross while the price is below the MA200, indicating a potential strengthening of the uptrend (partial entry signal)",
            current_price=current_price, ma200=ma_today,
            macd_value=macd_today, macd_signal=signal_today,
        )
 
    if macd_cross_result == "downward_cross" and price_above_ma:
        return _build_response(
            ticker, "SELL_50",
            reason="MACD indicator showed a downward cross while the price is above the MA200, indicating a potential weakening of the uptrend (partial exit signal)",
            current_price=current_price, ma200=ma_today,
            macd_value=macd_today, macd_signal=signal_today,
        )
 
    return _build_response(
        ticker, "HOLD",
        reason="No indicator triggers",
        current_price=current_price, ma200=ma_today,
        macd_value=macd_today, macd_signal=signal_today,
    )
def _build_response(ticker:str, signal:str, reason:str, current_price:float, ma200:Optional[float], macd_value:Optional[float], macd_signal:Optional[float])->Dict:
    return {
        "ticker": ticker,
        "signal": signal,
        "reason": reason,
        "price": round(current_price, 4),
        "ma200": round(ma200,4) if ma200 is not None else None,
        "macd_value": round(macd_value, 4) if macd_value is not None else None,
        "macd_signal": round(macd_signal, 4) if macd_signal is not None else None
    }
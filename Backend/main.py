from datetime import datetime, timezone
from typing import Dict, List, Literal, Optional
#Note: although these imports might appear to not be correctyly immported, they are functional during deployment

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
 
from Processor import analyze_ticker, calculate_ema, calculate_ma_200_series, calculate_macd
from auth import verify_password, LoginRequest, LoginResponse, HashPasswordRequest, HashPasswordResponse, hash_password
app = FastAPI(
    title="Average price based advisor",
    description="Processes data and returns signals"
)

#------------------------Data Models For Data Entrance------------------------
class Data(BaseModel):
    time:str = Field(..., description="Time of the data point in ISO format", example="2026-01-01T00:00:00Z")
    open:float = Field(..., description="Opening price of the ticker", example=100.0)
    close:float = Field(..., description="Closing price of the ticker", example=110.0)
    high:float = Field(..., description="Highest price of the ticker", example=120.0)
    low:float = Field(..., description="Lowest price of the ticker", example=90.0)
    volume:float = Field(..., description="Volume of the ticker", example=1000.0)
    volume_weighted_price:Optional[float] = Field(None, description= "Volume weighted price of the ticker",example= 105.0)
    
class TickerData(BaseModel):
    ticker:str = Field(..., description="Ticker symbol", example="AAPL")
    data:List[Data] = Field(..., description="List of data points for the ticker") 
    
class RequestProcessing(BaseModel):
    uid:str = Field(..., description="Unique identifier for the user", example="user_001")
    data:Dict[str, TickerData] = Field(..., description="Ticker data for multiple tickers, Example: {'AAPL': Data(...), 'GOOGL': Data(...)}")    
    
    
#------------------------Data Models For Data Exist--------------------------------    
SignalType = Literal["BUY_100", "SELL_100", "BUY_50", "SELL_50", "HOLD"]
class TickerResponse(BaseModel):
    ticker:str = Field(..., description="Ticker symbol", example="AAPL")
    signal:SignalType = Field(..., description="Trading signal for the ticker", example="BUY_100")
    reason:str = Field(..., description="Reason for the trading signal", example="The price cut the MA(200) above, indicating a potential trend upwards.")
    price:float = Field(..., description="Current price of the ticker", example=110.0)
    ma200:Optional[float] = Field(None, description="200 day moving average of the ticker", example=105.0)
    macd_value:Optional[float] = Field(None, description="Current MACD value", example=0.5)
    macd_signal:Optional[float] = Field(None, description="Current MACD signal value", example=0.3)

class ResponseStructure(BaseModel):
    uid:str = Field(..., description="Unique identifier for the user", example="user_001")
    timestamp:str = Field(..., description="Time of the response in ISO format", example="2026-01-01T00:00:00Z")
    signals:List[TickerResponse] = Field(..., description="List of trading signals for the tickers")
    
# ---- Models for /chart-data -------------------------------------------------

class ChartBar(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    volume_weighted_price: Optional[float] = None


class ChartDataRequest(BaseModel):
    symbol: str
    bars: List[ChartBar]


class ChartIndicator(BaseModel):
    time: str
    close: float
    ma200: Optional[float] = None
    macd: Optional[float] = None
    signal: Optional[float] = None
    histogram: Optional[float] = None


class ChartDataResponse(BaseModel):
    symbol: str
    indicators: List[ChartIndicator] 
#------------------------API Endpoints------------------------
@app.get("/")
def read_root():
    """Healthcheck"""
    return {"status": "ok", "service": "investment-advisor-backend"}

@app.post("/analyze", response_model=ResponseStructure)

def analyze_ticker_data(request: RequestProcessing)->ResponseStructure:
    """Analyyzes the provided ticker data and returns the signals
    Expects body:
        {
          "user_id": "user_001",
          "tickers_data": {
            "AAPL": {"bars": [{"t": "...", "o": ..., "h": ..., "l": ..., "c": ..., "v": ...}, ...]},....
    }
    Returns body:
        {
          "user_id": "user_001",
          "timestamp": "2026-01-01T00:00:00Z",
          "signals": [
            {
              "ticker": "AAPL",
              "signal": "BUY_100",
              "reason": "The price cut the MA(200) above, indicating a potential trend upwards.",
              "price": 110.0
            },...
    Raises:
        -HtttpException 400: If the input data is invalid or if the analysis fails.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="Error, no ticker data provided")
    #Initialize the response structure
    signals:List[TickerData] = []
    #Process each ticker data
    for ticker, ticker_data in request.data.items():
    #In case a specific ticker dosent have data, we will return a hold singnal to avoid botching remaining tickers if there is no specific data just for one ticker
        if not ticker_data.data:
            signals.append(
                TickerResponse(
                    ticker=ticker,
                    signal="HOLD",
                    reason="No hay datos disponibles",
                    price=0.0,
                ))
            continue
    
        data_list = [data.model_dump() for data in ticker_data.data]
        result = analyze_ticker(ticker, data_list)
        signals.append(TickerResponse(**result))
    
    return ResponseStructure(
        uid=request.uid,
        timestamp=datetime.now(timezone.utc).isoformat(),
        signals=signals,
    )

@app.post("/auth/verify-password", response_model = LoginResponse)
def auth_verify_password(payload: LoginRequest):
    
    is_valid = verify_password(payload.submitted_password, payload.stored_password)
    return LoginResponse(success = is_valid)

@app.post("/auth/hash-password", response_model = HashPasswordResponse)
def auth_hash_password(payload: HashPasswordRequest):
    
    hashed = hash_password(payload.password)
    return HashPasswordResponse(hash = hashed)

@app.post("/chart-data", response_model=ChartDataResponse)
def chart_data(payload: ChartDataRequest):
    """Compute MA200, MACD and signal line aligned to the provided bars.

    Receives bars from n8n (which fetched them from Alpaca), runs the same
    indicator calculations used by /analyze, and returns one indicator
    point per input bar. The frontend uses this to draw the chart.
    """
    bars = payload.bars
    if not bars:
        return ChartDataResponse(symbol=payload.symbol, indicators=[])

    closes = [b.close for b in bars]

    ma200_series = calculate_ma_200_series(closes)
    macd_result = calculate_macd(closes)
    macd_line = macd_result["macd_line"]
    signal_line = macd_result["signal_line"]

    indicators = []
    for i, bar in enumerate(bars):
        ma200_val = ma200_series[i] if i < len(ma200_series) else None
        macd_val = macd_line[i] if i < len(macd_line) else None
        signal_val = signal_line[i] if i < len(signal_line) else None

        histogram = None
        if macd_val is not None and signal_val is not None:
            histogram = macd_val - signal_val

        indicators.append(ChartIndicator(
            time=bar.time,
            close=bar.close,
            ma200=round(ma200_val, 4) if ma200_val is not None else None,
            macd=round(macd_val, 4) if macd_val is not None else None,
            signal=round(signal_val, 4) if signal_val is not None else None,
            histogram=round(histogram, 4) if histogram is not None else None,
        ))

    return ChartDataResponse(symbol=payload.symbol, indicators=indicators)
    
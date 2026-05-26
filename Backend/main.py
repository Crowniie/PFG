from fastapi import FastAPI
from datetime import datetime, timezone
from typing import Dict, List, Literal, Optional
 
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
 
from Processor import analyze_ticker
 
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
    
    
#------------------------Data Models For Data Exist    
signals = Literal["buy", "sell", "hold"]
class TickerResponse(BaseModel):
    ticker:str = Field(..., description="Ticker symbol", example="AAPL")
    signal:signals = Field(..., description="Trading signal for the ticker", example="buy")
    reason:str = Field(..., description="Reason for the trading signal", example="The price cut the MA(200) above, indicating a potential trend upwards.")
    price:float = Field(..., description="Current price of the ticker", example=110.0)

class ResponseStructure(BaseModel):
    uid:str = Field(..., description="Unique identifier for the user", example="user_001")
    timestamp:str = Field(..., description="Time of the response in ISO format", example="2026-01-01T00:00:00Z")
    signals:List[TickerResponse] = Field(..., description="List of trading signals for the tickers")
    
    
#------------------------API Endpoints------------------------
@app.get("/")
def read_root():
    """Healthcheck basico."""
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
              "signal": "buy",
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
    
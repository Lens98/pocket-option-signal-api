from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "API is running"}

@app.get("/get-signal")
def get_signal():
    return {
        "asset": "EUR/USD",
        "signal": "CALL",
        "timeframe": "1m",
        "confidence": "High"
    }

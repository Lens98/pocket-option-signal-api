from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/")
def root():
    return {"status": "API is running"}

@app.get("/get-signal")
def get_signal():
    return {
        "asset": "EUR/USD",
        "signal": random.choice(["CALL", "PUT"]),
        "timeframe": "1m",
        "confidence": random.choice(["Low", "Medium", "High"])
    }


from fastapi import FastAPI
import random
import os

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Pocket Option Signal API is running"}

@app.get("/signal")
def get_signal():
    return {
        "asset": "EUR/USD",
        "signal": random.choice(["CALL", "PUT"]),
        "timeframe": "1m",
        "expiry": "next candle",
        "confidence": random.choice(["low", "medium", "high"])
    }

# Render uses PORT environment variable
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)

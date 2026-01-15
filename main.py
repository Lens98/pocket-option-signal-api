from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

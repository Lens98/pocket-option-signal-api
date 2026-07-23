from fastapi import FastAPI
from app.services.signal_service import generate_signal
from app.models.signal import Signal

app = FastAPI()

@app.get("/")
def root():
    return {"status": "API is running"}

@app.get("/get-signal", response_model=Signal)
def get_signal():
    return generate_signal()
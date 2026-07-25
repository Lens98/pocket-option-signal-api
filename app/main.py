from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.signal_service import generate_signal
from app.models.signal import Signal
from app.api.market import router as market_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_router)


@app.get("/")
def root():
    return {"status": "API is running"}


@app.get("/get-signal", response_model=Signal)
def get_signal():
    return generate_signal()
class Settings:

    # Trading
    DEFAULT_ASSET = "EUR/USD"
    DEFAULT_TIMEFRAME = "1m"

    # Risk
    MIN_CONFIDENCE = 50
    MAX_CONSECUTIVE_LOSSES = 3
    RISK_PERCENT = 0.02

    # Indicators
    EMA_FAST = 20
    EMA_MIDDLE = 50
    EMA_SLOW = 200

    RSI_PERIOD = 14
    RSI_OVERBOUGHT = 70
    RSI_OVERSOLD = 30

    MACD_FAST = 12
    MACD_SLOW = 26
    MACD_SIGNAL = 9

    # Support & Resistance
    SWING_LOOKBACK = 2

    # Backtesting
    MIN_HISTORY = 200


settings = Settings()
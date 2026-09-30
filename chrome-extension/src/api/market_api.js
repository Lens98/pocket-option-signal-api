export function sendMarket(asset, timeframe, candles, options = {}) {
    return new Promise((resolve) => {
        const mode = options.mode || "full";

        const payloadCandles =
            mode === "incremental"
                ? candles.slice(-1)
                : candles;

        const payload = {
            asset,
            timeframe: String(timeframe),

            candles: payloadCandles.map((candle) => ({
                timestamp: String(candle.timestamp),
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                volume: candle.volume ?? 0,
            })),
        };

        const history = candles.map((candle) => ({
            timestamp: String(candle.timestamp),
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume ?? 0,
        }));

        console.log("Sending market data:", {
            asset,
            mode,
            candlesSent: payload.candles.length,
            localHistory: history.length,
        });

        chrome.runtime.sendMessage(
            {
                type: "SEND_MARKET",
                payload,
                history,
                mode,
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(
                        "Background communication error:",
                        chrome.runtime.lastError.message
                    );

                    resolve(null);
                    return;
                }

                console.log("Market API response:", response);
                resolve(response || null);
            }
        );
    });
}
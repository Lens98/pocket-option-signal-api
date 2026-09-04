export function sendMarket(asset, timeframe, candles) {
    return new Promise((resolve) => {
        const payload = {
            asset,
            timeframe: String(timeframe),

            candles: candles.map((candle) => ({
                timestamp: String(candle.timestamp),
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                volume: candle.volume ?? 0,
            })),
        };

        console.log("======================================");
        console.log("📤 Sending Candle History");
        console.log("Asset:", asset);
        console.log("Timeframe:", timeframe);
        console.log("Candles:", payload.candles.length);
        console.log("======================================");

        chrome.runtime.sendMessage(
            {
                type: "SEND_MARKET",
                payload,
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(
                        "❌ Background communication error:",
                        chrome.runtime.lastError.message
                    );

                    resolve(null);
                    return;
                }

                console.log("📥 Market API response:", response);

                resolve(response || null);
            }
        );
    });
}
const API = "http://127.0.0.1:8000";

export async function sendMarket(asset, timeframe, candles) {

    const payload = {

        asset,

        timeframe: String(timeframe),

        candles: candles.map(candle => ({

           timestamp: String(candle.timestamp),

            open: candle.open,

            high: candle.high,

            low: candle.low,

            close: candle.close,

            volume: candle.volume

        }))

    };

    console.log("======================================");
    console.log("📤 Sending Candle History");
    console.log("Asset:", asset);
    console.log("Candles:", payload.candles.length);

    console.log(
        "Unique:",
        new Set(
            payload.candles.map(c => c.timestamp)
        ).size
    );

    if (payload.candles.length > 0) {

        console.log(
            "First:",
            payload.candles[0].timestamp
        );

        console.log(
            "Last:",
            payload.candles[
                payload.candles.length - 1
            ].timestamp
        );

    }

    console.log(payload);

    console.log("======================================");

    try {

        const response = await fetch(
            `${API}/market/update`,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload)

            }
        );

        console.log(
            "HTTP Status:",
            response.status
        );

        const text = await response.text();

        console.log(text);

        return text;

    } catch (err) {

        console.error("❌ FastAPI Error");
        console.error(err);

        return null;

    }

}
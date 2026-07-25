const API = "http://127.0.0.1:8000";

export async function sendMarket(asset, timeframe, candles) {

    const payload = {

        asset,

        timeframe: String(timeframe),

        candles: candles.map(candle => ({

            timestamp: String(candle.openTime),

            open: candle.open,

            high: candle.high,

            low: candle.low,

            close: candle.close,

            volume: candle.volume

        }))

    };

    console.log("======================================");
    console.log("📤 Sending Candle History to FastAPI");
    console.log("Asset:", asset);
    console.log("Candles:", payload.candles.length);
    console.log(payload);
    console.log("======================================");

    try {

        const response = await fetch(`${API}/market/update`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        console.log("HTTP Status:", response.status);

        const text = await response.text();

        console.log("Response:");
        console.log(text);

        return text;

    } catch (err) {

        console.error("❌ FastAPI Error");
        console.error(err);

        return null;

    }

}
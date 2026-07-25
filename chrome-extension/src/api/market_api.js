const API = "http://127.0.0.1:8000";

export async function sendMarket(asset, timeframe, candles) {

    const payload = {

        asset,

        timeframe: String(timeframe),

        candles: candles.map(c => ({

            timestamp: String(c.openTime),

            open: c.open,

            high: c.high,

            low: c.low,

            close: c.close,

            volume: c.volume

        }))

    };

    console.log("=====================================");
    console.log("📤 Sending Candle History");
    console.log("Candles:", payload.candles.length);
    console.log(payload);
    console.log("=====================================");

    try {

        const response = await fetch(`${API}/market/update`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        console.log("HTTP:", response.status);

        const text = await response.text();

        console.log(text);

        return text;

    }

    catch (err) {

        console.error(err);

    }

}
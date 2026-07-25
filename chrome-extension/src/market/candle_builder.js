import { Candle } from "./candle.js";

export class CandleBuilder {

    constructor(timeframe = 10) {

        this.timeframe = timeframe;
        this.current = null;

    }

    update(tick) {

    const candleTime =
        Math.floor(tick.timestamp / this.timeframe) * this.timeframe;

    console.log("================================");
    console.log("Asset:", tick.asset);
    console.log("Timestamp:", tick.timestamp);
    console.log("Bucket:", candleTime);

    if (this.current) {
        console.log("Current Candle:", this.current.openTime);
        console.log("Difference:", candleTime - this.current.openTime);
    } else {
        console.log("Current Candle: NONE");
    }

    console.log("================================");

        // First candle
        if (!this.current) {

            this.current = new Candle(candleTime, this.timeframe);

            this.current.asset = tick.asset;
            this.current.open = tick.price;
            this.current.high = tick.price;
            this.current.low = tick.price;
            this.current.close = tick.price;
            this.current.volume = 1;

            console.log("🟢 Started first candle:", this.current);

            return null;

        }

        // Candle closed
        if (candleTime > this.current.openTime) {

            console.log("################################");
            console.log("CANDLE CLOSED");
            console.log("Previous:", this.current.openTime);
            console.log("New:", candleTime);

            const finished = this.current;

            this.current = new Candle(candleTime, this.timeframe);

            this.current.asset = tick.asset;
            this.current.open = tick.price;
            this.current.high = tick.price;
            this.current.low = tick.price;
            this.current.close = tick.price;
            this.current.volume = 1;

            console.log("🟢 Started new candle:", this.current);

            return finished;

        }

        // Update current candle
        this.current.close = tick.price;

        if (tick.price > this.current.high) {
            this.current.high = tick.price;
        }

        if (tick.price < this.current.low) {
            this.current.low = tick.price;
        }

        this.current.volume++;

        console.log("Updating candle:", this.current);

        return null;

    }

}
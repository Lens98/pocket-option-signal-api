export class CandleBuilder {

    constructor(timeframe = 10) {

        this.timeframe = timeframe;
        this.current = null;

    }

    update(tick) {

        const bucket =
            Math.floor(
                Number(tick.timestamp) / this.timeframe
            ) * this.timeframe;

        // -----------------------------
        // First candle
        // -----------------------------

        if (!this.current) {

            this.current = {

                asset: tick.asset,

                timeframe: this.timeframe.toString(),

                timestamp: bucket.toString(),

                open: tick.price,

                high: tick.price,

                low: tick.price,

                close: tick.price,

                volume: 1

            };

            return null;

        }

        // -----------------------------
        // Same candle
        // -----------------------------

        if (
            Number(this.current.timestamp) === bucket
        ) {

            this.current.high = Math.max(
                this.current.high,
                tick.price
            );

            this.current.low = Math.min(
                this.current.low,
                tick.price
            );

            this.current.close = tick.price;

            this.current.volume++;

            return null;

        }

        // -----------------------------
        // Candle closed
        // -----------------------------

        const closed = { ...this.current };

        this.current = {

            asset: tick.asset,

            timeframe: this.timeframe.toString(),

            timestamp: bucket.toString(),

            open: tick.price,

            high: tick.price,

            low: tick.price,

            close: tick.price,

            volume: 1

        };

        return closed;

    }

}
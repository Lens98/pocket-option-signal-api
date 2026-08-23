export class Candle {

    constructor(timestamp, timeframe) {

        this.timestamp = String(timestamp);

        this.timeframe = String(timeframe);

        this.asset = "";

        this.open = 0;
        this.high = 0;
        this.low = 0;
        this.close = 0;

        this.volume = 0;

    }

}
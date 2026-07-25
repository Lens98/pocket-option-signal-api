export class Candle {

    constructor(openTime, timeframe) {

        this.openTime = openTime;
        this.timeframe = timeframe;

        this.asset = "";

        this.open = null;
        this.high = null;
        this.low = null;
        this.close = null;

        this.volume = 0;

    }

}
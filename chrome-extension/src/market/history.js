export class CandleHistory {

    constructor(maxCandles = 300) {

        this.maxCandles = maxCandles;
        this.history = {};

    }

    add(candle) {

        if (!this.history[candle.asset]) {
            this.history[candle.asset] = [];
        }

        this.history[candle.asset].push(candle);

        if (this.history[candle.asset].length > this.maxCandles) {
            this.history[candle.asset].shift();
        }

        return this.history[candle.asset];

    }

    get(asset) {

        return this.history[asset] || [];

    }

    clear(asset) {

        this.history[asset] = [];

    }

}
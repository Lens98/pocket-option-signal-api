export class HistoryManager {

    constructor(limit = 300) {

        this.limit = limit;
        this.history = {};

    }

    add(candle) {

        if (!this.history[candle.asset]) {

            this.history[candle.asset] = [];

        }

        this.history[candle.asset].push(candle);

        if (this.history[candle.asset].length > this.limit) {

            this.history[candle.asset].shift();

        }

    }

    get(asset) {

        return this.history[asset] || [];

    }

}
import { CandleBuilder } from "./candle_builder.js";

export class MarketManager {

    constructor() {

        this.builders = {};

    }

    update(tick) {

        if (!this.builders[tick.asset]) {

            console.log("Creating CandleBuilder for", tick.asset);

            this.builders[tick.asset] = new CandleBuilder(10);

        }

        const candle = this.builders[tick.asset].update(tick);

        if (candle) {

            console.log("========== CLOSED CANDLE ==========");
            console.log(candle);

        }

        return candle;

    }

}
import {
    getTodayStatistics
} from "./api.js";


export async function loadTradeStatistics() {

    try {

        const stats =
            await getTodayStatistics();

        console.log(
            "Today's statistics:",
            stats
        );

        const winRate =
            document.getElementById("winRate");

        const wins =
            document.getElementById("wins");

        const losses =
            document.getElementById("losses");

        const profit =
            document.getElementById("profit");

        const accuracy =
            document.getElementById("accuracy");

        if (winRate)
            winRate.innerHTML =
                `${stats.win_rate ?? 0}%`;

        if (wins)
            wins.innerHTML =
                stats.wins ?? 0;

        if (losses)
            losses.innerHTML =
                stats.losses ?? 0;

        if (profit)
            profit.innerHTML =
                `$${stats.profit ?? 0}`;

        if (accuracy) {

            const winRateValue =
                stats.win_rate ?? 0;

            accuracy.innerHTML =
                winRateValue >= 80
                    ? "High"
                    : winRateValue >= 60
                    ? "Medium"
                    : "Low";

        }

    }

    catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

}
export async function loadTradeStatistics() {

    try {

        const response =
            await fetch(
                "https://pocket-option-signal-api-production.up.railway.app/trade/statistics"
            );

        const stats =
            await response.json();

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
            winRate.innerHTML = `${stats.win_rate}%`;

        if (wins)
            wins.innerHTML = stats.wins;

        if (losses)
            losses.innerHTML = stats.losses;

        if (profit)
    profit.innerHTML = `$${stats.profit ?? 0}`;

        if (accuracy)
            accuracy.innerHTML =
                stats.win_rate >= 80
                    ? "High"
                    : stats.win_rate >= 60
                    ? "Medium"
                    : "Low";

    }

    catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

}
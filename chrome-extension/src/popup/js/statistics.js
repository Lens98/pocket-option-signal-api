export async function loadTradeStatistics() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/trade/statistics"
            );

        const stats =
            await response.json();

        document.getElementById(
            "callCount"
        ).innerHTML =
            stats.wins;

        document.getElementById(
            "putCount"
        ).innerHTML =
            stats.losses;

        document.getElementById(
            "waitCount"
        ).innerHTML =
            stats.draws;

        document.getElementById(
            "totalCount"
        ).innerHTML =
            stats.total;

        if (document.getElementById("winRate")) {

            document.getElementById(
                "winRate"
            ).innerHTML =
                `${stats.win_rate}%`;

        }

        if (document.getElementById("profitTotal")) {

            document.getElementById(
                "profitTotal"
            ).innerHTML =
                "Coming Soon";

        }

    }

    catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

}
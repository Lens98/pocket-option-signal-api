export async function loadTradeHistory() {

    console.log("🔥 loadTradeHistory() called");

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/trade/all"
            );

        console.log("Response Status:", response.status);

        const trades =
            await response.json();

        console.log("Trades received:", trades);
        console.log("Trade count:", trades.length);

        const historyCount =
            document.getElementById("historyCount");

        if (historyCount) {

            historyCount.textContent =
                `${trades.length} Trades`;

        }

        const body =
            document.getElementById("historyBody");

        if (!body) {

            console.error("Missing element: historyBody");

            return;

        }

        body.innerHTML = "";

// Sort newest trades first
trades.sort(
    (a, b) =>
        new Date(b.entry_time) -
        new Date(a.entry_time)
);


trades.slice(0,50).forEach(trade => {

            const row =
                document.createElement("tr");

            const time = trade.entry_time
                ? new Date(trade.entry_time).toLocaleTimeString()
                : "--";

            const result = trade.result ?? "--";

            const resultClass =
                result === "--"
                    ? "pending"
                    : result.toLowerCase();

            const action =
                trade.action ?? "WAIT";

            row.innerHTML = `
                <td>${time}</td>
                <td>${trade.asset}</td>
                <td class="action-${action.toLowerCase()}">${action}</td>
                <td class="result-${resultClass}">${result}</td>
                <td>${trade.profit ?? "--"}</td>
                <td>${trade.confidence ?? "--"}%</td>
            `;

            body.appendChild(row);

        });

        console.log("Rows inserted:", body.children.length);

    }

    catch (error) {

        console.error("History Error:", error);

    }

}
export async function loadTradeHistory() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/trade/all"
            );

        const trades =
            await response.json();

        const body =
            document.getElementById(
                "historyBody"
            );

        body.innerHTML = "";

        trades.forEach(trade => {

           const row = document.createElement("tr");

const time = trade.entry_time
    ? new Date(trade.entry_time).toLocaleTimeString()
    : "--";

const result = trade.result ?? "--";

const resultClass = result === "--"
    ? "pending"
    : result.toLowerCase();

const action = trade.action ?? "WAIT";

row.innerHTML = `
    <td>${time}</td>

    <td>${trade.asset}</td>

    <td class="action-${action.toLowerCase()}">
        ${action}
    </td>

    <td>${trade.confidence}%</td>

    <td class="result-${resultClass}">
        ${result}
    </td>
`;

            body.appendChild(row);
 });

    }

    catch(error){

        console.error(
            "History Error:",
            error
        );

    }

}
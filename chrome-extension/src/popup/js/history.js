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

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${trade.time}</td>

                <td>${trade.asset}</td>

                <td class="action-${trade.action.toLowerCase()}">

                    ${trade.action}

                </td>

                <td>${trade.confidence}%</td>

                <td class="result-${trade.result.toLowerCase()}">

                    ${trade.result}

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
async function loadSignal() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/signal"
        );

        const signal = await response.json();

        const container = document.getElementById("signal");

        if (signal.status) {
            container.innerHTML = signal.status;
            return;
        }

        container.innerHTML = `
            <b>Asset:</b> ${signal.asset}<br><br>

            <b>Action:</b> ${signal.action}<br>

            <b>Confidence:</b> ${signal.confidence}%<br>

            <b>Risk:</b> ${signal.risk}<br>

            <b>Trend:</b> ${signal.trend}<br>

            <b>Expiration:</b> ${signal.expiration}
        `;

    } catch (error) {

        document.getElementById("signal").innerHTML =
            "Cannot connect to API";

        console.error(error);
    }

}

loadSignal();
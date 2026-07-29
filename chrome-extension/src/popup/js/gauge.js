export function updateGauge(confidence) {

    const percent = confidence;

    document.getElementById(
        "confidenceText"
    ).innerHTML =
        `${percent}%`;

    const circumference = 377;

    const offset =
        circumference -
        (percent / 100) *
        circumference;

    const gauge =
        document.getElementById(
            "gauge"
        );

    gauge.style.strokeDashoffset =
        offset;

    if (percent >= 80) {

        gauge.style.stroke =
            "#22C55E";

    }

    else if (percent >= 60) {

        gauge.style.stroke =
            "#FACC15";

    }

    else {

        gauge.style.stroke =
            "#EF4444";

    }

}
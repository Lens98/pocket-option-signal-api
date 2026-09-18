export function updateGauge(confidence) {

    const percent = Number(confidence ?? 0);

   const confidenceText =
    document.getElementById("confidence");

    const gauge =
        document.getElementById("gauge");

    if (!confidenceText) {

        console.error("Missing element: confidenceText");

        return;

    }

  if (!gauge) {

    // Gauge UI hasn't been added yet.
    return;

}

    confidenceText.innerHTML = `${percent}%`;

    const circumference = 377;

    const offset =
        circumference -
        (percent / 100) * circumference;

    gauge.style.strokeDashoffset = offset;

    if (percent >= 80) {

        gauge.style.stroke = "#22C55E";

    }

    else if (percent >= 60) {

        gauge.style.stroke = "#FACC15";

    }

    else {

        gauge.style.stroke = "#EF4444";

    }

}
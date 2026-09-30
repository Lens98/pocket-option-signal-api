/* ==========================================
   STATUS
========================================== */

export function setStatus(online) {

    const status =
        document.getElementById("status");

    if (!status) return;

    if (online) {

        status.innerHTML =
            "● Online";

        status.className =
            "status online";

    }

    else {

        status.innerHTML =
            "● Offline";

        status.className =
            "status offline";

    }

}

/* ==========================================
   LAST UPDATE
========================================== */

export function updateTimestamp() {

    const updated =
        document.getElementById("updated");

    if (!updated) return;

    const now =
        new Date();

    updated.innerHTML =
        now.toLocaleTimeString();

}

/* ==========================================
   NUMBER FORMAT
========================================== */

export function formatPercent(value) {

    return `${Number(value).toFixed(0)}%`;

}

export function formatPrice(value) {

    return Number(value).toFixed(5);

}

/* ==========================================
   MESSAGE
========================================== */

export function showMessage(message) {

    console.log(message);

}
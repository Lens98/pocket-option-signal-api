import {
    getSubscriptionPlans,
    submitPayment,
    getPaymentStatus
} from "./js/auth.js";

let paymentScreen = null;
let selectedPlan = null;

export function showPaymentScreen(user, onPaymentSubmitted) {
    console.log("PAYMENT FUNCTION STARTED");
    selectedPlan = null;

    if (paymentScreen) {
        paymentScreen.remove();
    }

    paymentScreen = document.createElement("div");
    paymentScreen.className = "auth-screen";
    paymentScreen.style.display = "flex";
    paymentScreen.style.visibility = "visible";
    paymentScreen.style.opacity = "1";
    paymentScreen.style.zIndex = "9999";
    paymentScreen.id = "paymentScreen";

    paymentScreen.innerHTML = `
        <div class="auth-card payment-card">
            <h2>Choose Your Subscription</h2>

            <p id="paymentMessage" class="auth-message"></p>

            <div id="subscriptionPlans"></div>

            <form id="paymentForm" style="display: none;">
                <label for="paymentMethod">Payment Method</label>
                <select id="paymentMethod" required>
                    <option value="">Select payment method</option>
                    <option value="crypto">Cryptocurrency</option>
                </select>

                <label for="transactionId">Transaction ID</label>
                <input
                    id="transactionId"
                    type="text"
                    placeholder="Enter transaction ID"
                    required
                />

                <label for="cryptoCurrency">Cryptocurrency</label>
                <select id="cryptoCurrency" required>
                    <option value="">Select cryptocurrency</option>
                    <option value="USDT">USDT</option>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum</option>
                </select>

                <label for="network">Network</label>
                <input
                    id="network"
                    type="text"
                    placeholder="Example: TRC20"
                    required
                />

                <label for="walletAddress">Wallet Address</label>
                <input
                    id="walletAddress"
                    type="text"
                    placeholder="Enter your wallet address"
                    required
                />

                <button type="submit">Submit Payment</button>
            </form>

            <button id="checkPaymentStatus" type="button">
                Check Payment Status
            </button>
               <!-- ADD THIS BUTTON -->
        <button
            id="closePayment"
            class="auth-link"
            type="button"
        >
            Close
        </button>

    </div>
`;


    document.body.appendChild(paymentScreen);
    console.log("PAYMENT SCREEN CREATED");
console.log("Payment element:", paymentScreen);
console.log("Payment screen ID:", paymentScreen.id);
console.log("Payment screen class:", paymentScreen.className);
console.log("Payment screen visible:", paymentScreen.offsetWidth, paymentScreen.offsetHeight);
    paymentScreen
    .querySelector("#closePayment")
    .addEventListener("click", () => {
        paymentScreen.remove();
        paymentScreen = null;
    });

    loadPlans();
    setupPaymentForm();
    setupStatusButton(onPaymentSubmitted);
}

async function loadPlans() {
    const plansContainer =
        paymentScreen.querySelector("#subscriptionPlans");

    try {
        const data = await getSubscriptionPlans();

        plansContainer.innerHTML = "";

        if (!Array.isArray(data.plans) || data.plans.length === 0) {
            plansContainer.innerHTML = `
                <p class="auth-error">
                    No subscription plans are available.
                </p>
            `;
            return;
        }

        data.plans.forEach((plan) => {
            const planButton = document.createElement("button");

            planButton.type = "button";
            planButton.className = "subscription-plan";

            planButton.innerHTML = `
                <strong>${plan.name}</strong>
                <span>$${Number(plan.price).toFixed(2)}</span>
                <small>${plan.duration_days} days</small>
            `;

            planButton.addEventListener("click", () => {
                paymentScreen
                    .querySelectorAll(".subscription-plan")
                    .forEach((button) => {
                        button.classList.remove("selected");
                    });

                planButton.classList.add("selected");

                selectedPlan = plan;

                paymentScreen.querySelector(
                    "#paymentForm"
                ).style.display = "block";
            });

            plansContainer.appendChild(planButton);
        });
    } catch (error) {
        plansContainer.innerHTML = `
            <p class="auth-error">
                ${error.message}
            </p>
        `;
    }
}

function setupPaymentForm() {
    const form = paymentScreen.querySelector("#paymentForm");
    const message = paymentScreen.querySelector("#paymentMessage");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!selectedPlan) {
            message.textContent = "Please choose a subscription plan.";
            return;
        }

        const submitButton = form.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            const paymentData = {
                plan: selectedPlan.id,
                amount: selectedPlan.price,
                payment_method:
                    paymentScreen.querySelector("#paymentMethod").value,
                transaction_id:
                    paymentScreen.querySelector("#transactionId").value.trim(),
                crypto_currency:
                    paymentScreen.querySelector("#cryptoCurrency").value,
                network:
                    paymentScreen.querySelector("#network").value.trim(),
                wallet_address:
                    paymentScreen.querySelector("#walletAddress").value.trim()
            };

            await submitPayment(paymentData);

            message.className = "auth-message auth-success";
            message.textContent =
                "Payment submitted successfully. Please wait for admin approval.";

            form.reset();
form.style.display = "none";

// Keep the user on the payment screen.
// The dashboard opens only after admin approval.
        } catch (error) {
            message.className = "auth-message auth-error";
            message.textContent = error.message;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Payment";
        }
    });
}

function setupStatusButton(onPaymentSubmitted) {
    const button =
        paymentScreen.querySelector("#checkPaymentStatus");

    const message =
        paymentScreen.querySelector("#paymentMessage");

    button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "Checking...";

        try {
            const data = await getPaymentStatus();

            if (data.subscription?.status === "active") {
                message.className =
                    "auth-message auth-success";

                message.textContent =
                    "Your subscription is active. Opening dashboard...";

                // Remove the payment page
                paymentScreen.remove();
                paymentScreen = null;

                // Open the dashboard
                if (typeof onPaymentSubmitted === "function") {
                    onPaymentSubmitted();
                }

            } else if (data.payment?.status === "pending") {
                message.className = "auth-message";

                message.textContent =
                    "Your payment is pending admin approval.";

            } else {
                message.className = "auth-message";

                message.textContent =
                    "No active subscription was found.";
            }

        } catch (error) {
            message.className =
                "auth-message auth-error";

            message.textContent = error.message;

        } finally {
            button.disabled = false;
            button.textContent = "Check Payment Status";
        }
    });
}
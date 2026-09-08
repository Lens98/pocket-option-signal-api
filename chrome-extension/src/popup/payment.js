import {
    getSubscriptionPlans,
    submitPayment,
    getPaymentStatus
} from "./js/auth.js";

let paymentScreen = null;
let selectedPlan = null;

export function showPaymentScreen(user, onPaymentSubmitted) {
    if (paymentScreen) {
        paymentScreen.remove();
    }

    paymentScreen = document.createElement("div");
    paymentScreen.className = "auth-screen";

    paymentScreen.innerHTML = `
        <div class="auth-card payment-card">
            <div class="auth-header">
                <h1>Choose Your Plan</h1>
                <p>Activate your subscription to access the trading platform.</p>
            </div>

            <div id="paymentMessage" class="auth-message"></div>

            <div id="subscriptionPlans" class="subscription-plans">
                <p>Loading plans...</p>
            </div>

            <form id="paymentForm" style="display: none;">
                <div class="form-group">
                    <label for="paymentMethod">Payment Method</label>
                    <select id="paymentMethod" required>
                        <option value="crypto">Cryptocurrency</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="cryptoCurrency">Cryptocurrency</label>
                    <select id="cryptoCurrency" required>
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                        <option value="BTC">Bitcoin</option>
                        <option value="ETH">Ethereum</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="network">Network</label>
                    <input
                        type="text"
                        id="network"
                        placeholder="Example: TRC20"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="transactionId">Transaction ID / Hash</label>
                    <input
                        type="text"
                        id="transactionId"
                        placeholder="Enter your transaction ID"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="walletAddress">Your Wallet Address</label>
                    <input
                        type="text"
                        id="walletAddress"
                        placeholder="Enter your wallet address"
                        required
                    />
                </div>

                <button type="submit" class="auth-button">
                    Submit Payment
                </button>
            </form>

            <button id="checkPaymentStatus" class="auth-secondary-button">
                Check Payment Status
            </button>
        </div>
    `;

    document.body.appendChild(paymentScreen);

    loadPlans();
    setupPaymentForm();
    setupStatusButton();
}

async function loadPlans() {
    const plansContainer =
        paymentScreen.querySelector("#subscriptionPlans");

    try {
        const data = await getSubscriptionPlans();

        plansContainer.innerHTML = "";

        data.plans.forEach((plan) => {
            const planButton = document.createElement("button");
            planButton.type = "button";
            planButton.className = "subscription-plan";

            planButton.innerHTML = `
                <strong>${plan.name}</strong>
                <span>$${plan.price.toFixed(2)}</span>
                <small>${plan.duration_days} days</small>
            `;

            planButton.addEventListener("click", () => {
                document
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

function setupStatusButton() {
    const button = paymentScreen.querySelector("#checkPaymentStatus");
    const message = paymentScreen.querySelector("#paymentMessage");

    button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "Checking...";

        try {
            const data = await getPaymentStatus();

            if (data.subscription?.status === "active") {
                message.className = "auth-message auth-success";
                message.textContent =
                    "Your subscription is active. You can access the platform.";
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
            message.className = "auth-message auth-error";
            message.textContent = error.message;
        } finally {
            button.disabled = false;
            button.textContent = "Check Payment Status";
        }
    });
}
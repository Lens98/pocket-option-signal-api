import {
    getSubscriptionPlans,
    submitPayment,
    getPaymentStatus
} from "./js/auth.js";

let paymentScreen = null;
let selectedPlan = null;
let selectedPaymentMethod = null;

export function showPaymentScreen(user, onPaymentSubmitted) {
    console.log("PAYMENT FUNCTION STARTED");

    selectedPlan = null;
    selectedPaymentMethod = null;

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

            <!-- ============================= -->
            <!-- SUBSCRIPTION PLANS -->
            <!-- ============================= -->

            <div id="subscriptionPlans"></div>

            <!-- ============================= -->
            <!-- PAYMENT FORM -->
            <!-- ============================= -->

            <form id="paymentForm" style="display: none;">

                <!-- PAYMENT METHOD -->

                <label for="paymentMethod">
                    Payment Method
                </label>

                <select id="paymentMethod" required>
                    <option value="">
                        Select payment method
                    </option>

                    <option value="stripe">
                        Stripe / Card
                    </option>

                    <option value="paypal">
                        PayPal
                    </option>

                    <option value="zelle">
                        Zelle
                    </option>

                    <option value="cash_app">
                        Cash App
                    </option>

                    <option value="crypto">
                        Cryptocurrency
                    </option>
                </select>

                <!-- ============================= -->
                <!-- PAYMENT INSTRUCTIONS -->
                <!-- ============================= -->

                <div
                    id="paymentInstructions"
                    style="display: none;"
                ></div>

                <!-- ============================= -->
                <!-- TRANSACTION ID -->
                <!-- ============================= -->

                <label for="transactionId">
                    Transaction ID
                </label>

                <input
                    id="transactionId"
                    type="text"
                    placeholder="Enter transaction ID"
                    required
                />

                <!-- ============================= -->
                <!-- CRYPTO FIELDS -->
                <!-- ============================= -->

                <div id="cryptoFields" style="display: none;">

                    <label for="cryptoCurrency">
                        Cryptocurrency
                    </label>

                    <select id="cryptoCurrency">
                        <option value="">
                            Select cryptocurrency
                        </option>

                        <option value="USDT">
                            USDT
                        </option>

                        <option value="BTC">
                            Bitcoin
                        </option>

                        <option value="ETH">
                            Ethereum
                        </option>
                    </select>

                    <label for="network">
                        Network
                    </label>

                    <input
                        id="network"
                        type="text"
                        placeholder="Example: TRC20"
                    />

                    <label for="walletAddress">
                        Wallet Address
                    </label>

                    <input
                        id="walletAddress"
                        type="text"
                        placeholder="Enter your wallet address"
                    />

                </div>

                <!-- ============================= -->
                <!-- SUBMIT -->
                <!-- ============================= -->

                <button type="submit">
                    Submit Payment
                </button>

            </form>

            <!-- ============================= -->
            <!-- CHECK STATUS -->
            <!-- ============================= -->

            <button
                id="checkPaymentStatus"
                type="button"
            >
                Check Payment Status
            </button>

            <!-- ============================= -->
            <!-- CLOSE -->
            <!-- ============================= -->

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
    console.log(
        "Payment screen visible:",
        paymentScreen.offsetWidth,
        paymentScreen.offsetHeight
    );

    // Close payment screen
    paymentScreen
        .querySelector("#closePayment")
        .addEventListener("click", () => {
            paymentScreen.remove();
            paymentScreen = null;
        });

    loadPlans();
    setupPaymentMethod();
    setupPaymentForm();
    setupStatusButton(onPaymentSubmitted);
}


// ======================================================
// LOAD SUBSCRIPTION PLANS
// ======================================================

async function loadPlans() {
    const plansContainer =
        paymentScreen.querySelector("#subscriptionPlans");

    try {
        const data = await getSubscriptionPlans();

        plansContainer.innerHTML = "";

        if (
            !Array.isArray(data.plans) ||
            data.plans.length === 0
        ) {
            plansContainer.innerHTML = `
                <p class="auth-error">
                    No subscription plans are available.
                </p>
            `;

            return;
        }

        data.plans.forEach((plan) => {

            const planButton =
                document.createElement("button");

            planButton.type = "button";
            planButton.className =
                "subscription-plan";

            planButton.innerHTML = `
                <strong>${plan.name}</strong>

                <span>
                    $${Number(plan.price).toFixed(2)}
                </span>

                <small>
                    ${plan.duration_days} days
                </small>
            `;

            planButton.addEventListener(
                "click",
                () => {

                    paymentScreen
                        .querySelectorAll(
                            ".subscription-plan"
                        )
                        .forEach((button) => {
                            button.classList.remove(
                                "selected"
                            );
                        });

                    planButton.classList.add(
                        "selected"
                    );

                    selectedPlan = plan;

                    const paymentForm =
                        paymentScreen.querySelector(
                            "#paymentForm"
                        );

                    paymentForm.style.display =
                        "block";

                    // Scroll payment form into view
                    paymentForm.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
            );

            plansContainer.appendChild(
                planButton
            );
        });

    } catch (error) {

        plansContainer.innerHTML = `
            <p class="auth-error">
                ${error.message}
            </p>
        `;
    }
}


// ======================================================
// PAYMENT METHOD
// ======================================================

function setupPaymentMethod() {

    const paymentMethod =
        paymentScreen.querySelector(
            "#paymentMethod"
        );

    const cryptoFields =
        paymentScreen.querySelector(
            "#cryptoFields"
        );

    const cryptoCurrency =
        paymentScreen.querySelector(
            "#cryptoCurrency"
        );

    const network =
        paymentScreen.querySelector(
            "#network"
        );

    const walletAddress =
        paymentScreen.querySelector(
            "#walletAddress"
        );

    const instructions =
        paymentScreen.querySelector(
            "#paymentInstructions"
        );

    paymentMethod.addEventListener(
        "change",
        () => {

            selectedPaymentMethod =
                paymentMethod.value;

            // Reset crypto fields
            cryptoFields.style.display =
                "none";

            cryptoCurrency.required =
                false;

            network.required =
                false;

            walletAddress.required =
                false;

            instructions.style.display =
                "none";

            instructions.innerHTML = "";


            // ==========================================
            // STRIPE
            // ==========================================

            if (
                selectedPaymentMethod ===
                "stripe"
            ) {

                instructions.style.display =
                    "block";

                instructions.innerHTML = `
                    <p>
                        Complete your payment using
                        Stripe / Card, then enter your
                        transaction ID below.
                    </p>
                `;
            }


            // ==========================================
            // PAYPAL
            // ==========================================

            else if (
                selectedPaymentMethod ===
                "paypal"
            ) {

                instructions.style.display =
                    "block";

                instructions.innerHTML = `
                    <p>
                        Complete your payment using
                        PayPal, then enter your
                        transaction ID below.
                    </p>
                `;
            }


            // ==========================================
            // ZELLE
            // ==========================================

            else if (
                selectedPaymentMethod ===
                "zelle"
            ) {

                instructions.style.display =
                    "block";

                instructions.innerHTML = `
                    <p>
                        Complete your payment using
                        Zelle, then enter your
                        transaction ID below.
                    </p>
                `;
            }


            // ==========================================
            // CASH APP
            // ==========================================

            else if (
                selectedPaymentMethod ===
                "cash_app"
            ) {

                instructions.style.display =
                    "block";

                instructions.innerHTML = `
                    <p>
                        Complete your payment using
                        Cash App, then enter your
                        transaction ID below.
                    </p>
                `;
            }


            // ==========================================
            // CRYPTO
            // ==========================================

            else if (
                selectedPaymentMethod ===
                "crypto"
            ) {

                cryptoFields.style.display =
                    "block";

                cryptoCurrency.required =
                    true;

                network.required =
                    true;

                walletAddress.required =
                    true;

                instructions.style.display =
                    "block";

                instructions.innerHTML = `
                    <p>
                        Complete your cryptocurrency
                        payment, then enter the
                        transaction details below.
                    </p>
                `;
            }
        }
    );
}


// ======================================================
// PAYMENT FORM
// ======================================================

function setupPaymentForm() {

    const form =
        paymentScreen.querySelector(
            "#paymentForm"
        );

    const message =
        paymentScreen.querySelector(
            "#paymentMessage"
        );

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            // ==========================================
            // PLAN CHECK
            // ==========================================

            if (!selectedPlan) {

                message.className =
                    "auth-message auth-error";

                message.textContent =
                    "Please choose a subscription plan.";

                return;
            }


            // ==========================================
            // PAYMENT METHOD CHECK
            // ==========================================

            if (!selectedPaymentMethod) {

                message.className =
                    "auth-message auth-error";

                message.textContent =
                    "Please choose a payment method.";

                return;
            }


            const submitButton =
                form.querySelector(
                    "button[type='submit']"
                );

            submitButton.disabled = true;
            submitButton.textContent =
                "Submitting...";


            try {

                // ======================================
                // BASIC PAYMENT DATA
                // ======================================

                const paymentData = {

                    plan: selectedPlan.id,

                    amount: selectedPlan.price,

                    payment_method:
                        selectedPaymentMethod,

                    transaction_id:
                        paymentScreen
                            .querySelector(
                                "#transactionId"
                            )
                            .value
                            .trim(),

                    crypto_currency:
                        null,

                    network:
                        null,

                    wallet_address:
                        null
                };


                // ======================================
                // CRYPTO DATA
                // ======================================

                if (
                    selectedPaymentMethod ===
                    "crypto"
                ) {

                    paymentData.crypto_currency =
                        paymentScreen
                            .querySelector(
                                "#cryptoCurrency"
                            )
                            .value;

                    paymentData.network =
                        paymentScreen
                            .querySelector(
                                "#network"
                            )
                            .value
                            .trim();

                    paymentData.wallet_address =
                        paymentScreen
                            .querySelector(
                                "#walletAddress"
                            )
                            .value
                            .trim();
                }


                console.log(
                    "SUBMITTING PAYMENT:",
                    paymentData
                );


                // ======================================
                // SEND TO BACKEND
                // ======================================

                await submitPayment(
                    paymentData
                );


                // ======================================
                // SUCCESS
                // ======================================

                message.className =
                    "auth-message auth-success";

                message.textContent =
                    "Payment submitted successfully. Please wait for admin approval.";

                form.reset();

                form.style.display =
                    "none";

                selectedPlan = null;
                selectedPaymentMethod = null;

                paymentScreen
                    .querySelectorAll(
                        ".subscription-plan"
                    )
                    .forEach((button) => {
                        button.classList.remove(
                            "selected"
                        );
                    });

                paymentScreen
                    .querySelector(
                        "#cryptoFields"
                    )
                    .style.display =
                    "none";

            } catch (error) {

                console.error(
                    "PAYMENT SUBMISSION FAILED:",
                    error
                );

                message.className =
                    "auth-message auth-error";

                message.textContent =
                    error.message;

            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Submit Payment";
            }
        }
    );
}


// ======================================================
// CHECK PAYMENT STATUS
// ======================================================

function setupStatusButton(
    onPaymentSubmitted
) {

    const button =
        paymentScreen.querySelector(
            "#checkPaymentStatus"
        );

    const message =
        paymentScreen.querySelector(
            "#paymentMessage"
        );

    button.addEventListener(
        "click",
        async () => {

            button.disabled = true;
            button.textContent =
                "Checking...";

            try {

                const data =
                    await getPaymentStatus();


                // ======================================
                // ACTIVE SUBSCRIPTION
                // ======================================

                if (
                    data.subscription?.status ===
                    "active"
                ) {

                    message.className =
                        "auth-message auth-success";

                    message.textContent =
                        "Your subscription is active. Opening dashboard...";


                    // Remove payment page
                    paymentScreen.remove();
                    paymentScreen = null;


                    // Open dashboard
                    if (
                        typeof onPaymentSubmitted ===
                        "function"
                    ) {
                        onPaymentSubmitted();
                    }

                    return;
                }


                // ======================================
                // PAYMENT PENDING
                // ======================================

                if (
                    data.payment?.status ===
                    "pending"
                ) {

                    message.className =
                        "auth-message";

                    message.textContent =
                        "Your payment is pending admin approval.";

                    return;
                }


                // ======================================
                // NO ACTIVE PAYMENT
                // ======================================

                message.className =
                    "auth-message";

                message.textContent =
                    "No active subscription was found.";

            } catch (error) {

                console.error(
                    "PAYMENT STATUS CHECK FAILED:",
                    error
                );

                message.className =
                    "auth-message auth-error";

                message.textContent =
                    error.message;

            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Check Payment Status";
            }
        }
    );
}
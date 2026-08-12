from app.models.signal import Signal


class DecisionExplainer:

    # ========================================
    # Explain AI Decision
    # ========================================

    def explain(self, signal: Signal):

        checks = [

            {
                "name": "Bias",
                "passed": signal.bias in ["CALL", "PUT"],
                "value": signal.bias,
                "message": (
                    "Market direction detected"
                    if signal.bias in ["CALL", "PUT"]
                    else "No market direction"
                )
            },

            {
                "name": "Confidence",
                "passed": signal.confidence >= 70,
                "value": signal.confidence,
                "message": (
                    "Confidence acceptable"
                    if signal.confidence >= 70
                    else "Confidence too low"
                )
            },

            {
                "name": "Probability",
                "passed": signal.probability >= 50,
                "value": signal.probability,
                "message": (
                    "Probability acceptable"
                    if signal.probability >= 50
                    else "Probability too low"
                )
            },

            {
                "name": "Agreement",
                "passed": signal.agreement_score >= 70,
                "value": signal.agreement_score,
                "message": (
                    "Agreement strong"
                    if signal.agreement_score >= 70
                    else "Agreement too weak"
                )
            },

            {
                "name": "Confirmations",
                "passed": signal.confirmation_count >= 4,
                "value": (
                    f"{signal.confirmation_count}/"
                    f"{signal.confirmation_total}"
                ),
                "message": (
                    "Enough confirmations"
                    if signal.confirmation_count >= 4
                    else "Not enough confirmations"
                )
            },

            {
                "name": "Risk",
                "passed": signal.risk != "HIGH",
                "value": signal.risk,
                "message": (
                    "Risk acceptable"
                    if signal.risk != "HIGH"
                    else "Risk too high"
                )
            },

            {
                "name": "Pullback",
                "passed": signal.pullback_confirmed,
                "value": signal.pullback_confirmed,
                "message": (
                    "Pullback confirmed"
                    if signal.pullback_confirmed
                    else "Waiting for pullback"
                )
            }

        ]

        blocked_by = None

        for check in checks:

            if not check["passed"]:

                blocked_by = check["name"]

                break

        decision = "ENTER" if blocked_by is None else "WAIT"

        return {

            "decision": decision,

            "blocked_by": blocked_by,

            "checks": checks

        }

    # ========================================
    # Print Decision
    # ========================================

    def print(self, signal: Signal):

        report = self.explain(signal)

        print()
        print("========================================")
        print("AI DECISION EXPLAINER")
        print("========================================")

        for check in report["checks"]:

            icon = "✅" if check["passed"] else "❌"

            print(
                f"{icon} "
                f"{check['name']:<16}"
                f"{str(check['value']):<12}"
                f"{check['message']}"
            )

        print("----------------------------------------")
        print("Decision   :", report["decision"])
        print("Blocked By :", report["blocked_by"])
        print("========================================")

        return report
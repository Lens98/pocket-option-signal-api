import json
import os

from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


class OpenAIReviewer:

    def review(self, signal):

        prompt = f"""
You are an independent trading decision reviewer.

Your job is to analyze the market information below and make a NEW decision.

IMPORTANT:
Do NOT simply copy the existing signal action.
The existing automatic signal may be WAIT because it is waiting for
timing or entry confirmation.

You must independently evaluate the market direction using the
market analysis data.

MARKET DATA

Asset: {signal.asset}

Market Bias: {getattr(signal, "bias", None)}

Trend: {signal.trend}

Confidence: {signal.confidence}

Probability: {signal.probability}

Agreement Score: {signal.agreement_score}

Pattern: {signal.pattern}

Risk: {signal.risk}

Session: {signal.session}

Regime: {signal.regime}

Make an independent decision:

- CALL = bullish direction is strongest
- PUT = bearish direction is strongest
- WAIT = direction is unclear or evidence is insufficient

Return ONLY valid JSON.

Example:

{{
    "decision": "CALL"
}}

The decision MUST be exactly one of:

CALL
PUT
WAIT
"""

        try:

            print()
            print("========================================")
            print("OPENAI INDEPENDENT REVIEW START")
            print("========================================")

            print("Asset:", signal.asset)
            print("Bias:", getattr(signal, "bias", None))
            print("Action:", getattr(signal, "action", None))
            print("Trend:", signal.trend)
            print("Confidence:", signal.confidence)
            print("Probability:", signal.probability)
            print("Risk:", signal.risk)
            print("Regime:", signal.regime)

            print("CALLING OPENAI...")

            response = client.responses.create(model="gpt-5", input=prompt)

            raw_response = response.output_text.strip()

            print("OPENAI RAW RESPONSE:")
            print(raw_response)

            result = json.loads(raw_response)

            decision = str(result.get("decision", "WAIT")).strip().upper()

            if decision not in ["CALL", "PUT", "WAIT"]:

                print("INVALID DECISION:", decision)

                decision = "WAIT"

            print("OPENAI FINAL DECISION:", decision)

            print("========================================")

            return {"decision": decision}

        except Exception as e:

            print()
            print("========================================")
            print("OPENAI REVIEW ERROR")
            print("========================================")
            print(repr(e))

            return {"decision": "WAIT", "error": str(e)}

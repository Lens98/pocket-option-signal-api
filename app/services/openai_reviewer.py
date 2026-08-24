import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


class OpenAIReviewer:

    def review(self, signal, screenshot=None):

        prompt = f"""
You are an independent trading decision reviewer.

Your job is to independently analyze the market.

You receive:

1. Structured market analysis from the trading engine.
2. Optionally, a current screenshot of the trading chart.

IMPORTANT:

Do NOT simply copy the existing automatic signal action.

The automatic signal may be WAIT because the internal engine
is waiting for timing or entry confirmation.

Independently evaluate the strongest market direction.

Use BOTH the structured market data and the chart screenshot
when a screenshot is available.

If the screenshot conflicts with the structured data, carefully
evaluate both sources.

Choose:

CALL = bullish direction is strongest

PUT = bearish direction is strongest

WAIT = direction is unclear, conflicting, or insufficient.

MARKET DATA

Asset: {signal.asset}

Market Bias: {getattr(signal, "bias", None)}

Current Automatic Action: {getattr(signal, "action", None)}

Trend: {signal.trend}

Confidence: {signal.confidence}

Probability: {signal.probability}

Agreement Score: {signal.agreement_score}

Pattern: {signal.pattern}

Risk: {signal.risk}

Session: {signal.session}

Regime: {signal.regime}

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

            if screenshot:
                print("📸 SCREENSHOT PROVIDED TO OPENAI")
            else:
                print("⚠️ NO SCREENSHOT PROVIDED")

            print("CALLING OPENAI...")

            input_content = [{"type": "input_text", "text": prompt}]

            if screenshot:

                input_content.append({"type": "input_image", "image_url": screenshot})

            response = client.responses.create(
                model="gpt-5", input=[{"role": "user", "content": input_content}]
            )

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

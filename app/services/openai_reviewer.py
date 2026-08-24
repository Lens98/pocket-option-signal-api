import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


class OpenAIReviewer:

    def review(self, signal):

        prompt = f"""
You are an expert trading AI.

Review the current market signal independently.

Asset: {signal.asset}
Current Action: {signal.action}
Trend: {signal.trend}
Confidence: {signal.confidence}
Probability: {signal.probability}
Agreement: {signal.agreement_score}
Pattern: {signal.pattern}
Risk: {signal.risk}
Session: {signal.session}
Regime: {signal.regime}

Choose the best decision based on this information.

Return ONLY this JSON format:

{{
    "decision": "CALL"
}}

The decision MUST be exactly one of:
CALL
PUT
WAIT
"""

        try:
            print("=== OPENAI REVIEW START ===")
            print("SIGNAL:", signal)

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

            return {"decision": decision}

        except Exception as e:
            print("=== OPENAI REVIEW ERROR ===")
            print(repr(e))

            return {"decision": "WAIT", "error": str(e)}

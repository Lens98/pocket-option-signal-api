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

Return ONLY valid JSON.

{{
    "decision": "CALL"
}}

The decision MUST be exactly one of:

CALL
PUT
WAIT
"""

        try:

            response = client.responses.create(model="gpt-5", input=prompt)

            result = json.loads(response.output_text)

            decision = str(result.get("decision", "WAIT")).upper()

            if decision not in ["CALL", "PUT", "WAIT"]:
                decision = "WAIT"

            return {"decision": decision}

        except Exception:

            return {"decision": "WAIT"}

import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


class OpenAIReviewer:

    def review(self, signal):

        prompt = f"""
You are an expert institutional trader.

Analyze this signal.

Asset: {signal.asset}
Action: {signal.action}
Trend: {signal.trend}
Confidence: {signal.confidence}
Probability: {signal.probability}
Agreement: {signal.agreement_score}
Pattern: {signal.pattern}
Risk: {signal.risk}
Session: {signal.session}
Regime: {signal.regime}

Return ONLY valid JSON.

{{
    "decision":"BUY",
    "confidence":90,
    "reason":"Short explanation."
}}
"""

        try:

            response = client.responses.create(

                model="gpt-5",

                input=prompt

            )

            return json.loads(
                response.output_text
            )

        except Exception as e:

            return {

                "decision": "WAIT",

                "confidence": 0,

                "reason": str(e)

            }
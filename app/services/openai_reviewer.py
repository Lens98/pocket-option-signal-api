import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


class OpenAIReviewer:

    def review(self, signal, screenshot=None):

        prompt = f"""
You are an independent AI market analyst for SHORT-TERM BINARY OPTIONS.

Your job is to independently analyze the market and decide the
strongest probable direction for the NEXT CANDLE.

IMPORTANT CONTEXT:

The user normally presses the ANALYZE MARKET button near the END of
the currently forming candle.

The decision is intended for entering at the BEGINNING of the NEXT
CANDLE.

Therefore, analyze whether the NEXT candle is more likely to move:

CALL = bullish / price likely to move UP
PUT = bearish / price likely to move DOWN
WAIT = no clear high-quality direction for the next candle

You receive:

1. Structured market analysis from the internal trading engine.
2. A current screenshot of the Pocket Option trading chart.

IMPORTANT INDEPENDENCE RULES:

Do NOT blindly copy the automatic signal.

The internal engine is only ONE source of information.

The automatic signal may be CALL, PUT, or WAIT.

A WAIT signal from the engine does NOT automatically mean that your
decision must be WAIT.

A CALL or PUT signal from the engine does NOT automatically mean that
you must agree with it.

You must independently evaluate the market using all available
information.

When a screenshot is available, analyze the ACTUAL PRICE ACTION.

PAY SPECIAL ATTENTION TO:

- Overall market trend
- Higher highs and higher lows
- Lower highs and lower lows
- Trend continuation
- Trend reversal
- Support and resistance
- Breakouts
- Failed breakouts
- Rejections and wicks
- Bullish candles
- Bearish candles
- Bullish engulfing patterns
- Bearish engulfing patterns
- Strong momentum candles
- Weakening momentum
- Consolidation
- Pullbacks
- Candle closes
- Current price position
- Whether the current candle supports continuation or reversal
- Whether the next candle has a clear directional advantage

NEXT-CANDLE RULE:

The current candle may still be forming.

Do not simply predict the direction of the current candle.

Your primary task is to determine the most probable direction of the
NEXT candle after the current candle completes.

If the current candle shows strong bullish continuation and market
structure supports it, CALL may be appropriate.

If the current candle shows strong bearish continuation and market
structure supports it, PUT may be appropriate.

If price action shows uncertainty, conflicting signals, exhaustion,
indecision, or no clear next-candle advantage, choose WAIT.

SCREENSHOT RULE:

If a screenshot is available, use it as important visual market
evidence.

Do not ignore the screenshot.

Compare the screenshot with the structured market data.

If the screenshot and structured data agree, confidence in that
direction may be stronger.

If they conflict, independently determine which evidence is stronger.

You are NOT required to follow the engine.

You may:

- Return CALL when the engine says WAIT
- Return PUT when the engine says WAIT
- Return WAIT when the engine says CALL
- Return WAIT when the engine says PUT
- Return CALL when the engine says PUT
- Return PUT when the engine says CALL

Only choose CALL or PUT when you see a meaningful directional advantage
for the NEXT candle.

MARKET DATA:

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

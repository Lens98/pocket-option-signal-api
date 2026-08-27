import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


class OpenAIReviewer:

    def review(
        self,
        signal,
        screenshot=None,
        timeframe_seconds=None,
        seconds_elapsed=None,
        seconds_remaining=None,
    ):

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
TIMING CONTEXT:

Candle timeframe in seconds: {timeframe_seconds}

Seconds elapsed in current candle when analysis was requested: {seconds_elapsed}

Seconds remaining before the next candle: {seconds_remaining}

IMPORTANT TIMING RULE:

The screenshot represents the market near the time the user requested
analysis.

Use the timing information to understand how close the current candle
was to completion.

The trade decision is intended for the NEXT candle, not the current
candle.

If there were only a few seconds remaining, focus strongly on the
likely direction after the current candle closes.

Do not assume the current candle will automatically continue into the
next candle.

Consider whether the current price action shows:

- continuation likely into the next candle
- momentum exhaustion
- rejection near support or resistance
- a possible reversal
- uncertainty caused by an unfinished candle

The closer the analysis was requested to the candle close, the more
useful the current candle's final structure may be for predicting the
NEXT candle.
PATTERN INTELLIGENCE:

Explicitly inspect the screenshot for candlestick patterns.

HAMMER:
A small body with a significant lower wick may indicate bullish
rejection, especially near support or after bearish movement.
Do not treat every hammer-shaped candle as a CALL.

SHOOTING STAR:
A small body with a significant upper wick may indicate bearish
rejection, especially near resistance or after bullish movement.

DOJI:
Indicates indecision. Do not automatically trade a doji.
Evaluate the candles before and after it, market location, momentum,
and whether a breakout or reversal is likely.

ENGULFING:
A bullish engulfing pattern may support CALL when it appears with
bullish market context.
A bearish engulfing pattern may support PUT when it appears with
bearish market context.

PIN BARS AND REJECTION CANDLES:
Evaluate long wicks as evidence of price rejection, but determine
whether rejection occurred at meaningful support, resistance, or
a key market structure level.

MORNING STAR:
May indicate a possible bullish reversal after bearish movement,
especially when supported by market structure.

EVENING STAR:
May indicate a possible bearish reversal after bullish movement,
especially when supported by market structure.

PATTERN VALIDATION RULE:
Never make a decision based on one pattern alone.

Evaluate:

- Pattern quality
- Trend before the pattern
- Pattern location
- Support and resistance
- Momentum
- Recent candle sequence
- Current candle structure
- Timing before candle close
- Whether the pattern supports the NEXT candle direction

A pattern with multiple confirmations is stronger than an isolated
pattern.

If the pattern is unclear or conflicts with stronger market evidence,
choose WAIT or follow the stronger evidence.
SHORT-TERM NEXT-CANDLE SETUPS:

Evaluate these setups when clearly visible. These are not guarantees.
Never assume any setup has a fixed win rate.

TREND CONTINUATION:

If the market has a clear trend with higher highs and higher lows,
or lower highs and lower lows, evaluate whether the latest candle
shows continuation.

Bullish continuation may support CALL when:

- Clear bullish structure exists
- Price pulls back and holds support
- A bullish rejection occurs
- Momentum resumes upward

Bearish continuation may support PUT when:

- Clear bearish structure exists
- Price pulls back and fails near resistance
- A bearish rejection occurs
- Momentum resumes downward

Do not trade continuation when the trend appears exhausted.

DOJI AFTER TREND:

A doji after a strong trend may represent either continuation,
indecision, or reversal.

Do not automatically trade immediately because a doji exists.

Inspect:

- The trend before the doji
- The location of the doji
- The size and direction of nearby candles
- Support or resistance
- Whether the following price action confirms direction

A doji with confirmation is stronger than an isolated doji.

PULLBACK CONTINUATION:

Look for temporary movement against the main trend.

CALL may be considered when:

- The larger trend is bullish
- Price pulls back without breaking bullish structure
- Support holds
- Bullish momentum or rejection returns

PUT may be considered when:

- The larger trend is bearish
- Price pulls back without breaking bearish structure
- Resistance holds
- Bearish momentum or rejection returns

BREAKOUT AND RETEST:

A breakout alone is not sufficient.

Evaluate whether:

- A meaningful level was broken
- The candle closes beyond the level
- Momentum supports the breakout
- The breakout appears genuine rather than a false breakout

A successful bullish breakout or retest may support CALL.

A successful bearish breakout or retest may support PUT.

FAILED BREAKOUT:

A failed breakout followed by strong rejection may indicate
movement in the opposite direction.

However, require confirmation from market structure and momentum.

THREE-CANDLE MOMENTUM:

Evaluate sequences of consecutive candles.

Multiple strong candles in one direction may show momentum,
but after an extended move they may also indicate exhaustion.

Do not blindly follow a long sequence.

Evaluate:

- Candle body size
- Wick size
- Momentum
- Distance from support/resistance
- Whether the move is accelerating or weakening

SUPPORT AND RESISTANCE REJECTION:

Strong rejection from an important support area may support CALL.

Strong rejection from an important resistance area may support PUT.

The level should be meaningful based on recent market structure.

EXHAUSTION:

Be cautious when:

- Multiple strong candles have already moved in one direction
- Candle bodies are becoming smaller
- Opposite wicks are increasing
- Price reaches major support or resistance
- Momentum weakens

Exhaustion does not automatically mean reversal.

Require confirmation before predicting the opposite direction.

CONSOLIDATION:

When candles overlap heavily and price has no clear structure,
prefer WAIT.

Avoid forcing a CALL or PUT inside random sideways movement.

CONFLICT RESOLUTION:

When multiple strategies produce conflicting directions:

1. Prioritize overall market structure.
2. Prioritize meaningful support and resistance.
3. Prioritize confirmed price action.
4. Prioritize strong momentum.
5. Use candlestick patterns as confirmation, not as the only reason.
6. If no direction has a meaningful advantage, choose WAIT.

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
            print("Timeframe seconds:", timeframe_seconds)
            print("Seconds elapsed:", seconds_elapsed)
            print("Seconds remaining:", seconds_remaining)

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

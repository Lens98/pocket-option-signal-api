from app.timeframe.filter import MultiTimeframeFilter

f = MultiTimeframeFilter()

tests = [

    ("BULLISH", "BULLISH", "BULLISH"),

    ("BEARISH", "BEARISH", "BEARISH"),

    ("BULLISH", "SIDEWAYS", "BULLISH"),

    ("SIDEWAYS", "SIDEWAYS", "BEARISH"),

    ("BULLISH", "BEARISH", "BULLISH")

]

for t1, t5, t15 in tests:

    print(

        t1,
        t5,
        t15,
        "->",
        f.allow_trade(t1, t5, t15)

    )
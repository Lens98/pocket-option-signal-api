from app.market_structure.choch import ChangeOfCharacter

choch = ChangeOfCharacter()

print()

print(
    choch.analyze(
        "HH_HL",
        "BEARISH_BOS"
    )
)

print(
    choch.analyze(
        "LH_LL",
        "BULLISH_BOS"
    )
)

print(
    choch.analyze(
        "HH_HL",
        "NONE"
    )
)
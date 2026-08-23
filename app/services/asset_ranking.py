from app.storage.learning_storage import LearningStorage


class AssetRanking:

    def __init__(self):

        self.learning = LearningStorage()

    # ========================================
    # Rank Assets
    # ========================================

    def rank(self):

        assets = [

            "EURUSD_otc",
            "GBPUSD_otc",
            "USDJPY_otc",
            "AUDUSD_otc",
            "NZDUSD_otc",
            "USDCAD_otc",
            "USDCHF_otc",
            "EURJPY_otc",
            "GBPJPY_otc",
            "EURGBP_otc",
            "NGNUSD_otc"

        ]

        rankings = []

        for asset in assets:

            stats = self.learning.asset_stats(asset)

            total = stats["total"] or 0
            wins = stats["wins"] or 0

            if total == 0:

                rate = 0

            else:

                rate = round(

                    (wins / total) * 100,

                    2

                )

            rankings.append({

                "asset": asset,

                "trades": total,

                "wins": wins,

                "win_rate": rate

            })

        rankings.sort(

            key=lambda x: x["win_rate"],

            reverse=True

        )

        return rankings
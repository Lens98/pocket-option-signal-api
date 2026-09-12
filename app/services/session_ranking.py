from app.storage.learning_storage import LearningStorage


class SessionRanking:

    def __init__(self):

        self.learning = LearningStorage()

    # ========================================
    # Rank All Trading Sessions
    # ========================================

    def rank(self):

        sessions = [

            "ASIAN",

            "LONDON",

            "OVERLAP",

            "NEW_YORK",

            "AFTER_HOURS"

        ]

        rankings = []

        for session in sessions:

            stats = self.learning.session_stats(session)

            total = stats["total"] or 0
            wins = stats["wins"] or 0

            if total == 0:

                win_rate = 0.0

            else:

                win_rate = round(

                    (wins / total) * 100,

                    2

                )

            rankings.append({

                "session": session,

                "trades": total,

                "wins": wins,

                "win_rate": win_rate

            })

        rankings.sort(

            key=lambda x: x["win_rate"],

            reverse=True

        )

        return rankings
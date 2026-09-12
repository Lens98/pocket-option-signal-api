from datetime import datetime, timezone

from app.database.database import database


class UserPreferencesRepository:

    # ========================================
    # GET USER PREFERENCES
    # ========================================

    def get(self, user_id: str):

        return database.fetch_one(
            """
            SELECT
                user_id,
                selected_asset,
                created_at,
                updated_at
            FROM user_preferences
            WHERE user_id = ?
            """,
            (user_id,)
        )

    # ========================================
    # GET SELECTED ASSET
    # ========================================

    def get_selected_asset(self, user_id: str):

        row = self.get(user_id)

        if not row:
            return None

        return row["selected_asset"]

    # ========================================
    # SAVE SELECTED ASSET
    # ========================================

    def set_selected_asset(
        self,
        user_id: str,
        asset: str
    ):

        now = datetime.now(
            timezone.utc
        ).isoformat()

        existing = self.get(user_id)

        if existing:

            database.execute(
                """
                UPDATE user_preferences
                SET
                    selected_asset = ?,
                    updated_at = ?
                WHERE user_id = ?
                """,
                (
                    asset,
                    now,
                    user_id
                )
            )

        else:

            database.execute(
                """
                INSERT INTO user_preferences (
                    user_id,
                    selected_asset,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    user_id,
                    asset,
                    now,
                    now
                )
            )

        return self.get(user_id)


user_preferences_repository = UserPreferencesRepository()
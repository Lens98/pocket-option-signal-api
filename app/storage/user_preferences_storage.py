from app.database.user_preferences_repository import (
    user_preferences_repository
)


class UserPreferencesStorage:

    def get(self, user_id: str):

        return user_preferences_repository.get(
            user_id
        )

    def get_selected_asset(self, user_id: str):

        return user_preferences_repository.get_selected_asset(
            user_id
        )

    def set_selected_asset(
        self,
        user_id: str,
        asset: str
    ):

        return user_preferences_repository.set_selected_asset(
            user_id,
            asset
        )


user_preferences_storage = UserPreferencesStorage()
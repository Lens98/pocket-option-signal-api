from app.models.signal import Signal


class SignalStorage:

    def __init__(self):

        # Structure:
        #
        # {
        #     user_id: {
        #         "latest": Signal,
        #         "signals": {
        #             asset: Signal
        #         }
        #     }
        # }

        self.users = {}

    # ========================================
    # ENSURE USER STORAGE
    # ========================================

    def _get_user_storage(self, user_id: str):

        if user_id not in self.users:

            self.users[user_id] = {"latest": None, "signals": {}}

        return self.users[user_id]

    # ========================================
    # UPDATE SIGNAL FOR USER
    # ========================================

    def update(self, user_id: str, signal: Signal):

        user_storage = self._get_user_storage(user_id)

        user_storage["latest"] = signal

        asset = getattr(signal, "asset", None)

        if asset:

            user_storage["signals"][asset] = signal

    # ========================================
    # GET SIGNAL FOR USER
    # ========================================

    def get(self, user_id: str, asset=None):

        user_storage = self.users.get(user_id)

        if not user_storage:

            return None

        if asset:

            return user_storage["signals"].get(asset)

        return user_storage["latest"]

    # ========================================
    # GET ALL USER SIGNALS
    # ========================================

    def all(self, user_id: str):

        user_storage = self.users.get(user_id)

        if not user_storage:

            return {}

        return dict(user_storage["signals"])

    # ========================================
    # CLEAR USER SIGNAL
    # ========================================

    def clear(self, user_id: str, asset=None):

        user_storage = self.users.get(user_id)

        if not user_storage:

            return

        if asset:

            user_storage["signals"].pop(asset, None)

            latest = user_storage["latest"]

            if latest is not None and getattr(latest, "asset", None) == asset:

                user_storage["latest"] = None

            return

        user_storage["latest"] = None

        user_storage["signals"].clear()

    # ========================================
    # CLEAR ALL DATA FOR ONE USER
    # ========================================

    def clear_user(self, user_id: str):

        self.users.pop(user_id, None)

    # ========================================
    # CLEAR EVERYTHING
    # ========================================

    def clear_all(self):

        self.users.clear()

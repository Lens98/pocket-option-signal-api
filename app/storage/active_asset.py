class ActiveAsset:

    def __init__(self):

        # Structure:
        #
        # {
        #     user_id: asset
        # }

        self.assets = {}

    # ========================================
    # SET ACTIVE ASSET FOR USER
    # ========================================

    def set(self, user_id: str, asset: str):

        self.assets[user_id] = asset

        print("Active Asset Set:", "User:", user_id, "Asset:", asset)

    # ========================================
    # GET ACTIVE ASSET FOR USER
    # ========================================

    def get(self, user_id: str):

        return self.assets.get(user_id)

    # ========================================
    # CLEAR ACTIVE ASSET FOR USER
    # ========================================

    def clear(self, user_id: str):

        self.assets.pop(user_id, None)

    # ========================================
    # CLEAR ALL USERS
    # ========================================

    def clear_all(self):

        self.assets.clear()

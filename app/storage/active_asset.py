class ActiveAsset:

    def __init__(self):

        self.asset = None


    def set(self, asset):

        self.asset = asset

        print("🎯 Active Asset Set:", asset)


    def get(self):

        return self.asset
from app.market_data.downloader import MarketDownloader

downloader = MarketDownloader()

data = downloader.download()

print(data.head())
print()
print("Rows:", len(data))
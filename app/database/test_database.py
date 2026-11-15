from app.database.database import database

print("----------------------------------------")
print("Database Location")
print(database.db_path)
print("----------------------------------------")

rows = database.fetch_all(
    "SELECT name FROM sqlite_master WHERE type='table'"
)

print(rows)
from pymongo import MongoClient
from config import settings

client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]

heart_collection = db["heart_predictions"]
oral_collection = db["oral_predictions"]

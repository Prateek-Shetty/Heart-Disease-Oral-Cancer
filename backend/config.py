import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URL = os.getenv("MONGO_URL")
    DB_NAME = os.getenv("DB_NAME")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

settings = Settings()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import heart, oral, chatbot
import os

app = FastAPI(title="Medical AI Backend")

# -----------------------
# CORS Configuration
# -----------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Include Routes
# -----------------------

app.include_router(heart.router)
app.include_router(oral.router)
app.include_router(chatbot.router)

# -----------------------
# Static File Serving (Uploads)
# -----------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, "uploads")

# Ensure uploads folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# -----------------------
# Root Endpoint
# -----------------------

@app.get("/")
def root():
    return {"message": "Medical AI Backend Running"}

from fastapi import APIRouter, UploadFile, File
from models_loader import oral_model
from db import oral_collection
import numpy as np
from PIL import Image
from datetime import datetime
import os
import uuid

router = APIRouter()

# Build absolute uploads path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/predict-oral")
async def predict_oral(file: UploadFile = File(...)):

    # Create unique filename
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_name)

    # Read file once
    contents = await file.read()

    # Save physically to uploads folder
    with open(file_path, "wb") as f:
        f.write(contents)

    print("Saved file at:", file_path)

    # Load image from saved path
    image = Image.open(file_path).resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prob = oral_model.predict(img_array)[0][0]

    # Invert if needed
    cancer_prob = 1 - prob
    result = round(float(cancer_prob) * 100, 2)

    # Store in Mongo
    record = {
        "filename": unique_name,
        "cancer_probability": result,
        "timestamp": datetime.utcnow()
    }

    oral_collection.insert_one(record)

    return {
        "cancer_probability": result
    }

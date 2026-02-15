from fastapi import APIRouter
from pydantic import BaseModel
from models_loader import heart_model
from db import heart_collection
import pandas as pd
from datetime import datetime

router = APIRouter()

class HeartInput(BaseModel):
    age: int
    anaemia: int
    creatinine_phosphokinase: float
    diabetes: int
    ejection_fraction: float
    high_blood_pressure: int
    platelets: float
    serum_creatinine: float
    serum_sodium: float
    sex: int
    smoking: int

feature_names = list(HeartInput.model_fields.keys())

@router.post("/predict-heart")
def predict_heart(data: HeartInput):

    input_df = pd.DataFrame([data.dict()], columns=feature_names)

    prob = heart_model.predict_proba(input_df)[0][1]
    risk = round(prob * 100, 2)

    result = {
        "input": data.dict(),
        "risk_percentage": risk,
        "timestamp": datetime.utcnow()
    }

    heart_collection.insert_one(result)

    return {"risk_percentage": risk}

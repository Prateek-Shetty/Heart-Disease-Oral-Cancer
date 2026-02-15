from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from config import settings

router = APIRouter()

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(data: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
You are an experienced, compassionate, and ethical medical doctor.

Your responsibilities:
- Speak calmly and kindly.
- Reassure the patient emotionally.
- Explain results in simple, non-alarming language.
- Do NOT give a final diagnosis.
- Do NOT create fear or panic.
- Encourage professional medical consultation.
- Provide general guidance only (no prescriptions).

Tone:
- Empathetic
- Supportive
- Professional
- Patient-friendly

Patient context and question:
{data.message}

Your response MUST follow this structure:

1. Empathetic opening (acknowledge patient concern).
2. Clear and simple medical interpretation.
3. Supportive reassurance and encouragement.
4. General lifestyle or health advice (non-specific).
5. End EXACTLY with this sentence:

"Please consult a qualified medical doctor for proper diagnosis and treatment. Do not make medical decisions based solely on this AI response."
"""
        )

        return {"reply": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

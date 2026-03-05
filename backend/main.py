from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, uuid
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Add backend directory to path for local imports
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from analysis.facial import analyze_face
from analysis.audio import analyze_audio
from analysis.fusion import fuse_scores
from report.generator import generate_report, build_report_json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RED_FLAGS = [
    "chest pain", "shortness of breath", "can't breathe", "fainting",
    "stroke", "facial droop", "arm weakness", "suicidal", "want to die",
    "severe bleeding", "seizure", "severe headache", "pregnancy emergency",
    "allergic reaction", "severe confusion"
]

@app.post("/analyze")
async def analyze(
    photo: UploadFile = File(...),
    audio: UploadFile = File(...),
    symptoms: str = Form(default=""),
    sleep_hours: float = Form(default=7),
    stress_level: int = Form(default=5),
    primary_goal: str = Form(default="")
):
    # Red flag check
    symptoms_lower = symptoms.lower()
    if any(flag in symptoms_lower for flag in RED_FLAGS):
        return {
            "emergency": True,
            "message": "Based on what you've shared, please contact emergency services or call 911 immediately. Do not wait. Your safety is the priority."
        }
    
    # Save uploaded files temporarily
    session_id = str(uuid.uuid4())
    photo_path = f"/tmp/{session_id}_photo.jpg"
    audio_path = f"/tmp/{session_id}_audio.wav"
    
    with open(photo_path, "wb") as f:
        shutil.copyfileobj(photo.file, f)
    with open(audio_path, "wb") as f:
        shutil.copyfileobj(audio.file, f)
    
    try:
        # Run analysis
        facial_scores = analyze_face(photo_path)
        audio_scores = analyze_audio(audio_path)
        
        self_report = {
            "sleep_hours_avg": sleep_hours,
            "stress_level_1_10": stress_level,
            "primary_goals": [primary_goal] if primary_goal else []
        }
        
        biosignal_scores, flags, agreement_score = fuse_scores(
            facial_scores, audio_scores, self_report
        )
        
        report_json = build_report_json(
            session_id, biosignal_scores, flags, self_report
        )
        
        report_text = generate_report(report_json, agreement_score, primary_goal)
        
        return {
            "emergency": False,
            "report": report_text,
            "scores": biosignal_scores,
            "flags": flags,
            "session_id": session_id
        }
    
    finally:
        # Clean up temp files
        os.remove(photo_path)
        os.remove(audio_path)

import os
import json
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import timedelta, date
from app import database, models

# ✅ Define router at the top
router = APIRouter()

load_dotenv()

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")  # You can also set this in .env

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/weekly")
def get_weekly_insight(db: Session = Depends(get_db)):
    today = date.today()
    week_ago = today - timedelta(days=7)

    # Fetch mood logs and habits
    mood_logs = db.query(models.Mood).filter(models.Mood.date >= week_ago).all()
    habits = db.query(models.Habit).all()

    # Prepare insight data (past 7 days)
    past_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]
    insight_data = []

    for day in past_7_days:
        mood_entry = db.query(models.Mood).filter(models.Mood.date == day).first()
        habit_logs = db.query(models.HabitLog).filter(models.HabitLog.date == day).all()

        insight_data.append({
            "date": day.isoformat(),
            "mood": mood_entry.mood if mood_entry else None,
            "habits": [log.habit.name for log in habit_logs if log.habit]
        })

    # Ask Ollama to generate a wellness summary
    try:
        prompt = (
            f"Analyze the following 7-day mood and habit log and summarize any patterns or correlations.\n"
            f"Data:\n{json.dumps(insight_data, indent=2)}\n\n"
            f"Provide a helpful insight on how habits might be affecting the mood."
        )

        response = requests.post(OLLAMA_API_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        })

        response.raise_for_status()
        gpt_summary = response.json()["response"]
    except Exception as e:
        print("❌ Ollama Error:", e)
        gpt_summary = "Unable to generate insight at this time."

    return {
        "summary": gpt_summary,
        "mood_entries_analyzed": len(mood_logs),
        "habits_tracked": [h.name for h in habits]
    }

@router.get("/raw")
def get_raw_insight_data(db: Session = Depends(get_db)):
    today = date.today()
    past_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]

    result = []

    for day in past_7_days:
        mood_entry = db.query(models.Mood).filter(models.Mood.date == day).first()
        habit_logs = db.query(models.HabitLog).filter(models.HabitLog.date == day).all()

        result.append({
            "date": day.isoformat(),
            "mood": mood_entry.mood if mood_entry else None,
            "habits": [log.habit.name for log in habit_logs if log.habit]
        })

    return {"insight_data": result}

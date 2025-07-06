# app/routes/mood.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database, schemas

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=201)
def log_mood(entry: schemas.MoodLog, db: Session = Depends(get_db)):
    # Check if mood entry already exists for this date
    existing_mood = db.query(models.Mood).filter(models.Mood.date == entry.date).first()
    
    if existing_mood:
        # Update existing mood entry
        existing_mood.mood = entry.mood
        existing_mood.note = entry.note
        db.commit()
        db.refresh(existing_mood)
        return {"message": "Mood updated", "mood": {
            "id": existing_mood.id,
            "date": existing_mood.date,
            "mood": existing_mood.mood,
            "note": existing_mood.note
        }}
    else:
        # Create new mood entry
        db_mood = models.Mood(date=entry.date, mood=entry.mood, note=entry.note)
        db.add(db_mood)
        db.commit()
        db.refresh(db_mood)
        return {"message": "Mood logged", "mood": {
            "id": db_mood.id,
            "date": db_mood.date,
            "mood": db_mood.mood,
            "note": db_mood.note
        }}

@router.get("/")
def get_mood_logs(db: Session = Depends(get_db)):
    logs = db.query(models.Mood).all()
    return {"moods": [
        {
            "id": m.id,
            "date": m.date,
            "mood": m.mood,
            "note": m.note
        } for m in logs
    ]}

@router.put("/{mood_id}")
def update_mood(mood_id: int, updated: schemas.MoodLog, db: Session = Depends(get_db)):
    mood_entry = db.query(models.Mood).filter(models.Mood.id == mood_id).first()

    if not mood_entry:
        raise HTTPException(status_code=404, detail="Mood entry not found")

    mood_entry.date = updated.date
    mood_entry.mood = updated.mood
    mood_entry.note = updated.note

    db.commit()
    db.refresh(mood_entry)

    return {"message": "Mood entry updated", "mood": {
        "id": mood_entry.id,
        "date": mood_entry.date,
        "mood": mood_entry.mood,
        "note": mood_entry.note
    }}

@router.delete("/{mood_id}")
def delete_mood(mood_id: int, db: Session = Depends(get_db)):
    mood_entry = db.query(models.Mood).filter(models.Mood.id == mood_id).first()

    if not mood_entry:
        raise HTTPException(status_code=404, detail="Mood entry not found")

    db.delete(mood_entry)
    db.commit()

    return {"message": "Mood entry deleted successfully"}
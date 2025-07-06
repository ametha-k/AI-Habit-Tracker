# app/routes/habits.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app import models, database, schemas
from fastapi import HTTPException
from fastapi import status
from fastapi import HTTPException


router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=201)
def log_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    db_habit = models.Habit(name=habit.name, description=habit.description, goal=habit.goal)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)

    today = date.today()
    log_exists = (
        db.query(models.HabitLog)
        .filter(models.HabitLog.habit_id == db_habit.id, models.HabitLog.date == today)
        .first()
    )

    if not log_exists:
        habit_log = models.HabitLog(date=today, habit_id=db_habit.id)
        db.add(habit_log)
        db.commit()

    return {
        "message": "Habit logged for today",
        "habit": {"id": db_habit.id, "name": db_habit.name}
    }

@router.get("/")
def get_all_habits(db: Session = Depends(get_db)):
    habits = db.query(models.Habit).all()
    return {
        "habits": [
            {"id": h.id, "name": h.name, "description": h.description, "goal": h.goal}
            for h in habits
        ]
    }

@router.get("/logs")
def get_habit_logs(period: str = "week", anchor_date: str = None, db: Session = Depends(get_db)):
    from datetime import datetime
    
    if anchor_date:
        anchor = datetime.strptime(anchor_date, "%Y-%m-%d").date()
    else:
        anchor = date.today()
    
    # Calculate date range based on period
    if period == "week":
        # Start from Monday of the week containing anchor date
        days_since_monday = anchor.weekday()
        start_date = anchor - timedelta(days=days_since_monday)
        date_range = [start_date + timedelta(days=i) for i in range(7)]
    elif period == "month":
        # Start from first day of the month
        start_date = anchor.replace(day=1)
        # Get last day of the month
        if anchor.month == 12:
            next_month = anchor.replace(year=anchor.year + 1, month=1, day=1)
        else:
            next_month = anchor.replace(month=anchor.month + 1, day=1)
        last_date = next_month - timedelta(days=1)
        date_range = [start_date + timedelta(days=i) for i in range((last_date - start_date).days + 1)]
    elif period == "year":
        # Start from January 1st of the year
        start_date = anchor.replace(month=1, day=1)
        # Get December 31st of the year
        end_date = anchor.replace(month=12, day=31)
        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    else:
        # Default to week if invalid period
        days_since_monday = anchor.weekday()
        start_date = anchor - timedelta(days=days_since_monday)
        date_range = [start_date + timedelta(days=i) for i in range(7)]
    
    date_strings = [d.isoformat() for d in date_range]

    habits = db.query(models.Habit).all()
    logs = db.query(models.HabitLog).all()

    log_dict = {(log.habit_id, log.date.isoformat()): True for log in logs}

    result = []
    for habit in habits:
        achieved = sum([log_dict.get((habit.id, d), False) for d in date_strings])
        habit_row = {
            "id": habit.id,
            "name": habit.name,
            "goal": habit.goal,
            "logs": [
                log_dict.get((habit.id, d), False) for d in date_strings
            ],
            "achieved": achieved
        }
        result.append(habit_row)

    return {
        "dates": date_strings,
        "habits": result
    }

@router.patch("/logs/toggle")
def toggle_habit_log(payload: dict, db: Session = Depends(get_db)):
    habit_id = payload.get("habit_id")
    log_date = payload.get("date")

    if not habit_id or not log_date:
        raise HTTPException(status_code=400, detail="Missing habit_id or date")

    log = db.query(models.HabitLog).filter(
        models.HabitLog.habit_id == habit_id,
        models.HabitLog.date == log_date
    ).first()

    if log:
        db.delete(log)
        db.commit()
        return {"message": "Habit unchecked"}
    else:
        new_log = models.HabitLog(habit_id=habit_id, date=log_date)
        db.add(new_log)
        db.commit()
        return {"message": "Habit checked"}
    
@router.post("/toggle/")
def toggle_habit_log(payload: dict, db: Session = Depends(get_db)):
    habit_id = payload.get("habit_id")
    date_str = payload.get("date")
    if not habit_id or not date_str:
        raise HTTPException(status_code=400, detail="Missing habit_id or date")

    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    target_date = date.fromisoformat(date_str)

    existing_log = db.query(models.HabitLog).filter(
        models.HabitLog.habit_id == habit_id,
        models.HabitLog.date == target_date
    ).first()

    if existing_log:
        db.delete(existing_log)
        db.commit()
        return {"message": "Habit unchecked"}
    else:
        new_log = models.HabitLog(habit_id=habit_id, date=target_date)
        db.add(new_log)
        db.commit()
        return {"message": "Habit checked"}

@router.put("/{habit_id}")
def update_habit(habit_id: int, habit_update: dict, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    if "name" in habit_update:
        db_habit.name = habit_update["name"]
    if "description" in habit_update:
        db_habit.description = habit_update["description"]
    if "goal" in habit_update:
        db_habit.goal = habit_update["goal"]
    
    db.commit()
    db.refresh(db_habit)
    
    return {
        "message": "Habit updated successfully",
        "habit": {"id": db_habit.id, "name": db_habit.name, "description": db_habit.description, "goal": db_habit.goal}
    }

@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Delete all associated logs first
    db.query(models.HabitLog).filter(models.HabitLog.habit_id == habit_id).delete()
    
    # Delete the habit
    db.delete(db_habit)
    db.commit()
    
    return {"message": "Habit and all associated logs deleted successfully"}

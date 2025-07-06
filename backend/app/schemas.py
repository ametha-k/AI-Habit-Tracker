# app/schemas.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

# Mood schema
class MoodLog(BaseModel):
    date: date
    mood: str
    note: Optional[str] = None

    class Config:
        from_attributes = True

# Habit schema
class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    goal: Optional[int] = 20

    class Config:
        from_attributes = True

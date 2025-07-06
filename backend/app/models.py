from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    goal = Column(Integer, nullable=True, default=20)

    logs = relationship("HabitLog", back_populates="habit")

class HabitLog(Base):
    __tablename__ = "habit_logs"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    habit_id = Column(Integer, ForeignKey("habits.id"))

    habit = relationship("Habit", back_populates="logs")

class Mood(Base):
    __tablename__ = "moods"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    mood = Column(String, nullable=False)
    note = Column(Text, nullable=True)

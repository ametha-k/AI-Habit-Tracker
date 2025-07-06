from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import habits, mood, insights  # your existing routes
from auth_routes import router as auth_router   # ✅ new import (adjust path if needed)

app = FastAPI()

# CORS settings to allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your existing routers
app.include_router(habits.router, prefix="/habits", tags=["Habits"])
app.include_router(mood.router, prefix="/moods", tags=["Mood"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

# ✅ Include auth router (important!)
app.include_router(auth_router, tags=["Auth"])
# AI Habit Tracker

## Project Description
AI Habit Tracker is a full-stack web application designed to help users build and maintain healthy habits. It leverages AI (GPT) to provide personalized insights and suggestions, making habit tracking more engaging and effective. The app features user authentication, habit and mood tracking, note-taking, and AI-powered habit insights.

- **Frontend:** React (Vite)
- **Backend:** FastAPI (Python)
- **Database:** SQLite
- **AI Integration:** GPT/AI for insights
- **Deployment:** Docker Compose (multi-container)

---

## Features
- User authentication (login/signup)
- Add, edit, and delete habits
- Track moods and add notes
- AI-generated insights and suggestions
- Responsive, modern UI
- Dockerized for easy deployment

---

## Setup & Installation Guide

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- (For local dev) Node.js, npm, and Python 3.10+

### 1. Clone the Repository
```sh
git clone https://github.com/ametha-k/AI-Habit-Tracker.git
cd AI-Habit-Tracker
```

### 2. Environment Variables
- Backend: Create a `backend/.env` file for any secrets or API keys (optional, see code for usage).
- Frontend: If you need to set API URLs, edit the relevant files in `frontend/`.

### 3. Build & Run with Docker Compose
```sh
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### 4. Manual Local Development (Optional)
#### Backend
```sh
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
#### Frontend
```sh
cd frontend
npm install
npm run dev
```

---

## Architecture Overview

- **Frontend (React + Vite):** Handles user interface, authentication, and API requests to the backend.
- **Backend (FastAPI):** Provides RESTful API endpoints for habits, moods, notes, authentication, and AI insights. Integrates with GPT/AI for smart suggestions.
- **Database (SQLite):** Stores user data, habits, moods, and notes.
- **Docker Compose:** Orchestrates multi-container deployment for frontend and backend.

```
User <-> React/Vite (Frontend) <-> FastAPI (Backend) <-> SQLite DB
                                         |
                                         +-- GPT/AI Integration
```

---

## Deployment
- Deploy anywhere that supports Docker Compose (Render, Railway, DigitalOcean, etc.)
- For single-container deployment, use the respective Dockerfile in `frontend/` or `backend/`.

---

## License
MIT

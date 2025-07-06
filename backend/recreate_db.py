# recreate_db.py
import os
from app.database import engine
from app.models import Base

def recreate_database():
    # Remove the old database file
    if os.path.exists("tracker.db"):
        os.remove("tracker.db")
        print("✅ Removed old database file")
    
    # Create new tables
    Base.metadata.create_all(bind=engine)
    print("✅ Created new database with correct schema")

if __name__ == "__main__":
    recreate_database() 
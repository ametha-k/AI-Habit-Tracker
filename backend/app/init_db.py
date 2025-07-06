from app.database import Base, engine
from app import models

print("Creating database tables...")
Base.metadata.drop_all(bind=engine)  # Clears existing definitions
Base.metadata.create_all(bind=engine)
print("Done.")

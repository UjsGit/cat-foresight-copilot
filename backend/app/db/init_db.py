from backend.app.db.database import Base, engine
from backend.app.db.seed import seed_db

def init():
    Base.metadata.create_all(bind=engine)
    seed_db()

if __name__ == "__main__":
    init()

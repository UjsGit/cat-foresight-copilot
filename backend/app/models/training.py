from sqlalchemy import Column, String, Integer, Boolean
from backend.app.db.database import Base

class TrainingRecord(Base):
    __tablename__ = "training_records"

    training_id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    duration_minutes = Column(Integer, default=5)
    category = Column(String, default="Safety")
    recommended_reason = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    score = Column(Integer, nullable=True)
    assigned_to = Column(String, index=True)

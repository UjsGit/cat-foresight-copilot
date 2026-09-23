from sqlalchemy import Column, String, Float, Integer
from backend.app.db.database import Base

class Operator(Base):
    __tablename__ = "operators"

    operator_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    experience_years = Column(Float, nullable=False)
    experience_level = Column(String, nullable=False)
    shift_preference = Column(String, default="Day")
    avg_cycle_time_sec = Column(Float, default=40.0)
    efficiency_rating = Column(Float, default=90.0)
    safety_score = Column(Float, default=95.0)
    avatar = Column(String, default="")

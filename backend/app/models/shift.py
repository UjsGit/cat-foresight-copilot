from sqlalchemy import Column, String, Float, Integer, Boolean
from backend.app.db.database import Base

class Shift(Base):
    __tablename__ = "shifts"

    shift_id = Column(String, primary_key=True, index=True)
    operator_id = Column(String, index=True, nullable=False)
    machine_id = Column(String, index=True, nullable=False)
    task_id = Column(String, index=True, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=True)
    status = Column(String, default="active") # active, completed
    pre_start_completed = Column(Boolean, default=False)
    pre_start_checklist = Column(String, default="{}") # JSON string
    total_tonnes_moved = Column(Float, default=0.0)
    cycles_completed = Column(Integer, default=0)
    fuel_consumed_litres = Column(Float, default=0.0)
    idle_minutes = Column(Float, default=0.0)
    safety_incidents_count = Column(Integer, default=0)
    productivity_score = Column(Float, default=100.0)

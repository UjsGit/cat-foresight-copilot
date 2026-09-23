from sqlalchemy import Column, String, Float, Integer
from backend.app.db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(String, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    machine_type = Column(String, nullable=False)
    target_tonnes = Column(Float, default=300.0)
    material_type = Column(String, default="Aggregate")
    difficulty = Column(Float, default=1.0)
    site_zone = Column(String, default="Zone B")
    target_cycle_count = Column(Integer, default=30)
    baseline_duration_minutes = Column(Float, default=35.0)

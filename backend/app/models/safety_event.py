from sqlalchemy import Column, String, Float, Boolean
from backend.app.db.database import Base

class SafetyEvent(Base):
    __tablename__ = "safety_events"

    event_id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, index=True)
    operator_id = Column(String, index=True)
    machine_id = Column(String, index=True)
    event_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    title = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    recommended_action = Column(String, nullable=False)
    proximity_distance = Column(Float, nullable=True)
    machine_speed = Column(Float, nullable=True)
    machine_direction = Column(String, nullable=True)
    weather = Column(String, default="Clear")
    visibility_meters = Column(Float, nullable=True)
    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(String, nullable=True)
    incident_created = Column(Boolean, default=False)

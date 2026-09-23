from sqlalchemy import Column, String, Integer
from backend.app.db.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    incident_id = Column(String, primary_key=True, index=True)
    event_id = Column(String, nullable=True)
    timestamp = Column(String, index=True)
    operator_id = Column(String, index=True)
    operator_name = Column(String, nullable=False)
    machine_id = Column(String, index=True)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="Open")
    resolution_notes = Column(String, default="")
    follow_up_training_required = Column(String, default="")

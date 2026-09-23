from pydantic import BaseModel
from typing import Optional

class IncidentCreateRequest(BaseModel):
    event_id: Optional[str] = None
    operator_id: str
    operator_name: str
    machine_id: str
    severity: str
    title: str
    description: str
    resolution_notes: Optional[str] = ""
    follow_up_training_required: Optional[str] = ""

class IncidentResponse(BaseModel):
    incident_id: str
    event_id: Optional[str] = None
    timestamp: str
    operator_id: str
    operator_name: str
    machine_id: str
    severity: str
    title: str
    description: str
    status: str
    resolution_notes: Optional[str] = ""
    follow_up_training_required: Optional[str] = ""

    class Config:
        from_attributes = True

class IncidentAcknowledgeRequest(BaseModel):
    resolution_notes: Optional[str] = "Acknowledged and resolved safely by operator."

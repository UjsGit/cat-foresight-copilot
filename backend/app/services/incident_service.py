from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from backend.app.models.incident import Incident
from backend.app.models.safety_event import SafetyEvent
from backend.app.schemas.incident_schema import IncidentCreateRequest

class IncidentService:
    @staticmethod
    def list_incidents(db: Session, operator_id: Optional[str] = None) -> List[Incident]:
        query = db.query(Incident).order_by(Incident.timestamp.desc())
        if operator_id:
            query = query.filter(Incident.operator_id == operator_id)
        return query.all()

    @staticmethod
    def create_incident(db: Session, req: IncidentCreateRequest) -> Incident:
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        inc_id = f"INC-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        incident = Incident(
            incident_id=inc_id,
            event_id=req.event_id,
            timestamp=now_str,
            operator_id=req.operator_id,
            operator_name=req.operator_name,
            machine_id=req.machine_id,
            severity=req.severity,
            title=req.title,
            description=req.description,
            status="Acknowledged & Logged",
            resolution_notes=req.resolution_notes or "Operator acknowledged alert and safely stopped.",
            follow_up_training_required=req.follow_up_training_required or "Safe Reversing & Blind Spot Awareness"
        )
        db.add(incident)
        
        # If associated with safety event, update event record
        if req.event_id:
            evt = db.query(SafetyEvent).filter(SafetyEvent.event_id == req.event_id).first()
            if evt:
                evt.acknowledged = True
                evt.acknowledged_at = now_str
                evt.incident_created = True
                
        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def acknowledge_incident(db: Session, incident_id: str, notes: str) -> Optional[Incident]:
        inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
        if inc:
            inc.status = "Acknowledged & Resolved"
            inc.resolution_notes = notes
            db.commit()
            db.refresh(inc)
        return inc

incident_service = IncidentService()

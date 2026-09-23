from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.db.database import get_db
from backend.app.schemas.incident_schema import (
    IncidentCreateRequest, IncidentResponse, IncidentAcknowledgeRequest
)
from backend.app.services.incident_service import incident_service

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=List[IncidentResponse])
def list_incidents(operator_id: Optional[str] = None, db: Session = Depends(get_db)):
    return incident_service.list_incidents(db, operator_id)

@router.post("", response_model=IncidentResponse)
def create_incident(req: IncidentCreateRequest, db: Session = Depends(get_db)):
    return incident_service.create_incident(db, req)

@router.patch("/{incident_id}/acknowledge", response_model=IncidentResponse)
def acknowledge_incident(incident_id: str, req: IncidentAcknowledgeRequest, db: Session = Depends(get_db)):
    inc = incident_service.acknowledge_incident(db, incident_id, req.resolution_notes or "Acknowledged and resolved.")
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

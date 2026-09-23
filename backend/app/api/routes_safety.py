from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.database import get_db
from backend.app.models.safety_event import SafetyEvent
from backend.app.schemas.safety_schema import SafetyEvaluateRequest, SafetyAlertResponse, SafetyEventModelSchema
from backend.app.safety.risk_engine import risk_engine
from backend.app.services.telemetry_replay_service import telemetry_replay_service

router = APIRouter(prefix="/safety", tags=["safety"])

@router.post("/evaluate", response_model=SafetyAlertResponse)
def evaluate_safety(req: SafetyEvaluateRequest):
    return risk_engine.evaluate(req.model_dump())

@router.get("/events", response_model=List[SafetyEventModelSchema])
def list_safety_events(operator_id: str = "OP-001", db: Session = Depends(get_db)):
    events = db.query(SafetyEvent).order_by(SafetyEvent.timestamp.desc()).all()
    return events

@router.post("/acknowledge")
def acknowledge_current_alert():
    snapshot = telemetry_replay_service.acknowledge_critical_alert()
    return {"status": "success", "alert": snapshot["alert"]}

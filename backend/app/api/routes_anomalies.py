from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.schemas.anomaly_schema import AnomalyExplanationResponse
from backend.app.ml.anomaly_model import anomaly_service
from backend.app.services.telemetry_replay_service import telemetry_replay_service

router = APIRouter(prefix="/anomalies", tags=["anomalies"])

@router.get("/current", response_model=AnomalyExplanationResponse)
def get_current_anomaly():
    snapshot = telemetry_replay_service.get_current_snapshot()
    t = snapshot["telemetry"]
    res = anomaly_service.evaluate_telemetry(t, operator_id=t.get("operator_id", "OP-001"), task_id=t.get("task_id", "TASK-101"))
    return res

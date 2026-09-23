from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.database import get_db
from backend.app.models.telemetry import Telemetry
from backend.app.schemas.telemetry_schema import TelemetryRecord, TelemetryHistoryResponse
from backend.app.services.telemetry_replay_service import telemetry_replay_service

router = APIRouter(prefix="/telemetry", tags=["telemetry"])

@router.get("/latest", response_model=TelemetryRecord)
def get_latest_telemetry(db: Session = Depends(get_db)):
    snapshot = telemetry_replay_service.get_current_snapshot()
    return snapshot["telemetry"]

@router.get("/history", response_model=TelemetryHistoryResponse)
def get_telemetry_history(limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(Telemetry).order_by(Telemetry.id.desc()).limit(limit).all()
    # Reverse so oldest to newest
    records = list(reversed(records))
    return {"items": records, "count": len(records)}

@router.websocket("/stream")
async def websocket_telemetry_stream(websocket: WebSocket):
    await telemetry_replay_service.register(websocket)
    try:
        while True:
            # Keep connection open, handle client requests if any
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        telemetry_replay_service.unregister(websocket)
    except Exception:
        telemetry_replay_service.unregister(websocket)

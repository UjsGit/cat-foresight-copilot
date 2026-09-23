from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from backend.app.services.telemetry_replay_service import telemetry_replay_service

router = APIRouter(prefix="/demo", tags=["demo"])

class DemoControlRequest(BaseModel):
    action: str # "start", "next", "pause", "resume", "reset", "set_stage"
    stage: Optional[int] = None

@router.get("/state")
def get_demo_state():
    return telemetry_replay_service.get_current_snapshot()

@router.post("/control")
def control_demo(req: DemoControlRequest):
    if req.action == "next":
        return telemetry_replay_service.next_stage()
    elif req.action == "pause":
        return telemetry_replay_service.pause(True)
    elif req.action == "resume":
        return telemetry_replay_service.pause(False)
    elif req.action == "reset":
        return telemetry_replay_service.reset()
    elif req.action == "set_stage" and req.stage is not None:
        return telemetry_replay_service.set_stage(req.stage)
    elif req.action == "start":
        return telemetry_replay_service.set_stage(1)
    return telemetry_replay_service.get_current_snapshot()

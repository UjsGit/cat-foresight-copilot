from fastapi import APIRouter
from backend.app.schemas.copilot_schema import CopilotQueryRequest, CopilotQueryResponse
from backend.app.copilot.context_builder import copilot_engine
from backend.app.services.telemetry_replay_service import telemetry_replay_service

router = APIRouter(prefix="/copilot", tags=["copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
def query_copilot(req: CopilotQueryRequest):
    # Merge with active live telemetry if not supplied
    snapshot = telemetry_replay_service.get_current_snapshot()
    active_telemetry = snapshot["telemetry"]
    if req.current_telemetry:
        active_telemetry.update(req.current_telemetry)
        
    machine_state = req.machine_state or active_telemetry.get("machine_state", "operating")
    return copilot_engine.answer_query(req.query, machine_state=machine_state, telemetry=active_telemetry)

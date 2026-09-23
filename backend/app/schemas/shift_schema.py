from pydantic import BaseModel
from typing import Optional, Dict, Any

class ShiftStartRequest(BaseModel):
    operator_id: str
    machine_id: str
    task_id: str
    pre_start_checklist: Optional[Dict[str, bool]] = None

class ShiftResponse(BaseModel):
    shift_id: str
    operator_id: str
    machine_id: str
    task_id: str
    start_time: str
    end_time: Optional[str] = None
    status: str
    pre_start_completed: bool
    total_tonnes_moved: float
    cycles_completed: int
    fuel_consumed_litres: float
    idle_minutes: float
    safety_incidents_count: int
    productivity_score: float

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class TaskEstimateRequest(BaseModel):
    task_id: str
    machine_id: str
    operator_id: str
    current_progress_percent: float = 0.0
    payload_tonnes: float = 14.0
    number_of_cycles: int = 0
    machine_speed: float = 4.0
    idle_time_seconds: float = 0.0
    terrain_slope_degrees: float = 0.0
    rainfall_mm: float = 0.0
    visibility_meters: float = 1500.0
    wind_speed: float = 12.0
    ambient_temperature: float = 24.0
    machine_health_score: float = 95.0
    site_congestion: float = 0.2

class TaskEstimateResponse(BaseModel):
    task_id: str
    predicted_duration_minutes: float
    lower_bound_minutes: float
    upper_bound_minutes: float
    confidence: str # High, Medium, Low
    explanation: str
    top_contributors: List[Dict[str, Any]] = []

class TaskDetailResponse(BaseModel):
    task_id: str
    task_name: str
    machine_type: str
    target_tonnes: float
    material_type: str
    difficulty: float
    site_zone: str
    target_cycle_count: int
    baseline_duration_minutes: float

    class Config:
        from_attributes = True

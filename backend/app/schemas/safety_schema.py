from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class SafetyEvaluateRequest(BaseModel):
    seatbelt_status: str = "fastened"
    machine_speed: float = 0.0
    machine_direction: str = "neutral"
    machine_state: str = "idle"
    proximity_distance_meters: Optional[float] = None
    nearby_person_count: int = 0
    nearby_vehicle_count: int = 0
    detected_object_type: Optional[str] = None
    object_confidence: Optional[float] = None
    visibility_meters: float = 1500.0
    rainfall_mm: float = 0.0
    terrain_slope_degrees: float = 0.0
    hydraulic_temperature: float = 75.0
    camera_active: bool = True

class SafetyAlertResponse(BaseModel):
    severity: str # CRITICAL, WARNING, INFO
    risk_score: float # 0 - 100
    title: str
    concise_reason: str
    recommended_action: str
    contextual_evidence: Dict[str, Any] = {}
    timestamp: str
    acknowledged: bool = False
    event_id: Optional[str] = None

class SafetyEventModelSchema(BaseModel):
    event_id: str
    timestamp: str
    operator_id: str
    machine_id: str
    event_type: str
    severity: str
    risk_score: float
    title: str
    reason: str
    recommended_action: str
    proximity_distance: Optional[float] = None
    machine_speed: Optional[float] = None
    machine_direction: Optional[str] = None
    weather: str
    visibility_meters: Optional[float] = None
    acknowledged: bool
    acknowledged_at: Optional[str] = None
    incident_created: bool

    class Config:
        from_attributes = True

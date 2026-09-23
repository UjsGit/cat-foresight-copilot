from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class DetectedObject(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float] # [x1, y1, x2, y2]
    estimated_distance_meters: float
    hazard_level: str # CRITICAL, WARNING, SAFE

class VisionDetectionResponse(BaseModel):
    detections: List[DetectedObject]
    person_count: int
    vehicle_count: int
    min_person_distance: Optional[float] = None
    min_vehicle_distance: Optional[float] = None
    safety_risk_score: float
    severity: str
    recommended_action: str
    mode: str # "yolo_v8_live" or "demo_simulation"
    processed_timestamp: str

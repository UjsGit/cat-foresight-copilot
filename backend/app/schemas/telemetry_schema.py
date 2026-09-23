from pydantic import BaseModel
from typing import Optional, List

class TelemetryRecord(BaseModel):
    timestamp: str
    shift_id: Optional[str] = None
    machine_id: str
    operator_id: str
    machine_type: str
    task_id: str
    engine_hours: float
    engine_rpm: float
    engine_load: float
    fuel_level: float
    fuel_consumption_rate: float
    hydraulic_temperature: float
    coolant_temperature: float
    hydraulic_pressure: float
    machine_speed: float
    machine_direction: str
    machine_state: str
    idle_time_seconds: float
    cycle_time_seconds: float
    payload_tonnes: float
    bucket_load_percent: float
    number_of_cycles: int
    operating_mode: str
    latitude: float
    longitude: float
    site_zone: str
    terrain_slope_degrees: float
    vibration: float
    ambient_temperature: float
    rainfall_mm: float
    visibility_meters: float
    wind_speed: float
    seatbelt_status: str
    proximity_distance_meters: Optional[float] = None
    nearby_person_count: int
    nearby_vehicle_count: int
    fault_code: str
    machine_health_score: float
    task_progress_percent: float
    site_congestion: float = 0.2

    class Config:
        from_attributes = True

class TelemetryHistoryResponse(BaseModel):
    items: List[TelemetryRecord]
    count: int

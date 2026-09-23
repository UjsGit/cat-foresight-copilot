from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class TimelineEvent(BaseModel):
    timestamp: str
    type: str
    title: str
    description: str
    severity: str

class ShiftSummaryResponse(BaseModel):
    shift_id: str
    operator_id: str
    operator_name: str
    machine_id: str
    machine_name: str
    duration_hours: float
    tasks_completed: str # e.g. "7 / 8"
    productivity_pct_vs_baseline: float # e.g. +8.0%
    total_fuel_litres: float
    fuel_efficiency_score: float # 0 - 100
    idle_time_minutes: float
    critical_alerts_count: int
    critical_alerts_acknowledged: int
    machine_health_status: str
    eta_prediction_accuracy_pct: float
    supervisor_review_message: str
    recommended_trainings: List[Dict[str, Any]] = []
    notable_timeline_events: List[TimelineEvent] = []

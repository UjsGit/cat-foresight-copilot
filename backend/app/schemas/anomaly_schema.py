from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AnomalyExplanationResponse(BaseModel):
    is_anomaly: bool
    anomaly_score: float # -1 to 1 (negative = anomaly)
    category: str # "task/environment", "machine_health", "coaching_opportunity", "nominal"
    metric: str
    current_value: float
    baseline_value: float
    pct_deviation: float
    headline: str
    explanation: str
    likely_contributors: List[str] = []
    classification: str
    recommended_actions: List[str] = []
    contextual_data: Dict[str, Any] = {}

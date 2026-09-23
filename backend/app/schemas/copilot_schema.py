from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class CopilotQueryRequest(BaseModel):
    query: str
    machine_state: Optional[str] = "operating"
    operator_id: Optional[str] = "OP-001"
    task_id: Optional[str] = "TASK-101"
    machine_id: Optional[str] = "CAT-EX-336"
    current_telemetry: Optional[Dict[str, Any]] = None

class CopilotQueryResponse(BaseModel):
    query: str
    short_answer: str # Cab-safe glanceable answer (< 2 lines)
    full_explanation: str
    confidence: float
    grounded_reasoning: str
    recommended_actions: List[str] = []
    context_used: Dict[str, Any] = {}
    suggested_followups: List[str] = []
    source_documents: List[str] = []

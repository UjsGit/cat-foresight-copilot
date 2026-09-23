from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class TrainingModuleSchema(BaseModel):
    id: str
    title: str
    category: str
    duration_minutes: int
    icon: Optional[str] = None
    description: str
    trigger_reason: str
    key_takeaways: List[str] = []
    completed: bool = False
    score: Optional[int] = None
    quiz: Optional[Dict[str, Any]] = None

class TrainingCompleteRequest(BaseModel):
    score: Optional[int] = 100

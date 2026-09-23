from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.db.database import get_db
from backend.app.models.operator import Operator

router = APIRouter(prefix="/operators", tags=["operators"])

@router.get("", response_model=List[Dict[str, Any]])
def list_operators(db: Session = Depends(get_db)):
    ops = db.query(Operator).all()
    return [
        {
            "operator_id": o.operator_id,
            "name": o.name,
            "experience_years": o.experience_years,
            "experience_level": o.experience_level,
            "shift_preference": o.shift_preference,
            "avg_cycle_time_sec": o.avg_cycle_time_sec,
            "efficiency_rating": o.efficiency_rating,
            "safety_score": o.safety_score,
            "avatar": o.avatar
        }
        for o in ops
    ]

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.db.database import get_db
from backend.app.schemas.training_schema import TrainingModuleSchema, TrainingCompleteRequest
from backend.app.services.training_service import training_service

router = APIRouter(prefix="/training", tags=["training"])

@router.get("/recommendations", response_model=List[TrainingModuleSchema])
def get_recommendations(operator_id: str = "OP-001", db: Session = Depends(get_db)):
    return training_service.get_recommendations(db, operator_id)

@router.post("/{training_id}/complete")
def complete_training(training_id: str, req: TrainingCompleteRequest, operator_id: str = "OP-001", db: Session = Depends(get_db)):
    return training_service.complete_training(db, training_id, operator_id, score=req.score or 100)

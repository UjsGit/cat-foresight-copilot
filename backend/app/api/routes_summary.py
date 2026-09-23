from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.schemas.summary_schema import ShiftSummaryResponse
from backend.app.services.shift_summary_service import shift_summary_service

router = APIRouter(prefix="/shift", tags=["shift"])

@router.get("/summary", response_model=ShiftSummaryResponse)
def get_shift_summary(operator_id: str = "OP-001", db: Session = Depends(get_db)):
    return shift_summary_service.get_summary(db, operator_id)

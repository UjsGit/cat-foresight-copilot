import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.db.database import get_db
from backend.app.models.shift import Shift
from backend.app.schemas.shift_schema import ShiftStartRequest, ShiftResponse

router = APIRouter(prefix="/shift", tags=["shift"])

@router.post("/start", response_model=ShiftResponse)
def start_shift(req: ShiftStartRequest, db: Session = Depends(get_db)):
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    shift_id = f"SHIFT-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
    
    # Close any existing active shifts for operator
    active_shifts = db.query(Shift).filter(Shift.operator_id == req.operator_id, Shift.status == "active").all()
    for s in active_shifts:
        s.status = "completed"
        s.end_time = now_str
        
    new_shift = Shift(
        shift_id=shift_id,
        operator_id=req.operator_id,
        machine_id=req.machine_id,
        task_id=req.task_id,
        start_time=now_str,
        status="active",
        pre_start_completed=bool(req.pre_start_checklist),
        pre_start_checklist=json.dumps(req.pre_start_checklist or {}),
        total_tonnes_moved=0.0,
        cycles_completed=0,
        fuel_consumed_litres=0.0,
        idle_minutes=0.0,
        safety_incidents_count=0,
        productivity_score=100.0
    )
    db.add(new_shift)
    db.commit()
    db.refresh(new_shift)
    return new_shift

@router.get("/current", response_model=ShiftResponse)
def get_current_shift(operator_id: str = "OP-001", db: Session = Depends(get_db)):
    shift = db.query(Shift).filter(Shift.operator_id == operator_id, Shift.status == "active").order_by(Shift.start_time.desc()).first()
    if not shift:
        # Fallback to any active or recent shift
        shift = db.query(Shift).order_by(Shift.start_time.desc()).first()
    if not shift:
        raise HTTPException(status_code=404, detail="No active shift found")
    return shift

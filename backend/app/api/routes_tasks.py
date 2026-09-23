from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.database import get_db
from backend.app.models.task import Task
from backend.app.schemas.task_schema import TaskEstimateRequest, TaskEstimateResponse, TaskDetailResponse
from backend.app.ml.task_eta_model import task_eta_service
from backend.app.services.task_service import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/current", response_model=TaskDetailResponse)
def get_current_task(db: Session = Depends(get_db)):
    task = task_service.get_current_task(db)
    if not task:
        raise HTTPException(status_code=404, detail="No active task found")
    return task

@router.get("", response_model=List[TaskDetailResponse])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.post("/{task_id}/estimate", response_model=TaskEstimateResponse)
def estimate_task_eta(task_id: str, req: TaskEstimateRequest):
    data = req.model_dump()
    data["task_id"] = task_id
    res = task_eta_service.predict_eta(data)
    return res

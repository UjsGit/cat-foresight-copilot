from sqlalchemy.orm import Session
from backend.app.models.task import Task
from backend.app.schemas.task_schema import TaskDetailResponse

class TaskService:
    @staticmethod
    def get_task(db: Session, task_id: str) -> Task:
        return db.query(Task).filter(Task.task_id == task_id).first()

    @staticmethod
    def get_current_task(db: Session) -> Task:
        # Defaults to TASK-101 for Priya
        task = db.query(Task).filter(Task.task_id == "TASK-101").first()
        if not task:
            task = db.query(Task).first()
        return task

task_service = TaskService()

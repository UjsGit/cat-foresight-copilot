from backend.app.api.routes_shift import router as shift_router
from backend.app.api.routes_telemetry import router as telemetry_router
from backend.app.api.routes_tasks import router as tasks_router
from backend.app.api.routes_safety import router as safety_router
from backend.app.api.routes_incidents import router as incidents_router
from backend.app.api.routes_anomalies import router as anomalies_router
from backend.app.api.routes_copilot import router as copilot_router
from backend.app.api.routes_training import router as training_router
from backend.app.api.routes_vision import router as vision_router
from backend.app.api.routes_summary import router as summary_router
from backend.app.api.routes_demo import router as demo_router
from backend.app.api.routes_operators import router as operators_router

__all__ = [
    "shift_router",
    "telemetry_router",
    "tasks_router",
    "safety_router",
    "incidents_router",
    "anomalies_router",
    "copilot_router",
    "training_router",
    "vision_router",
    "summary_router",
    "demo_router",
    "operators_router"
]

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.core.config import settings
from backend.app.db.init_db import init as init_database
from backend.app.api import (
    shift_router,
    telemetry_router,
    tasks_router,
    safety_router,
    incidents_router,
    anomalies_router,
    copilot_router,
    training_router,
    vision_router,
    summary_router,
    demo_router,
    operators_router
)
from backend.app.services.telemetry_replay_service import telemetry_replay_service

# Background telemetry broadcaster for live WebSocket clients
async def telemetry_broadcaster():
    while True:
        try:
            if not telemetry_replay_service.is_paused and telemetry_replay_service.active_websockets:
                snapshot = telemetry_replay_service.get_current_snapshot()
                await telemetry_replay_service.broadcast({
                    "type": "TELEMETRY_UPDATE",
                    "data": snapshot
                })
        except Exception as e:
            print(f"Broadcast error: {e}")
        await asyncio.sleep(2.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting CAT ForeSight Copilot Backend...")
    # Initialize DB tables and seed data
    init_database()
    # Start live telemetry broadcast background worker
    broadcast_task = asyncio.create_task(telemetry_broadcaster())
    yield
    broadcast_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="An explainable, operator-first safety and productivity copilot for heavy-equipment operators.",
    lifespan=lifespan
)

# Enable CORS for local frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(shift_router, prefix=settings.API_V1_STR)
app.include_router(telemetry_router, prefix=settings.API_V1_STR)
app.include_router(tasks_router, prefix=settings.API_V1_STR)
app.include_router(safety_router, prefix=settings.API_V1_STR)
app.include_router(incidents_router, prefix=settings.API_V1_STR)
app.include_router(anomalies_router, prefix=settings.API_V1_STR)
app.include_router(copilot_router, prefix=settings.API_V1_STR)
app.include_router(training_router, prefix=settings.API_V1_STR)
app.include_router(vision_router, prefix=settings.API_V1_STR)
app.include_router(summary_router, prefix=settings.API_V1_STR)
app.include_router(demo_router, prefix=settings.API_V1_STR)
app.include_router(operators_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": "CAT ForeSight Copilot API",
        "status": "online",
        "docs": "/docs",
        "architecture": "Operator-First Decision Support Copilot"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

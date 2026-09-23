import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CAT ForeSight Copilot"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./foresight.db"
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    KNOWLEDGE_BASE_DIR: str = os.path.join(BASE_DIR, "..", "knowledge_base")
    ML_ARTIFACTS_DIR: str = os.path.join(BASE_DIR, "..", "ml", "artifacts")
    SYNTHETIC_DATA_DIR: str = os.path.join(BASE_DIR, "..", "ml", "synthetic_data")

settings = Settings()

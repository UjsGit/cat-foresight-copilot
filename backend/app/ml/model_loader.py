import os
import joblib
from backend.app.core.config import settings

class ModelLoader:
    _eta_artifact = None
    _anomaly_artifact = None

    @classmethod
    def get_eta_model(cls):
        if cls._eta_artifact is None:
            path = os.path.join(settings.ML_ARTIFACTS_DIR, "eta_model.joblib")
            if os.path.exists(path):
                cls._eta_artifact = joblib.load(path)
            else:
                print(f"Warning: {path} not found.")
        return cls._eta_artifact

    @classmethod
    def get_anomaly_model(cls):
        if cls._anomaly_artifact is None:
            path = os.path.join(settings.ML_ARTIFACTS_DIR, "anomaly_model.joblib")
            if os.path.exists(path):
                cls._anomaly_artifact = joblib.load(path)
            else:
                print(f"Warning: {path} not found.")
        return cls._anomaly_artifact

model_loader = ModelLoader()

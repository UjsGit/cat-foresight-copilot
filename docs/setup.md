# Setup & Installation Guide: CAT ForeSight Copilot

## 1. Prerequisites
- Python 3.10+ (with pip)
- Node.js 18+ (with npm)
- Git

---

## 2. Quickstart Execution (One-Time Setup)

### Step 1: Install Python Dependencies & Generate Synthetic Data / Train ML Models
```bash
# In the root repository directory
pip install -r backend/requirements.txt

# Generate 30,000 correlated telemetry rows
python ml/scripts/generate_synthetic_data.py

# Validate physical & statistical correlation rules
python ml/scripts/validate_dataset_relationships.py

# Train Adaptive ETA Gradient Boosting & Baseline Ridge Models
python ml/scripts/train_eta_model.py

# Train IsolationForest Anomaly & Operator Baseline Profiler
python ml/scripts/train_anomaly_model.py
```

### Step 2: Start the FastAPI Backend
```bash
# From repository root
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger documentation available at: `http://localhost:8000/docs`*

### Step 3: Start the React Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open your browser at: `http://localhost:3000`*

---

## 3. Docker Deployment (Optional)
```bash
docker-compose up --build
```

---

## 4. Common Troubleshooting
1. **Port 8000 / 3000 occupied**: Kill existing node/python process or update port in `vite.config.ts` and `uvicorn` command.
2. **Missing sqlite database**: The database `foresight.db` is auto-created and populated with seed data on backend startup.
3. **YOLO weights downloading**: First execution of the vision detector will download `yolov8n.pt` (~6 MB) automatically. If offline, the app switches to demo simulation fallback seamlessly.

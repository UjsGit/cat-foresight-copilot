# CAT ForeSight Copilot
> **“An explainable, operator-first safety and productivity copilot for heavy-equipment operators.”**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg?style=flat&logo=Vite&logoColor=white)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<img width="1918" height="991" alt="CAT ForeSight Copilot" src="./assets/foresight-copilot.png" />


---

## 🏗️ 1. Product Overview

**CAT ForeSight Copilot** is a campus hiring hackathon prototype inspired by construction equipment (excavators, wheel loaders, haul trucks).

### 🔑 Important Product Principles
- **NOT a Fleet-Manager Dashboard**: The user is the heavy equipment operator sitting inside the cab. The UI feels like an industrial cockpit: dark, high-contrast, low-distraction, glanceable, and safety-first.
- **Safety Decision Support Only**: This application does not directly actuate machinery. All machine controls remain with the operator and external certified systems.
- **The Core Product Loop**:
  $$\text{Detect} \longrightarrow \text{Assess Context} \longrightarrow \text{Explain} \longrightarrow \text{Recommend} \longrightarrow \text{Log} \longrightarrow \text{Coach} \longrightarrow \text{Measure}$$

---

## ⚡ 2. Key Features

1. **Glanceable Live Cab Cockpit**: Instant answers to: *What am I doing now? What next? Is anything unsafe? Is my machine healthy? Am I on schedule?*
2. **Adaptive ETA Prediction (HistGradientBoostingRegressor)**: Predicts remaining completion time with prediction intervals, confidence scoring, and factor decomposition (weather, slope, congestion, payload).
3. **Deterministic & Contextual Safety Risk Engine**: Combines hard safety overrides (reversing blind zone, moving unbelted, hydraulic overheating) with continuous risk scoring (0–100).
4. **AI Computer Vision (Ultralytics YOLOv8)**: Detects personnel and vehicles with camera-estimated distance heuristics and bounding-box risk tagging.
5. **Explainable Anomaly Detection (IsolationForest)**: Evaluates variances against personal baselines and attributes physical causes (slope, payload, staging idle) without blaming the operator.
6. **Local Grounded AI Copilot**: Fully local keyword/retrieval engine against Markdown knowledge files with cab-safe short answers in motion.
7. **Personalized Training Hub**: Event-triggered micro-learning modules (Safe Reversing, Efficient Idle) with interactive quizzes and badges.
8. **End-of-Shift Performance Debrief**: Balanced review message, baseline comparisons (+8% productivity, fuel efficiency, safety compliance).
9. **Interactive 6-Stage Scripted Demo Toolbar**: Instant stage control for smooth, reliable 5-minute hackathon presentations.

---

## 📂 3. Project Structure

```text
cat-foresight-copilot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Header, Navigation, DemoReplayToolbar, CriticalAlertModal
│   │   │   └── dashboard/    # MachineVitalsCard, ProximityRadarCard, AdaptiveEtaCard, CopilotMiniInsight
│   │   ├── pages/            # 11 Dedicated Pages (LiveCab, PreStart, Safety, Vision, Health, Copilot, etc.)
│   │   ├── context/          # AppContext (WebSocket, state sync, Web Audio alerts)
│   │   ├── services/         # API fetch layer
│   │   ├── types/            # Complete TypeScript schemas
│   │   └── utils/            # Web Audio alert synthesizer
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/              # REST & WebSocket routes (Shift, Telemetry, Safety, Tasks, Vision, Copilot, etc.)
│   │   ├── core/             # Config & Constants
│   │   ├── db/               # SQLite database, models, seed logic
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Telemetry replay, incident, task, shift summary services
│   │   ├── ml/               # Model loaders, ETA predictor, Anomaly explainer
│   │   ├── safety/           # Deterministic rules & contextual risk scoring engine
│   │   ├── copilot/          # Offline knowledge retriever & context builder
│   │   ├── vision/           # YOLOv8 detector & distance estimator
│   │   └── main.py           # FastAPI entrypoint
│   └── requirements.txt
│
├── ml/
│   ├── scripts/
│   │   ├── generate_synthetic_data.py        # Generates 30,000 correlated rows
│   │   ├── validate_dataset_relationships.py # Statistical validation tests
│   │   ├── train_eta_model.py                # Trains Ridge baseline + HistGradientBoosting
│   │   └── train_anomaly_model.py            # Fits IsolationForest & operator baselines
│   ├── synthetic_data/                       # Generated CSVs
│   └── artifacts/                            # Persisted joblib models
│
├── knowledge_base/                           # Markdown guides & training JSON
├── docs/                                     # Architecture, API, Dataset, Demo Script, Setup
├── docker-compose.yml
└── README.md
```

---

## 🚀 4. Quick Start Instructions

### A. Environment Setup & Machine Learning Training
```bash
# 1. Install python dependencies
pip install -r backend/requirements.txt

# 2. Generate 30,000 physics-correlated telemetry records
python ml/scripts/generate_synthetic_data.py

# 3. Validate statistical relationships
python ml/scripts/validate_dataset_relationships.py

# 4. Train the ML models (ETA + Anomaly)
python ml/scripts/train_eta_model.py
python ml/scripts/train_anomaly_model.py
```

### B. Start the Backend Server (FastAPI)
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API Swagger Docs: `http://localhost:8000/docs`*

### C. Start the Frontend Server (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Open in browser: `http://localhost:3000`*

---

## 🎬 5. Scripted Demo Sequence (Toolbar Controls)

| Stage | Scenario | Visual & AI Response |
| :--- | :--- | :--- |
| **Stage 1** | Shift Start | Priya completes pre-start checks. Initial baseline ETA is **32 min** (28–37 min range). |
| **Stage 2** | Normal Operation | Telemetry streams normally. Task progress increases to 42%. |
| **Stage 3** | Weather & Slope | Rain begins (8.5mm), visibility drops, slope is 12°. ETA jumps to **41 min** with clear explanation. |
| **Stage 4** | Critical Safety Hazard | Machine reverses at 7 km/h, person detected 4.2m behind. **CRITICAL RED STOP ALERT** sounds. |
| **Stage 5** | Explainable Anomaly | Fuel burn spikes +18%. IsolationForest attributes variance to payload and 12° slope without operator blame. |
| **Stage 6** | Shift Summary | Shift concludes: +8% productivity, 1 acknowledged incident, personalized training assigned. |

---

## 📋 6. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/operators` | List operator profiles & baselines |
| `POST` | `/api/shift/start` | Start shift with checklist verification |
| `GET` | `/api/shift/current` | Active shift state |
| `GET` | `/api/shift/summary` | End-of-shift productivity debrief |
| `GET` | `/api/telemetry/latest` | Latest ECM telemetry record |
| `WS` | `/api/telemetry/stream` | Real-time WebSocket telemetry feed |
| `GET` | `/api/tasks/current` | Current quarry task parameters |
| `POST` | `/api/tasks/{id}/estimate` | Adaptive ETA ML prediction |
| `POST` | `/api/safety/evaluate` | Contextual safety risk evaluation |
| `POST` | `/api/safety/acknowledge` | Acknowledge active hazard alert |
| `GET` | `/api/incidents` | Incident history log |
| `GET` | `/api/anomalies/current` | IsolationForest explainable anomaly |
| `POST` | `/api/copilot/query` | Grounded local AI copilot query |
| `GET` | `/api/training/recommendations` | Assigned micro-learning modules |
| `POST` | `/api/vision/detect` | YOLOv8 object detection & distance |
| `POST` | `/api/demo/control` | Control 6-stage demo player |

---

## Screenshots 

1. Daily Task Dashboard view scheduled tasks for the day
<img width="1918" height="888" alt="image" src="https://github.com/user-attachments/assets/48fd9028-657f-4212-ba02-3ad20bd2c251" />

2. Real-Time Safety Features
• Seatbelt compliance
• Proximity hazards
• Incident logging
(Working conditions considered)
<img width="1918" height="945" alt="image" src="https://github.com/user-attachments/assets/318745a1-732c-420c-bfd2-98d95490502f" />

3. Operator Training Hub
e-learning, simulation, or micro-modules
<img width="1908" height="830" alt="image" src="https://github.com/user-attachments/assets/58da4ad3-510b-4474-ab27-88151a39602f" />

4. Identify Unusual Behavior
Excessive idling, unsafe patterns, fuel spikes
<img width="1916" height="933" alt="image" src="https://github.com/user-attachments/assets/2680eef0-edf3-4f89-babb-1adc64dca817" />

5. Task Time Estimation (Adaptive ETA)
Predict time based on past data & weather
<img width="1915" height="949" alt="image" src="https://github.com/user-attachments/assets/290b2194-0034-4a2a-8265-f9c70fdd76b7" />


## 🔒 Safety & Prototype Notice
*CAT ForeSight Copilot is a prototype decision-support software intended solely for operator guidance and training. It does not replace physical machine safety interlocks, visual mirrors, or certified spotter protocols.*

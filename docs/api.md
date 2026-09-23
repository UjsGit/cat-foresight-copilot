# API Documentation: CAT ForeSight Copilot

Base URL: `http://localhost:8000/api`

## 1. Shift & Operator Management
- `GET /api/operators`: List all operator profiles (Priya Raman, Arjun Kumar, Rahul Das) with experience, safety scores, and baseline cycle times.
- `POST /api/shift/start`: Initiate a shift session after verifying the pre-start safety checklist.
- `GET /api/shift/current`: Retrieve active shift metrics, tonnes moved, cycle count, and safety status.
- `GET /api/shift/summary`: Generate end-of-shift productivity debrief, baseline comparisons, and supervisor feedback.

## 2. Telemetry & Machine State
- `GET /api/telemetry/latest`: Latest ECM vitals (RPM, engine load, fuel rate, hydraulic temp, slope, weather).
- `GET /api/telemetry/history`: Historical telemetry stream.
- `WS /api/telemetry/stream`: WebSocket streaming live telemetry snapshots at 2 Hz.

## 3. Tasks & Adaptive ETA
- `GET /api/tasks/current`: Details of the current active quarry assignment.
- `POST /api/tasks/{task_id}/estimate`: Run the Gradient Boosting ETA regression model with real-time weather and slope inputs. Returns prediction, confidence interval, and factor attribution.

## 4. Safety & Contextual Risk Engine
- `POST /api/safety/evaluate`: Real-time contextual risk score (0-100) and deterministic override checks.
- `GET /api/safety/events`: Time-stamped history of proximity alerts and overrides.
- `POST /api/safety/acknowledge`: Acknowledge critical hazard alarm, transition machine state to parked, and log incident.

## 5. Incidents & Governance
- `GET /api/incidents`: Query logged near-misses and safety interventions.
- `POST /api/incidents`: Create immutable incident log.
- `PATCH /api/incidents/{id}/acknowledge`: Mark incident status as resolved with operator notes.

## 6. Explainable Anomaly Detection
- `GET /api/anomalies/current`: Multivariate IsolationForest evaluation comparing against operator baseline. Explains physical contributors (payload, slope, staging idle) rather than blaming operator.

## 7. AI Copilot
- `POST /api/copilot/query`: Local keyword retrieval against offline knowledge documents. Answers queries with grounded sensor evidence, providing concise answers when moving.

## 8. Training & Micro-Learning
- `GET /api/training/recommendations`: Personalized training modules triggered by shift safety events.
- `POST /api/training/{id}/complete`: Record quiz completion and badge unlock.

## 9. Computer Vision Detection
- `POST /api/vision/detect`: Upload camera frames or run demo stream with Ultralytics YOLOv8 object detection and distance estimation.

## 10. Demo Replay Controller
- `GET /api/demo/state`: Fetch full synchronized demo replay state.
- `POST /api/demo/control`: Advance or reset scripted 6-stage hackathon presentation scenarios.

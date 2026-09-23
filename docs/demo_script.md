# 5-Minute Hackathon Demo Script: CAT ForeSight Copilot

This script guides presenters through the end-to-end hackathon prototype demonstration.

---

## ⏱ Minute 0:00 – 1:00 | Introduction & Cab Authentication
- **Speaker Line**: *"Judges, heavy equipment operators operate multi-ton excavators in noisy, low-visibility quarry conditions. Current telematics systems serve fleet managers in distant offices, not the operator inside the cab. CAT ForeSight Copilot is an operator-first, explainable decision support cockpit that detects risks, explains machine variances without blaming the operator, and recommends micro-training."*
- **Action**:
  1. Open `http://localhost:3000/login`.
  2. Point out the 3 operator profiles (Priya Raman - 2 yrs, Arjun - 8 yrs, Rahul - 4 mos).
  3. Click **Priya Raman** -> Opens **Pre-Start Safety Check**.
  4. Notice the lockout: *"Begin Cab Operation"* is disabled until mandatory checks pass.
  5. Click **"Verify All Items"** -> Click **"Begin Cab Operation"**.

---

## ⏱ Minute 1:00 – 2:00 | Live Cab Glanceability & Baseline ETA (Stage 1 & 2)
- **Speaker Line**: *"We are now in the live cab cockpit. Notice the dark, high-contrast industrial interface with glove-friendly buttons. In 2 seconds, Priya knows: what she is doing (loading Zone B aggregate), her vitals are nominal, and her ML-predicted task ETA is 32 minutes."*
- **Action**:
  1. Click **Stage 2 (Normal Operation)** on the Demo Toolbar.
  2. Point to the task progress increasing to 42%, healthy engine RPM/load gauges, and perimeter radar.

---

## ⏱ Minute 2:00 – 3:00 | Weather Degradation & Adaptive ETA (Stage 3)
- **Speaker Line**: *"Now, sudden rain begins and Priya transitions to a 12° quarry slope incline. Notice how our HistGradientBoosting ETA model dynamically updates the completion estimate from 32 min to 41 min with confidence intervals and clear physics-grounded explanations."*
- **Action**:
  1. Click **Stage 3 (Weather & Slope)** on the Demo Toolbar.
  2. Point to the rain badge, 12° slope gauge, and the ML explanation card: *"Expected duration increased because rain reduced visibility, site congestion increased, and current terrain slope is 12°."*

---

## ⏱ Minute 3:00 – 4:00 | Critical Reversing Safety Intervention (Stage 4)
- **Speaker Line**: *"Priya shifts into reverse at 7 km/h. Our YOLO computer vision and proximity radar detect a surveyor 4.2m in the rear blind spot. In rain, reaction times drop, so the Copilot triggers an immediate high-priority safety directive."*
- **Action**:
  1. Click **Stage 4 (Critical Hazard)** on the Demo Toolbar.
  2. The audible alarm sounds and full-screen critical banner flashes: **"STOP — PERSON IN REAR HAZARD ZONE"**.
  3. Point to the reason and directive.
  4. Click **"Acknowledge and Stop"** -> Machine state shifts to stationary, incident is automatically logged to the audit trail.
  5. Navigate to **Camera Vision** tab to show YOLO bounding boxes and camera-estimated distance.

---

## ⏱ Minute 4:00 – 4:30 | Explainable Anomaly & Copilot Grounding (Stage 5)
- **Speaker Line**: *"Later in the shift, Priya's fuel burn spikes 18% above baseline. Rather than penalizing the operator, our IsolationForest model attributes the variance to 16.2t payload density, 12° incline resistance, and staging idle."*
- **Action**:
  1. Click **Stage 5 (Fuel Anomaly)** on the Demo Toolbar.
  2. Go to **Machine Health** tab -> Show *"Likely task/environment influenced — not operator error"*.
  3. Go to **AI Copilot** tab -> Click quick chip: *"Why did you recommend slowing down?"* and *"Why is my fuel consumption high?"* to show grounded explanations.

---

## ⏱ Minute 4:30 – 5:00 | Shift Summary & Personalized Coaching (Stage 6)
- **Speaker Line**: *"At shift completion, Priya receives a balanced performance debrief: 7/8 tasks finished, +8% productivity, and 1 safely acknowledged incident. Targeted micro-learning on Safe Reversing is assigned."*
- **Action**:
  1. Click **Stage 6 (Shift Summary)** on the Demo Toolbar.
  2. Review the balanced supervisor message: *"Strong task pace under challenging conditions. One high-risk reversing event was identified and acknowledged. Focus on rear-zone verification and idle management."*
  3. Navigate to **Training Hub** -> Click **"Start Mini-Quiz"** on Safe Reversing -> Answer option B -> Celebrate certified 100% completion badge.

---

## 🛡 Backup Steps if Camera Video/Weights are Unavailable
- The Computer Vision module contains a zero-dependency simulated mode that overlays bounding boxes, distance markers, and risk evaluation seamlessly.

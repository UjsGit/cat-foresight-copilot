import {
  Operator,
  Machine,
  Task,
  TelemetryData,
  SafetyAlert,
  TaskEtaPrediction,
  AnomalyExplanation,
  ShiftInfo,
  IncidentRecord,
  TrainingModule,
  ShiftSummaryData,
  VisionDetectionResult
} from '../types';

const API_BASE = '/api';

export const api = {
  // Operators
  getOperators: async (): Promise<Operator[]> => {
    const res = await fetch(`${API_BASE}/operators`);
    return res.json();
  },

  // Shifts
  startShift: async (data: {
    operator_id: string;
    machine_id: string;
    task_id: string;
    pre_start_checklist?: Record<string, boolean>;
  }): Promise<ShiftInfo> => {
    const res = await fetch(`${API_BASE}/shift/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getCurrentShift: async (operatorId = 'OP-001'): Promise<ShiftInfo> => {
    const res = await fetch(`${API_BASE}/shift/current?operator_id=${operatorId}`);
    return res.json();
  },

  getShiftSummary: async (operatorId = 'OP-001'): Promise<ShiftSummaryData> => {
    const res = await fetch(`${API_BASE}/shift/summary?operator_id=${operatorId}`);
    return res.json();
  },

  // Telemetry
  getLatestTelemetry: async (): Promise<TelemetryData> => {
    const res = await fetch(`${API_BASE}/telemetry/latest`);
    return res.json();
  },

  getTelemetryHistory: async (limit = 50): Promise<{ items: TelemetryData[]; count: number }> => {
    const res = await fetch(`${API_BASE}/telemetry/history?limit=${limit}`);
    return res.json();
  },

  // Tasks & ETA
  getCurrentTask: async (): Promise<Task> => {
    const res = await fetch(`${API_BASE}/tasks/current`);
    return res.json();
  },

  estimateTaskEta: async (taskId: string, payload: any): Promise<TaskEtaPrediction> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Safety
  evaluateSafety: async (payload: any): Promise<SafetyAlert> => {
    const res = await fetch(`${API_BASE}/safety/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getSafetyEvents: async (operatorId = 'OP-001'): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/safety/events?operator_id=${operatorId}`);
    return res.json();
  },

  acknowledgeAlert: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/safety/acknowledge`, {
      method: 'POST',
    });
    return res.json();
  },

  // Incidents
  getIncidents: async (operatorId?: string): Promise<IncidentRecord[]> => {
    const url = operatorId ? `${API_BASE}/incidents?operator_id=${operatorId}` : `${API_BASE}/incidents`;
    const res = await fetch(url);
    return res.json();
  },

  createIncident: async (payload: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  acknowledgeIncident: async (incidentId: string, notes?: string): Promise<IncidentRecord> => {
    const res = await fetch(`${API_BASE}/incidents/${incidentId}/acknowledge`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution_notes: notes }),
    });
    return res.json();
  },

  // Anomalies
  getCurrentAnomaly: async (): Promise<AnomalyExplanation> => {
    const res = await fetch(`${API_BASE}/anomalies/current`);
    return res.json();
  },

  // Copilot
  queryCopilot: async (data: {
    query: string;
    machine_state?: string;
    operator_id?: string;
    task_id?: string;
    machine_id?: string;
    current_telemetry?: any;
  }) => {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Training
  getTrainingRecommendations: async (operatorId = 'OP-001'): Promise<TrainingModule[]> => {
    const res = await fetch(`${API_BASE}/training/recommendations?operator_id=${operatorId}`);
    return res.json();
  },

  completeTraining: async (trainingId: string, score = 100, operatorId = 'OP-001'): Promise<any> => {
    const res = await fetch(`${API_BASE}/training/${trainingId}/complete?operator_id=${operatorId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    });
    return res.json();
  },

  // Vision
  detectVision: async (formData?: FormData): Promise<VisionDetectionResult> => {
    const res = await fetch(`${API_BASE}/vision/detect`, {
      method: 'POST',
      body: formData || new FormData(),
    });
    return res.json();
  },

  // Demo Replay
  getDemoState: async () => {
    const res = await fetch(`${API_BASE}/demo/state`);
    return res.json();
  },

  controlDemo: async (action: string, stage?: number) => {
    const res = await fetch(`${API_BASE}/demo/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, stage }),
    });
    return res.json();
  },
};

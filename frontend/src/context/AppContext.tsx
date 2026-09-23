import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Operator,
  TelemetryData,
  SafetyAlert,
  TaskEtaPrediction,
  AnomalyExplanation,
  ShiftInfo,
  IncidentRecord
} from '../types';
import { api } from '../services/api';
import { playCriticalAlarm, playWarningBeep, playSuccessChime } from '../utils/soundAlert';

interface AppContextType {
  currentOperator: Operator | null;
  setCurrentOperator: (op: Operator) => void;
  operators: Operator[];
  currentShift: ShiftInfo | null;
  setCurrentShift: (shift: ShiftInfo | null) => void;
  telemetry: TelemetryData | null;
  safetyAlert: SafetyAlert | null;
  etaPrediction: TaskEtaPrediction | null;
  anomaly: AnomalyExplanation | null;
  demoStage: number;
  isPaused: boolean;
  refreshState: () => Promise<void>;
  acknowledgeCriticalAlert: () => Promise<void>;
  nextDemoStage: () => Promise<void>;
  resetDemo: () => Promise<void>;
  setDemoStageNumber: (stage: number) => Promise<void>;
  toggleDemoPause: () => Promise<void>;
  shiftTimerSeconds: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);
  const [currentShift, setCurrentShift] = useState<ShiftInfo | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [safetyAlert, setSafetyAlert] = useState<SafetyAlert | null>(null);
  const [etaPrediction, setEtaPrediction] = useState<TaskEtaPrediction | null>(null);
  const [anomaly, setAnomaly] = useState<AnomalyExplanation | null>(null);
  const [demoStage, setDemoStage] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [shiftTimerSeconds, setShiftTimerSeconds] = useState<number>(27140); // ~7.5 hours

  // Load initial operators
  useEffect(() => {
    api.getOperators().then((ops) => {
      setOperators(ops);
      if (ops.length > 0) {
        // Default to Priya Raman for demo
        const priya = ops.find((o) => o.operator_id === 'OP-001') || ops[0];
        setCurrentOperator(priya);
      }
    }).catch(console.error);

    api.getCurrentShift('OP-001').then((s) => {
      setCurrentShift(s);
    }).catch(console.error);
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const state = await api.getDemoState();
      if (state) {
        setTelemetry(state.telemetry);
        setSafetyAlert(state.alert);
        setEtaPrediction(state.eta);
        setAnomaly(state.anomaly);
        setDemoStage(state.current_stage || state.stage_id || 1);
        setIsPaused(state.is_paused || false);

        // Sound alarm on unacknowledged critical alert
        if (state.alert && state.alert.severity === 'CRITICAL' && !state.alert.acknowledged) {
          playCriticalAlarm();
        }
      }
    } catch (e) {
      console.warn('Error refreshing demo state:', e);
    }
  }, []);

  // Poll fallback / WebSocket setup
  useEffect(() => {
    refreshState();

    let ws: WebSocket | null = null;
    try {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${proto}//${window.location.host}/api/telemetry/stream`;
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.data) {
            setTelemetry(msg.data.telemetry);
            setSafetyAlert(msg.data.alert);
            setEtaPrediction(msg.data.eta);
            setAnomaly(msg.data.anomaly);
            setDemoStage(msg.data.current_stage || msg.data.stage_id || 1);
            setIsPaused(msg.data.is_paused || false);

            if (msg.data.alert && msg.data.alert.severity === 'CRITICAL' && !msg.data.alert.acknowledged) {
              playCriticalAlarm();
            }
          }
        } catch (err) {
          console.error('WS parse error:', err);
        }
      };
    } catch (e) {
      console.warn('WS connection failed, using polling fallback');
    }

    const interval = setInterval(refreshState, 3000);
    const timer = setInterval(() => {
      setShiftTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [refreshState]);

  const acknowledgeCriticalAlert = async () => {
    try {
      await api.acknowledgeAlert();
      if (safetyAlert && telemetry && currentOperator) {
        await api.createIncident({
          operator_id: currentOperator.operator_id,
          operator_name: currentOperator.name,
          machine_id: telemetry.machine_id,
          severity: 'CRITICAL',
          title: safetyAlert.title,
          description: `${safetyAlert.concise_reason} Operator safely stopped machine and confirmed blind spot clearance.`,
          resolution_notes: 'Acknowledged and stopped safely by operator.',
          follow_up_training_required: 'Safe Reversing & Blind Spot Awareness',
        });
      }
      playSuccessChime();
      await refreshState();
    } catch (e) {
      console.error('Error acknowledging alert:', e);
    }
  };

  const nextDemoStage = async () => {
    const res = await api.controlDemo('next');
    playWarningBeep();
    await refreshState();
  };

  const resetDemo = async () => {
    await api.controlDemo('reset');
    await refreshState();
  };

  const setDemoStageNumber = async (stage: number) => {
    await api.controlDemo('set_stage', stage);
    await refreshState();
  };

  const toggleDemoPause = async () => {
    await api.controlDemo(isPaused ? 'resume' : 'pause');
    setIsPaused(!isPaused);
  };

  return (
    <AppContext.Provider
      value={{
        currentOperator,
        setCurrentOperator,
        operators,
        currentShift,
        setCurrentShift,
        telemetry,
        safetyAlert,
        etaPrediction,
        anomaly,
        demoStage,
        isPaused,
        refreshState,
        acknowledgeCriticalAlert,
        nextDemoStage,
        resetDemo,
        setDemoStageNumber,
        toggleDemoPause,
        shiftTimerSeconds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  User,
  Activity,
  AlertTriangle,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const SafetyCenterPage: React.FC = () => {
  const { safetyAlert, telemetry, currentOperator, acknowledgeCriticalAlert } = useApp();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcknowledge = async () => {
    setLoading(true);
    await acknowledgeCriticalAlert();
    await loadIncidents();
    setLoading(false);
  };

  const riskScore = safetyAlert?.risk_score || 12.0;

  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-red-500 bg-red-500/10 border-red-500/40';
    if (score >= 30) return 'text-amber-400 bg-amber-500/10 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40';
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Safety Intelligence & Contextual Risk Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Safety Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Continuous contextual risk scoring combining deterministic safety overrides with environmental radar buffers.
          </p>
        </div>

        {/* Big Risk Score Gauge */}
        <div className={`p-4 rounded-xl border text-center font-mono ${getRiskColor(riskScore)}`}>
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Contextual Risk Score</div>
          <div className="text-4xl font-black tracking-tight">{riskScore.toFixed(1)} / 100</div>
          <div className="text-xs font-bold uppercase mt-1">
            {safetyAlert?.severity || 'INFO'} RISK BAND
          </div>
        </div>
      </div>

      {/* Active Alert Card */}
      {safetyAlert && (
        <div
          className={`rounded-2xl p-6 border transition-all ${
            safetyAlert.severity === 'CRITICAL'
              ? 'bg-red-950/30 border-red-500 shadow-alert-glow'
              : 'bg-cat-surface border-cat-border'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  safetyAlert.severity === 'CRITICAL' ? 'bg-red-500 text-white animate-bounce' : 'bg-cat-surfaceElevated text-cat-yellow'
                }`}
              >
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-black uppercase text-red-400">
                  {safetyAlert.severity} ADVISORY
                </span>
                <h3 className="text-xl font-black text-white font-mono uppercase">{safetyAlert.title}</h3>
              </div>
            </div>

            {safetyAlert.severity === 'CRITICAL' && !safetyAlert.acknowledged && (
              <button
                onClick={handleAcknowledge}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 text-white font-mono font-black text-sm px-6 py-3 rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{loading ? 'Logging...' : 'Acknowledge & Stop Machine'}</span>
              </button>
            )}

            {safetyAlert.acknowledged && (
              <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-xl font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Logged & Acknowledged Safely</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border space-y-2">
              <div className="text-slate-400 font-bold uppercase">Root Cause Explanation</div>
              <p className="text-sm font-semibold text-slate-100">{safetyAlert.concise_reason}</p>
              <div className="text-cat-yellow font-bold pt-1">Action: {safetyAlert.recommended_action}</div>
            </div>

            <div className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border space-y-2">
              <div className="text-slate-400 font-bold uppercase">Sensor & Context Evidence</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Speed: <span className="font-bold text-white">{telemetry?.machine_speed} km/h</span></div>
                <div>Direction: <span className="font-bold text-cat-yellow uppercase">{telemetry?.machine_direction}</span></div>
                <div>Pedestrians: <span className="font-bold text-red-400">{telemetry?.nearby_person_count} nearby</span></div>
                <div>Rainfall: <span className="font-bold text-blue-400">{telemetry?.rainfall_mm} mm</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Audit History */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cat-yellow" />
          <span>Shift Incident & Safety Event Timeline</span>
        </h3>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.incident_id}
              className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold border border-red-500/30">
                    {inc.severity}
                  </span>
                  <span className="text-white font-bold text-sm">{inc.title}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{inc.timestamp}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{inc.description}</p>
                <div className="text-[11px] text-cat-yellow font-sans">
                  Resolution: {inc.resolution_notes}
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md font-bold border border-emerald-500/30 inline-block">
                  {inc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

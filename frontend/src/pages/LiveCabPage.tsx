import React from 'react';
import { useApp } from '../context/AppContext';
import { MachineVitalsCard } from '../components/dashboard/MachineVitalsCard';
import { ProximityRadarCard } from '../components/dashboard/ProximityRadarCard';
import { AdaptiveEtaCard } from '../components/dashboard/AdaptiveEtaCard';
import { CopilotMiniInsight } from '../components/dashboard/CopilotMiniInsight';
import {
  Target,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Fuel,
  Activity,
  Layers,
  CheckCircle,
  Truck,
  Mountain,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveCabPage: React.FC = () => {
  const { telemetry, safetyAlert, etaPrediction, anomaly } = useApp();

  if (!telemetry) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cat-yellow font-mono text-sm animate-pulse">
          Connecting to Machine ECM Telemetry Stream...
        </div>
      </div>
    );
  }

  const isCritical = safetyAlert && safetyAlert.severity === 'CRITICAL';
  const isWarning = safetyAlert && safetyAlert.severity === 'WARNING';

  return (
    <div className="p-3 sm:p-4 space-y-3.5 max-w-7xl mx-auto">
      {/* Dynamic Safety Alert Header Strip if active */}
      {isCritical && (
        <div className="bg-red-950/80 border-2 border-red-500 rounded-xl p-3 flex items-center justify-between gap-3 text-red-200 shadow-alert-glow animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <div className="text-xs font-mono font-black text-red-300 uppercase tracking-wider">
                ACTIVE SAFETY DIRECTIVE (RISK {safetyAlert.risk_score}/100)
              </div>
              <div className="text-sm font-bold text-white">
                {safetyAlert.title}: {safetyAlert.concise_reason}
              </div>
            </div>
          </div>
          <Link
            to="/safety"
            className="bg-red-600 hover:bg-red-500 text-white font-mono font-extrabold text-xs px-4 py-2 rounded-lg shrink-0 uppercase tracking-wider shadow"
          >
            Open Safety View
          </Link>
        </div>
      )}

      {/* 3-Column Operator Cockpit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column: What am I doing now & Next Task (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3.5 flex flex-col justify-between">
          {/* Current Task Card */}
          <div className="bg-cat-surface rounded-xl p-4 border border-cat-border shadow-cockpit space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cat-yellow" />
                <span>Active Task</span>
              </span>
              <span className="text-[11px] font-mono text-cat-yellow font-bold bg-cat-yellow/10 px-2 py-0.5 rounded border border-cat-yellow/30">
                {telemetry.site_zone}
              </span>
            </div>

            <div>
              <h2 className="text-base font-black text-white font-mono tracking-tight leading-tight">
                {telemetry.task_name || 'Load aggregate into haul trucks - Zone B'}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                <span>Material: Crushed Rock</span>
                <span>•</span>
                <span>Target: 350t</span>
              </div>
            </div>

            {/* Micro Operational Context Cards */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cat-border/80 text-xs font-mono">
              <div className="bg-cat-surfaceElevated p-2.5 rounded-lg border border-cat-border">
                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Mountain className="w-3 h-3 text-cat-yellow" /> Slope Incline
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {telemetry.terrain_slope_degrees.toFixed(1)}°
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    {telemetry.terrain_slope_degrees > 8 ? '(High Grade)' : '(Nominal)'}
                  </span>
                </div>
              </div>

              <div className="bg-cat-surfaceElevated p-2.5 rounded-lg border border-cat-border">
                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-400" /> Current Payload
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {telemetry.payload_tonnes.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">t / bucket</span>
                </div>
              </div>
            </div>
          </div>

          {/* Adaptive ETA Card */}
          <AdaptiveEtaCard eta={etaPrediction} telemetry={telemetry} />
        </div>

        {/* Center Column: Is anything unsafe? (Proximity Radar & Cab Safety Visualizer) (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3.5 flex flex-col justify-between">
          <ProximityRadarCard telemetry={telemetry} />
          <CopilotMiniInsight telemetry={telemetry} alert={safetyAlert} anomaly={anomaly} />
        </div>

        {/* Right Column: Is my machine healthy? (Vitals & Thermal) (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3.5 flex flex-col justify-between">
          <MachineVitalsCard telemetry={telemetry} />

          {/* Efficiency & Anomaly Glance Card */}
          <div className="bg-cat-surface rounded-xl p-4 border border-cat-border shadow-cockpit space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cat-yellow" />
                <span>Baseline Efficiency</span>
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  anomaly?.is_anomaly
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {anomaly?.is_anomaly ? 'Variance Active' : 'Baseline Match'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">Current Burn:</span>
              <span className="font-bold text-white">{telemetry.fuel_consumption_rate} L/h</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Priya's 30d Baseline:</span>
              <span className="font-bold text-slate-300">18.5 L/h</span>
            </div>

            {anomaly?.is_anomaly && (
              <div className="bg-amber-950/30 p-2 rounded border border-amber-500/30 text-[11px] text-amber-200/90 leading-snug">
                <span className="font-bold text-amber-400">Environment Impact: </span>
                {anomaly.explanation}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Compact Telemetry Strip */}
      <div className="bg-cat-surface rounded-xl p-3 border border-cat-border shadow-cockpit grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs font-mono text-slate-300">
        <div>
          <span className="text-slate-500 text-[10px] block uppercase">Ground Speed</span>
          <span className="text-sm font-bold text-white">{telemetry.machine_speed.toFixed(1)} km/h</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block uppercase">Direction</span>
          <span className="text-sm font-bold text-cat-yellow uppercase">{telemetry.machine_direction}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block uppercase">Hydraulic Pressure</span>
          <span className="text-sm font-bold text-white">{Math.round(telemetry.hydraulic_pressure)} bar</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block uppercase">Vibration Index</span>
          <span className="text-sm font-bold text-white">{telemetry.vibration.toFixed(2)} g</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block uppercase">Idle Accumulator</span>
          <span className="text-sm font-bold text-white">{(telemetry.idle_time_seconds / 60).toFixed(0)} min</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block uppercase">Active DTC</span>
          <span className={`text-sm font-bold ${telemetry.fault_code !== 'NONE' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {telemetry.fault_code}
          </span>
        </div>
      </div>
    </div>
  );
};

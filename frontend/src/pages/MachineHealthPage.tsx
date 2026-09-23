import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Gauge,
  Activity,
  Fuel,
  Thermometer,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MachineHealthPage: React.FC = () => {
  const { telemetry, anomaly } = useApp();

  if (!telemetry) return null;

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase mb-1">
            <Gauge className="w-4 h-4" />
            <span>Diagnostics & Explainable Anomaly Attribution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Machine Health & Baselines
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Multivariate IsolationForest anomaly detection comparing active vitals against your personal 30-day operator standard.
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-right font-mono">
          <div className="text-xs text-slate-400">Overall Machine Health</div>
          <div className="text-3xl font-black text-emerald-400">{telemetry.machine_health_score}/100</div>
          <div className="text-xs text-emerald-300 font-bold uppercase">Optimal Mechanical State</div>
        </div>
      </div>

      {/* Explainable Anomaly Card (Core requirement) */}
      <div
        className={`rounded-2xl p-6 border shadow-cockpit space-y-4 ${
          anomaly?.is_anomaly
            ? 'bg-amber-950/20 border-amber-500/50'
            : 'bg-cat-surface border-cat-border'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                anomaly?.is_anomaly ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {anomaly?.is_anomaly ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-400">
                {anomaly?.is_anomaly ? 'STATISTICAL VARIANCE DETECTED' : 'SYSTEMS MATCH OPERATOR BASELINE'}
              </span>
              <h2 className="text-xl font-bold text-white font-mono">
                {anomaly?.headline || 'Fuel consumption is 18% above your normal range for similar tasks.'}
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono font-bold bg-cat-surfaceElevated px-3 py-1.5 rounded-lg border border-cat-border text-slate-200">
            Metric: {anomaly?.metric || 'Fuel Consumption Rate'}
          </span>
        </div>

        {/* Explainable Attribution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border space-y-2">
            <div className="text-slate-400 font-bold uppercase">Likely Contributors (Not Operator Fault)</div>
            <ul className="space-y-1.5 text-slate-200 font-sans text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cat-yellow" />
                <span>Heavy aggregate payload density (16.2 tonnes / cycle)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cat-yellow" />
                <span>12° terrain slope incline resistance against slew swing motors</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cat-yellow" />
                <span>9 minutes cumulative haul truck staging wait idle time</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cat-yellow" />
                <span>Above-normal engine RPM under continuous high-bank digging</span>
              </li>
            </ul>
          </div>

          <div className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border space-y-3">
            <div className="text-slate-400 font-bold uppercase">Classification & Recommendations</div>
            <div className="bg-cat-black/60 p-3 rounded-lg border border-cat-border text-xs text-slate-300 font-sans leading-relaxed">
              <span className="text-cat-yellow font-bold">Copilot Assessment: </span>
              {anomaly?.classification || 'Likely task/environment influenced — monitor if it persists.'}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                to="/training"
                className="bg-cat-surfaceLight hover:bg-cat-surface text-slate-200 px-3 py-1.5 rounded-lg border border-cat-border font-mono text-[11px] font-bold transition-colors"
              >
                See Efficiency Guidance
              </Link>
              <Link
                to="/copilot"
                className="bg-cat-yellow hover:bg-cat-yellowLight text-cat-black px-3 py-1.5 rounded-lg font-mono text-[11px] font-extrabold shadow transition-colors flex items-center gap-1"
              >
                <span>Ask Copilot Why</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fuel Rate vs Baseline */}
        <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fuel Burn Analysis</span>
            <Fuel className="w-4 h-4 text-cat-yellow" />
          </div>
          <div className="text-3xl font-black text-white">
            {telemetry.fuel_consumption_rate} <span className="text-sm font-normal text-slate-400">L/h</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-cat-border">
            <div className="flex justify-between">
              <span>Priya's 30d Baseline:</span>
              <span className="text-slate-200 font-bold">18.5 L/h</span>
            </div>
            <div className="flex justify-between text-amber-400 font-bold">
              <span>Variance:</span>
              <span>+18.2% (Slope Influenced)</span>
            </div>
          </div>
        </div>

        {/* Hydraulic Temperature */}
        <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hydraulic Circuit Temp</span>
            <Thermometer className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {telemetry.hydraulic_temperature}°C
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-cat-border">
            <div className="flex justify-between">
              <span>Thermal Relief Limit:</span>
              <span className="text-slate-200 font-bold">95.0°C</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Status:</span>
              <span>Nominal Thermal Margin</span>
            </div>
          </div>
        </div>

        {/* Engine Load & RPM */}
        <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Engine Power Demand</span>
            <Zap className="w-4 h-4 text-cat-yellow" />
          </div>
          <div className="text-3xl font-black text-white">
            {Math.round(telemetry.engine_load)}% <span className="text-sm font-normal text-slate-400">Load</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-cat-border">
            <div className="flex justify-between">
              <span>Current Engine RPM:</span>
              <span className="text-slate-200 font-bold">{Math.round(telemetry.engine_rpm)} RPM</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Operating Mode:</span>
              <span className="font-bold text-cat-yellow uppercase">{telemetry.operating_mode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

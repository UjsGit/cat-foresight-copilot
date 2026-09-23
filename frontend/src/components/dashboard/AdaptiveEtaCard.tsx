import React from 'react';
import { TaskEtaPrediction, TelemetryData } from '../../types';
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  eta: TaskEtaPrediction | null;
  telemetry: TelemetryData | null;
}

export const AdaptiveEtaCard: React.FC<Props> = ({ eta, telemetry }) => {
  if (!telemetry) return null;

  const predicted = eta?.predicted_duration_minutes || 32.0;
  const lower = eta?.lower_bound_minutes || 28.0;
  const upper = eta?.upper_bound_minutes || 37.0;
  const confidence = eta?.confidence || 'High';
  const explanation = eta?.explanation || 'Operating on standard baseline schedule.';

  const getConfColor = (c: string) => {
    switch (c) {
      case 'High':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="bg-cat-surface rounded-xl p-4 border border-cat-border shadow-cockpit space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-cat-yellow" />
          <span>Adaptive Task ETA (ML Predicted)</span>
        </h3>
        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getConfColor(confidence)}`}>
          Confidence: {confidence}
        </span>
      </div>

      <div className="bg-cat-surfaceElevated p-3.5 rounded-lg border border-cat-border flex items-baseline justify-between">
        <div>
          <div className="text-xs text-slate-400 font-mono">Estimated Completion</div>
          <div className="text-3xl font-black font-mono text-cat-yellow tracking-tight">
            {predicted.toFixed(0)} <span className="text-sm font-normal text-slate-300">min</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-mono">Expected Range</div>
          <div className="text-base font-bold font-mono text-slate-200">
            {lower.toFixed(0)} – {upper.toFixed(0)} min
          </div>
        </div>
      </div>

      {/* Progress Bar & Cycles */}
      <div>
        <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
          <span>Task Progress: {telemetry.task_progress_percent.toFixed(0)}%</span>
          <span>Cycle {telemetry.number_of_cycles} / 28 Target</span>
        </div>
        <div className="w-full bg-cat-black h-2.5 rounded-full overflow-hidden border border-cat-border">
          <div
            className="bg-gradient-to-r from-amber-500 to-cat-yellow h-full rounded-full transition-all duration-500"
            style={{ width: `${telemetry.task_progress_percent}%` }}
          />
        </div>
      </div>

      {/* Contextual ML Explanation */}
      <div className="bg-cat-black/60 p-2.5 rounded-lg border border-cat-border/60 text-xs text-slate-300 leading-relaxed font-sans">
        <span className="text-cat-yellow font-bold mr-1">ML Explanation:</span>
        {explanation}
      </div>
    </div>
  );
};

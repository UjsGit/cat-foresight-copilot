import React from 'react';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TelemetryData, SafetyAlert, AnomalyExplanation } from '../../types';

interface Props {
  telemetry: TelemetryData | null;
  alert: SafetyAlert | null;
  anomaly: AnomalyExplanation | null;
}

export const CopilotMiniInsight: React.FC<Props> = ({ telemetry, alert, anomaly }) => {
  if (!telemetry) return null;

  // Generate dynamic contextual insight
  let recommendation = "Maintain nominal cycle cadence. All equipment vitals and proximity clearances are within safe bounds.";
  let badge = "NORMAL ADVISORY";
  let badgeColor = "bg-blue-500/20 text-blue-300 border-blue-500/30";

  if (alert && alert.severity === 'CRITICAL') {
    recommendation = alert.recommended_action;
    badge = "SAFETY DIRECTIVE";
    badgeColor = "bg-red-500/20 text-red-300 border-red-500/30";
  } else if (anomaly && anomaly.is_anomaly) {
    recommendation = `${anomaly.classification} Consider auto-idle if truck queue wait exceeds 3 minutes.`;
    badge = "EFFICIENCY ADVISORY";
    badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
  } else if (telemetry.rainfall_mm > 0) {
    recommendation = `Wet conditions active (${telemetry.rainfall_mm}mm rain). Proximity alert buffers have been automatically expanded to 7.5m.`;
    badge = "WEATHER ADVISORY";
    badgeColor = "bg-blue-500/20 text-blue-300 border-blue-500/30";
  }

  return (
    <div className="bg-gradient-to-br from-cat-surface to-cat-surfaceElevated rounded-xl p-4 border border-cat-yellow/30 shadow-cockpit flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cat-yellow/20 text-cat-yellow flex items-center justify-center border border-cat-yellow/40">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-extrabold uppercase text-slate-200">
            ForeSight AI Recommendation
          </span>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
          {badge}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-100 leading-snug py-1">
        "{recommendation}"
      </p>

      <div className="pt-2 flex items-center justify-between border-t border-cat-border/60 mt-2">
        <span className="text-[11px] font-mono text-slate-400">
          State: <span className="text-cat-yellow font-bold uppercase">{telemetry.machine_state}</span> (Glance Mode)
        </span>
        <Link
          to="/copilot"
          className="text-xs font-bold text-cat-yellow hover:text-cat-yellowLight flex items-center gap-1 transition-colors"
        >
          <span>Ask Copilot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

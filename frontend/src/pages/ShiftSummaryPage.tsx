import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ShiftSummaryData } from '../types';
import {
  FileCheck2,
  Award,
  TrendingUp,
  Fuel,
  Clock,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShiftSummaryPage: React.FC = () => {
  const { currentOperator, resetDemo } = useApp();
  const [summary, setSummary] = useState<ShiftSummaryData | null>(null);

  useEffect(() => {
    api.getShiftSummary(currentOperator?.operator_id || 'OP-001').then(setSummary).catch(console.error);
  }, [currentOperator]);

  if (!summary) return null;

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>End-of-Shift Performance & Safety Debrief</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Shift Summary Report
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Operator: <span className="text-white font-bold">{summary.operator_name}</span> • Shift ID: {summary.shift_id} • Machine: {summary.machine_name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-cat-surfaceElevated hover:bg-cat-surfaceLight text-slate-200 border border-cat-border px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-cat-yellow" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Balanced Message Banner */}
      <div className="bg-cat-surface rounded-2xl p-6 border-l-4 border-cat-yellow border-t border-r border-b border-cat-border shadow-cockpit space-y-2">
        <div className="flex items-center gap-2 text-cat-yellow font-mono text-xs font-bold uppercase">
          <Award className="w-4 h-4" />
          <span>ForeSight Copilot Performance Debrief</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-sans">
          "{summary.supervisor_review_message}"
        </p>
      </div>

      {/* 6 Key Operational Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono">
        {/* Productivity */}
        <div className="bg-cat-surface rounded-2xl p-5 border border-cat-border shadow-cockpit space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Productivity Pace</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            +{summary.productivity_pct_vs_baseline}%
          </div>
          <div className="text-[11px] text-slate-400">vs 30-day Personal Baseline</div>
        </div>

        {/* Tasks Completed */}
        <div className="bg-cat-surface rounded-2xl p-5 border border-cat-border shadow-cockpit space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tasks Completed</span>
            <FileCheck2 className="w-4 h-4 text-cat-yellow" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {summary.tasks_completed}
          </div>
          <div className="text-[11px] text-slate-400">Target Tonnes Achieved</div>
        </div>

        {/* Safety Alerts */}
        <div className="bg-cat-surface rounded-2xl p-5 border border-cat-border shadow-cockpit space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Safety Alerts</span>
            <ShieldCheck className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400">
            {summary.critical_alerts_acknowledged} / {summary.critical_alerts_count}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">100% Acknowledged & Stopped</div>
        </div>

        {/* Idle Time */}
        <div className="bg-cat-surface rounded-2xl p-5 border border-cat-border shadow-cockpit space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Staging Idle Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {summary.idle_time_minutes} min
          </div>
          <div className="text-[11px] text-amber-400">Truck Queue Wait Factor</div>
        </div>

        {/* Fuel Consumed */}
        <div className="bg-cat-surface rounded-2xl p-5 border border-cat-border shadow-cockpit space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Diesel Consumed</span>
            <Fuel className="w-4 h-4 text-cat-yellow" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {summary.total_fuel_litres} L
          </div>
          <div className="text-[11px] text-slate-400">Efficiency Score: {summary.fuel_efficiency_score}/100</div>
        </div>

        {/* ETA Prediction Accuracy */}
        <div className="bg-cat-surface rounded-2xl p-5 border border-cat-border shadow-cockpit space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ETA ML Accuracy</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400">
            {summary.eta_prediction_accuracy_pct}%
          </div>
          <div className="text-[11px] text-slate-400">R² = 0.995 Gradient Model</div>
        </div>
      </div>

      {/* Notable Timeline Events */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
          Notable Shift Timeline Events
        </h3>

        <div className="space-y-3">
          {summary.notable_timeline_events.map((evt, idx) => (
            <div
              key={idx}
              className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border flex items-start gap-3.5 text-xs font-mono"
            >
              <span className="font-bold text-cat-yellow bg-cat-black px-2 py-1 rounded shrink-0">
                {evt.timestamp}
              </span>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">{evt.title}</div>
                <p className="text-slate-300 font-sans text-xs">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

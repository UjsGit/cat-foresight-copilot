import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, TrendingUp, Clock, Truck, Mountain, CloudRain, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const TaskDetailsPage: React.FC = () => {
  const { telemetry, etaPrediction } = useApp();

  const predicted = etaPrediction?.predicted_duration_minutes || 32.0;
  const lower = etaPrediction?.lower_bound_minutes || 28.0;
  const upper = etaPrediction?.upper_bound_minutes || 37.0;

  const factorsData = [
    { name: 'Baseline', impact: 35.0, type: 'base' },
    { name: 'Rainfall & Wet Surface', impact: telemetry?.rainfall_mm ? +(telemetry.rainfall_mm * 0.6).toFixed(1) : 0, type: 'increase' },
    { name: 'Slope Incline', impact: telemetry?.terrain_slope_degrees ? +(telemetry.terrain_slope_degrees * 0.45).toFixed(1) : 0, type: 'increase' },
    { name: 'Haul Road Congestion', impact: +(telemetry?.site_congestion ? telemetry.site_congestion * 4 : 1).toFixed(1), type: 'increase' },
    { name: 'Priya Experience', impact: -2.2, type: 'decrease' },
  ];

  const cycleCadenceData = [
    { cycle: 'C1', seconds: 40 },
    { cycle: 'C2', seconds: 42 },
    { cycle: 'C3', seconds: 39 },
    { cycle: 'C4', seconds: 44 },
    { cycle: 'C5', seconds: 41 },
    { cycle: 'C6', seconds: 45 },
    { cycle: 'C7', seconds: 42 },
    { cycle: 'C8 (Curr)', seconds: telemetry?.cycle_time_seconds || 41 },
  ];

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase mb-1">
            <Target className="w-4 h-4" />
            <span>Task Analytics & Adaptive ETA Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            {telemetry?.task_name || 'Load aggregate into haul trucks - Zone B'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Continuous gradient boosting model recalibrates completion duration from physics, weather, and operator baseline.
          </p>
        </div>

        <div className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border text-right font-mono">
          <div className="text-xs text-slate-400">ML Predicted ETA</div>
          <div className="text-3xl font-black text-cat-yellow">{predicted.toFixed(0)} min</div>
          <div className="text-xs text-slate-300">Interval: {lower.toFixed(0)}–{upper.toFixed(0)} min</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ETA Factor Decomposition (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              Duration Factor Attribution (Minutes)
            </h3>
            <span className="text-xs font-mono font-bold text-cat-yellow bg-cat-yellow/10 px-2 py-0.5 rounded border border-cat-yellow/30">
              Confidence: {etaPrediction?.confidence || 'High'}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171B24', borderColor: '#2F374A', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`${val} min`, 'Impact']}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {factorsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === 'base' ? '#F5B800' : entry.type === 'increase' ? '#EF4444' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-cat-black/70 p-4 rounded-xl border border-cat-border text-xs text-slate-300 leading-relaxed">
            <span className="text-cat-yellow font-bold">Model Reasoning: </span>
            {etaPrediction?.explanation || 'Nominal cycle timing under baseline dry quarry conditions.'}
          </div>
        </div>

        {/* Right Column: Cycle Pace History & Material Specs (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              Cycle Pace Cadence (Seconds)
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleCadenceData}>
                  <XAxis dataKey="cycle" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[20, 60]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171B24', borderColor: '#2F374A', borderRadius: '8px' }}
                    formatter={(val: any) => [`${val} sec`, 'Cycle Time']}
                  />
                  <Bar dataKey="seconds" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400 pt-2 border-t border-cat-border">
              <span>Avg Pace: 41.5s</span>
              <span className="text-emerald-400 font-bold">+8% vs Baseline</span>
            </div>
          </div>

          {/* Target Specs Card */}
          <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              Material & Load Targets
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-cat-surfaceElevated p-3 rounded-lg border border-cat-border">
                <span className="text-slate-400 text-[10px] block">Target Tonnes</span>
                <span className="text-lg font-bold text-white">350.0 t</span>
              </div>
              <div className="bg-cat-surfaceElevated p-3 rounded-lg border border-cat-border">
                <span className="text-slate-400 text-[10px] block">Loaded So Far</span>
                <span className="text-lg font-bold text-cat-yellow">
                  {((telemetry?.task_progress_percent || 28) * 3.5).toFixed(0)} t
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

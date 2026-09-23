import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, Clock, CloudRain, Sun, Compass, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { currentOperator, telemetry, shiftTimerSeconds } = useApp();

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStateColor = (state?: string) => {
    switch (state) {
      case 'operating':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse';
      case 'reversing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse';
      case 'idle':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'parked':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="bg-cat-surface border-b border-cat-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-cockpit sticky top-0 z-40">
      {/* Brand & Prototype Tag */}
      <div className="flex items-center gap-3">
        <Link to="/live-cab" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-cat-yellow flex items-center justify-center rounded-md font-extrabold text-cat-black tracking-tighter text-lg shadow-hud-glow">
            CAT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-slate-100 uppercase font-mono">
                ForeSight <span className="text-cat-yellow">Copilot</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                Simulated Data
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Decision Support & Risk Advisory System (No Direct Control)
            </p>
          </div>
        </Link>
      </div>

      {/* Center / Right Telemetry HUD Badges */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        {/* Machine & State Pill */}
        <div className="flex items-center gap-2 bg-cat-surfaceElevated px-2.5 py-1.5 rounded-md border border-cat-border">
          <Activity className="w-3.5 h-3.5 text-cat-yellow" />
          <span className="font-mono font-medium text-slate-200">
            {telemetry?.machine_id || 'CAT-EX-336'}
          </span>
          <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold uppercase border ${getStateColor(telemetry?.machine_state)}`}>
            {telemetry?.machine_state || 'operating'}
          </span>
        </div>

        {/* Environmental Pill */}
        <div className="flex items-center gap-2 bg-cat-surfaceElevated px-2.5 py-1.5 rounded-md border border-cat-border text-slate-300">
          {telemetry && telemetry.rainfall_mm > 0 ? (
            <div className="flex items-center gap-1.5 text-blue-400 font-mono font-semibold">
              <CloudRain className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span>Rain {telemetry.rainfall_mm}mm</span>
              <span className="text-slate-500">|</span>
              <span>Vis {telemetry.visibility_meters}m</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Clear</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">Vis {telemetry?.visibility_meters || 2000}m</span>
            </div>
          )}
        </div>

        {/* Shift Timer */}
        <div className="flex items-center gap-1.5 bg-cat-surfaceElevated px-2.5 py-1.5 rounded-md border border-cat-border font-mono font-semibold text-cat-yellow">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(shiftTimerSeconds)}</span>
        </div>

        {/* Operator Profile */}
        <Link
          to="/login"
          title="Switch Operator"
          className="flex items-center gap-2 bg-cat-surfaceLight hover:bg-cat-surfaceElevated px-2.5 py-1.5 rounded-md border border-cat-border hover:border-cat-yellow transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-cat-yellow/20 text-cat-yellow flex items-center justify-center font-bold text-xs border border-cat-yellow/40">
            {currentOperator?.name ? currentOperator.name[0] : 'P'}
          </div>
          <span className="font-semibold text-slate-200">
            {currentOperator?.name || 'Priya Raman'}
          </span>
        </Link>
      </div>
    </header>
  );
};

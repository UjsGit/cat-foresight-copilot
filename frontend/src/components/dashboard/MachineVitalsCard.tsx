import React from 'react';
import { TelemetryData } from '../../types';
import { Fuel, Thermometer, Zap, Activity, Gauge } from 'lucide-react';

interface Props {
  telemetry: TelemetryData | null;
}

export const MachineVitalsCard: React.FC<Props> = ({ telemetry }) => {
  if (!telemetry) return null;

  const getFuelColor = (level: number) => {
    if (level < 20) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (level < 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getTempColor = (temp: number) => {
    if (temp > 95) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (temp > 85) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  return (
    <div className="bg-cat-surface rounded-xl p-4 border border-cat-border shadow-cockpit space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-cat-yellow" />
          <span>Machine Vitals</span>
        </h3>
        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          Health: {telemetry.machine_health_score}/100
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Engine RPM */}
        <div className="bg-cat-surfaceElevated p-3 rounded-lg border border-cat-border/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Engine RPM</span>
            <Activity className="w-3.5 h-3.5 text-cat-yellow" />
          </div>
          <div className="text-xl font-black font-mono text-white">
            {Math.round(telemetry.engine_rpm)}
            <span className="text-xs font-normal text-slate-400 ml-1">RPM</span>
          </div>
          <div className="w-full bg-cat-black h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cat-yellow h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (telemetry.engine_rpm / 2400) * 100)}%` }}
            />
          </div>
        </div>

        {/* Engine Load */}
        <div className="bg-cat-surfaceElevated p-3 rounded-lg border border-cat-border/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Engine Load</span>
            <Zap className="w-3.5 h-3.5 text-cat-yellow" />
          </div>
          <div className="text-xl font-black font-mono text-white">
            {Math.round(telemetry.engine_load)}%
          </div>
          <div className="w-full bg-cat-black h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                telemetry.engine_load > 85 ? 'bg-red-500' : telemetry.engine_load > 65 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${telemetry.engine_load}%` }}
            />
          </div>
        </div>

        {/* Fuel Level & Burn Rate */}
        <div className={`p-3 rounded-lg border ${getFuelColor(telemetry.fuel_level)}`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Diesel Fuel</span>
            <Fuel className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black font-mono">
            {Math.round(telemetry.fuel_level)}%
          </div>
          <div className="text-[10px] font-mono text-slate-300 mt-1">
            Rate: <span className="font-bold text-white">{telemetry.fuel_consumption_rate} L/h</span>
          </div>
        </div>

        {/* Hydraulic Temp */}
        <div className={`p-3 rounded-lg border ${getTempColor(telemetry.hydraulic_temperature)}`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Hydraulic Oil</span>
            <Thermometer className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black font-mono">
            {Math.round(telemetry.hydraulic_temperature)}°C
          </div>
          <div className="text-[10px] font-mono text-slate-300 mt-1">
            Coolant: <span className="font-bold text-white">{Math.round(telemetry.coolant_temperature)}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

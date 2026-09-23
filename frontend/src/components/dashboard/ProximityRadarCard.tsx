import React from 'react';
import { TelemetryData } from '../../types';
import { ShieldAlert, User, Truck, Compass } from 'lucide-react';

interface Props {
  telemetry: TelemetryData | null;
}

export const ProximityRadarCard: React.FC<Props> = ({ telemetry }) => {
  if (!telemetry) return null;

  const proxDist = telemetry.proximity_distance_meters;
  const isReversing = telemetry.machine_direction === 'reverse';
  const personCount = telemetry.nearby_person_count;
  const vehicleCount = telemetry.nearby_vehicle_count;

  // Compute radar dot positions for demo visualization
  // If person detected, place behind machine counterweight
  const personDistNorm = proxDist ? Math.min(100, (proxDist / 20) * 100) : 75;
  const personY = isReversing ? 50 + personDistNorm * 0.4 : 50 - personDistNorm * 0.4;
  const personX = 48;

  const isHazard = proxDist && proxDist < 5.0 && isReversing;

  return (
    <div className="bg-cat-surface rounded-xl p-4 border border-cat-border shadow-cockpit flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-cat-yellow" />
          <span>360° Proximity Radar</span>
        </h3>
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
            isHazard
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : personCount > 0
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isHazard ? 'CRITICAL PROXIMITY' : personCount > 0 ? `${personCount} Person Nearby` : 'Perimeter Clear'}
        </span>
      </div>

      {/* Top-Down Radar Display */}
      <div className="relative w-full h-44 bg-cat-black rounded-lg border border-cat-border overflow-hidden flex items-center justify-center my-1">
        {/* Concentric Zone Rings */}
        <div className="absolute w-36 h-36 rounded-full border border-slate-700/50" />
        <div className="absolute w-24 h-24 rounded-full border border-amber-500/30 bg-amber-500/5" />
        <div className="absolute w-14 h-14 rounded-full border border-red-500/40 bg-red-500/10" />

        {/* Sweep line animation */}
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cat-yellow/30 to-transparent animate-pulse" />

        {/* Machine Icon in Center */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-7 h-10 bg-cat-yellow text-cat-black rounded-sm border-2 border-white/50 flex flex-col items-center justify-between py-1 shadow-hud-glow">
            <span className="text-[8px] font-black font-mono">CAB</span>
            <div className={`w-3 h-1 rounded ${isReversing ? 'bg-red-600 animate-ping' : 'bg-slate-800'}`} />
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1">
            {isReversing ? '▼ REVERSING' : '▲ FORWARD'}
          </span>
        </div>

        {/* Detected Person Marker */}
        {personCount > 0 && (
          <div
            className="absolute z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{ left: `${personX}%`, top: `${personY}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-alert-glow animate-bounce">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="bg-cat-black/90 text-red-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-red-500/50 mt-0.5 whitespace-nowrap">
              {proxDist ? `${proxDist}m` : '4.2m'}
            </span>
          </div>
        )}

        {/* Detected Vehicle Marker */}
        {vehicleCount > 0 && (
          <div
            className="absolute z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
            style={{ right: '20%', top: '35%' }}
          >
            <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-400">
              <Truck className="w-3 h-3" />
            </div>
            <span className="text-[9px] font-mono text-blue-300 mt-0.5">12m</span>
          </div>
        )}
      </div>

      {/* Legend & Seatbelt State */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt;5m Hazard
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 7m Buffer
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>Harness:</span>
          <span className={`font-bold ${telemetry.seatbelt_status === 'fastened' ? 'text-emerald-400' : 'text-red-500'}`}>
            {telemetry.seatbelt_status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

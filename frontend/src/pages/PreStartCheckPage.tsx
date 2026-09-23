import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ClipboardCheck,
  Shield,
  Camera,
  Fuel,
  AlertTriangle,
  CloudSun,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
} from 'lucide-react';

export const PreStartCheckPage: React.FC = () => {
  const { currentOperator, telemetry, setCurrentShift } = useApp();
  const navigate = useNavigate();

  const [checks, setChecks] = useState<Record<string, boolean>>({
    seatbelt: false,
    cameras: false,
    fuel: false,
    dtc: false,
    weather: false,
    task: false,
  });

  const [isStarting, setIsStarting] = useState(false);

  const checklistItems = [
    {
      id: 'seatbelt',
      label: 'Seatbelt Fastened & Latch Sensor Verified',
      desc: 'Harness clicked into locking receptacle with dashboard sensor light confirmed.',
      icon: Shield,
    },
    {
      id: 'cameras',
      label: 'Camera & 360° Proximity Sensor System Active',
      desc: 'Rear counterweight, right blind spot, and front boom radar domes cleaned and online.',
      icon: Camera,
    },
    {
      id: 'fuel',
      label: 'Diesel Fuel Above 25% Threshold',
      desc: `Tank currently reads ${telemetry?.fuel_level || 82.5}% with no water separator warning.`,
      icon: Fuel,
    },
    {
      id: 'dtc',
      label: 'No Critical Active ECM Fault Codes',
      desc: 'Diagnostic check indicates zero Level-3 red stop codes in machine memory.',
      icon: AlertTriangle,
    },
    {
      id: 'weather',
      label: 'Quarry Weather & Surface Traction Reviewed',
      desc: `Surface conditions clear. Visibility at ${telemetry?.visibility_meters || 1800}m with 0.0mm precipitation.`,
      icon: CloudSun,
    },
    {
      id: 'task',
      label: 'Assigned Task & Haul Truck Zone Confirmed',
      desc: 'Task: Load aggregate into trucks - Zone B (Target 350 Tonnes, 28 Cycles).',
      icon: Target,
    },
  ];

  const allCompleted = Object.values(checks).every((v) => v === true);

  const toggleCheck = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = () => {
    setChecks({
      seatbelt: true,
      cameras: true,
      fuel: true,
      dtc: true,
      weather: true,
      task: true,
    });
  };

  const handleBeginOperation = async () => {
    if (!allCompleted) return;
    setIsStarting(true);
    try {
      const shift = await api.startShift({
        operator_id: currentOperator?.operator_id || 'OP-001',
        machine_id: telemetry?.machine_id || 'CAT-EX-336',
        task_id: 'TASK-101',
        pre_start_checklist: checks,
      });
      setCurrentShift(shift);
      navigate('/live-cab');
    } catch (e) {
      console.error('Failed to start shift:', e);
      navigate('/live-cab');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase">
            <ClipboardCheck className="w-4 h-4" />
            <span>Shift Pre-Start Safety Inspection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Machine Safety Check
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            OSHA & Cat safety protocol: verify mandatory cab checks prior to releasing hydraulic lock lever.
          </p>
        </div>

        <div className="bg-cat-surfaceElevated px-4 py-3 rounded-xl border border-cat-border text-right">
          <div className="text-[11px] font-mono text-slate-400">Assigned Machine</div>
          <div className="text-base font-extrabold text-white font-mono">
            {telemetry?.machine_id || 'CAT-EX-336'}
          </div>
          <div className="text-xs text-cat-yellow font-medium">Cat 336 Hydraulic Excavator</div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cat-border">
          <div className="text-sm font-bold text-slate-200">
            Mandatory Verification ({Object.values(checks).filter(Boolean).length}/6 Verified)
          </div>
          <button
            onClick={selectAll}
            className="text-xs font-mono font-bold text-cat-yellow hover:text-cat-yellowLight uppercase transition-colors"
          >
            Verify All Items
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {checklistItems.map((item) => {
            const Icon = item.icon;
            const checked = checks[item.id];

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3.5 select-none ${
                  checked
                    ? 'bg-emerald-950/20 border-emerald-500/50 shadow-inner'
                    : 'bg-cat-surfaceElevated border-cat-border hover:border-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    checked ? 'bg-emerald-500 text-white' : 'border-2 border-slate-600 bg-cat-black'
                  }`}
                >
                  {checked && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${checked ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <h4 className={`text-sm font-bold ${checked ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lockout & Start Action */}
        <div className="pt-6 border-t border-cat-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            {allCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Ready to unlock hydraulic safety lever
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4" /> Complete remaining items to enable operation
              </span>
            )}
          </div>

          <button
            disabled={!allCompleted || isStarting}
            onClick={handleBeginOperation}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-mono font-extrabold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg min-h-[52px] ${
              allCompleted
                ? 'bg-cat-yellow hover:bg-cat-yellowLight text-cat-black shadow-hud-glow cursor-pointer scale-105'
                : 'bg-cat-surfaceLight text-slate-500 border border-cat-border cursor-not-allowed opacity-60'
            }`}
          >
            <span>{isStarting ? 'Engaging Cab Systems...' : 'Begin Cab Operation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

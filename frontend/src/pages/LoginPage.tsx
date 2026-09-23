import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Operator } from '../types';
import { User, ShieldCheck, Award, Clock, ArrowRight, HardHat, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { operators, currentOperator, setCurrentOperator } = useApp();
  const navigate = useNavigate();

  const handleSelect = (op: Operator) => {
    setCurrentOperator(op);
    navigate('/pre-start');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/40 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
          <HardHat className="w-4 h-4" />
          <span>Cab Console Authentication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono uppercase">
          Operator <span className="text-cat-yellow">Shift Login</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Select your operator profile to load personal baseline metrics, adaptive machine configurations, and assigned quarry tasks.
        </p>
      </div>

      {/* Operator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {operators.map((op) => {
          const isSelected = currentOperator?.operator_id === op.operator_id;
          const isPriya = op.operator_id === 'OP-001';

          return (
            <div
              key={op.operator_id}
              onClick={() => handleSelect(op)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border flex flex-col justify-between ${
                isSelected
                  ? 'bg-cat-surfaceElevated border-cat-yellow shadow-hud-glow scale-[1.02]'
                  : 'bg-cat-surface border-cat-border hover:border-slate-500 hover:bg-cat-surfaceElevated'
              }`}
            >
              {isPriya && (
                <div className="absolute -top-3 right-4 bg-cat-yellow text-cat-black font-extrabold font-mono text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow">
                  ★ Primary Demo Operator
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cat-yellow/20 text-cat-yellow border border-cat-yellow/50 flex items-center justify-center font-black text-2xl font-mono shadow-inner">
                    {op.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{op.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>ID: {op.operator_id}</span>
                      <span>•</span>
                      <span className="capitalize text-cat-yellow font-semibold">{op.experience_level}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-cat-border text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cat-yellow" /> Experience
                    </span>
                    <span className="font-bold text-white">
                      {op.experience_years < 1 ? `${(op.experience_years * 12).toFixed(0)} Months` : `${op.experience_years} Years`}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safety Score
                    </span>
                    <span className="font-bold text-emerald-400">{op.safety_score}%</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-400" /> Efficiency Rating
                    </span>
                    <span className="font-bold text-blue-400">{op.efficiency_rating}%</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Avg Cycle Time:</span>
                    <span className="font-bold text-slate-200">{op.avg_cycle_time_sec}s</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-cat-border/60">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(op);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-cat-surfaceLight hover:bg-cat-yellow hover:text-cat-black text-slate-100 font-bold text-xs tracking-wider uppercase font-mono transition-all flex items-center justify-center gap-2 border border-cat-border hover:border-cat-yellow shadow-md"
                >
                  <span>Select & Begin Shift</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

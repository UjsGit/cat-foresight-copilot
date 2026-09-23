import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, FastForward, RotateCcw, Sparkles } from 'lucide-react';

export const DemoReplayToolbar: React.FC = () => {
  const { demoStage, isPaused, nextDemoStage, resetDemo, setDemoStageNumber, toggleDemoPause } = useApp();

  const stageDescriptions = [
    { num: 1, title: 'Shift Start', desc: 'Priya starts, Pre-start check, Baseline ETA 32m' },
    { num: 2, title: 'Normal Operation', desc: 'Progress 42%, normal telemetry, steady pace' },
    { num: 3, title: 'Weather & Slope', desc: 'Rain starts, 12° slope, ETA updates to 41m' },
    { num: 4, title: 'Critical Hazard', desc: 'Reverse 7 km/h, person at 4.2m, STOP alert' },
    { num: 5, title: 'Fuel Anomaly', desc: '+18% fuel burn explained by payload & slope' },
    { num: 6, title: 'Shift Summary', desc: 'Shift ends, +8% productivity, training assigned' },
  ];

  return (
    <div className="bg-cat-surfaceElevated border-b border-cat-yellow/30 px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 font-mono font-bold text-cat-yellow uppercase text-[11px] bg-cat-black/60 px-2 py-1 rounded border border-cat-yellow/40">
          <Sparkles className="w-3.5 h-3.5 text-cat-yellow animate-spin" style={{ animationDuration: '6s' }} />
          <span>Hackathon Demo Replay</span>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {stageDescriptions.map((s) => (
            <button
              key={s.num}
              onClick={() => setDemoStageNumber(s.num)}
              title={s.desc}
              className={`px-2.5 py-1 rounded font-mono font-bold text-[11px] transition-all flex items-center gap-1 ${
                demoStage === s.num
                  ? 'bg-cat-yellow text-cat-black shadow-hud-glow scale-105'
                  : 'bg-cat-surfaceLight text-slate-400 hover:text-white hover:bg-cat-surface'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden lg:inline">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description Text */}
      <div className="text-slate-300 font-mono text-[11px] truncate max-w-md hidden md:block">
        <span className="text-cat-yellow font-bold">Stage {demoStage}:</span> {stageDescriptions[demoStage - 1]?.desc}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleDemoPause}
          className="flex items-center gap-1 bg-cat-surfaceLight hover:bg-cat-surface text-slate-200 px-2.5 py-1 rounded border border-cat-border hover:border-cat-yellow transition-colors font-semibold"
          title={isPaused ? 'Resume Replay' : 'Pause Replay'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={nextDemoStage}
          className="flex items-center gap-1 bg-cat-yellow hover:bg-cat-yellowLight text-cat-black px-3 py-1 rounded font-extrabold shadow-hud-glow transition-all"
          title="Advance to next scripted demo event"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Next Event</span>
        </button>

        <button
          onClick={resetDemo}
          className="flex items-center gap-1 bg-cat-surfaceLight hover:bg-cat-surface text-slate-300 hover:text-white px-2 py-1 rounded border border-cat-border transition-colors"
          title="Reset to Stage 1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

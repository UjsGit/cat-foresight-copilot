import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrainingModule } from '../types';
import {
  GraduationCap,
  ShieldAlert,
  Gauge,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Award,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { playSuccessChime } from '../utils/soundAlert';

export const TrainingHubPage: React.FC = () => {
  const { currentOperator } = useApp();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [activeQuizModule, setActiveQuizModule] = useState<TrainingModule | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTrainings();
  }, [currentOperator]);

  const loadTrainings = async () => {
    try {
      const data = await api.getTrainingRecommendations(currentOperator?.operator_id || 'OP-001');
      setModules(data);
      const done = new Set<string>(data.filter((m) => m.completed).map((m) => m.id));
      setCompletedIds(done);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartQuiz = (mod: TrainingModule) => {
    setActiveQuizModule(mod);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizModule || selectedOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === activeQuizModule.quiz?.correct_index;

    if (isCorrect) {
      playSuccessChime();
      await api.completeTraining(activeQuizModule.id, 100, currentOperator?.operator_id || 'OP-001');
      setCompletedIds((prev) => new Set([...prev, activeQuizModule.id]));
    }
  };

  const totalCompleted = completedIds.size;
  const progressPct = modules.length > 0 ? (totalCompleted / modules.length) * 100 : 0;

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Personalized Operator Micro-Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Training & Coaching Hub
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Event-triggered micro-modules assigned automatically from shift safety alerts and efficiency variances.
          </p>
        </div>

        {/* Progress & Badge */}
        <div className="bg-cat-surfaceElevated p-4 rounded-xl border border-cat-border font-mono text-right min-w-[200px]">
          <div className="text-xs text-slate-400">Shift Training Progress</div>
          <div className="text-2xl font-black text-cat-yellow">
            {totalCompleted} / {modules.length} Modules
          </div>
          <div className="w-full bg-cat-black h-2 rounded-full mt-2 overflow-hidden border border-cat-border">
            <div
              className="bg-cat-yellow h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const isDone = completedIds.has(mod.id);

          return (
            <div
              key={mod.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-inner'
                  : 'bg-cat-surface border-cat-border hover:border-slate-500'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-cat-yellow/20 text-cat-yellow flex items-center justify-center border border-cat-yellow/40">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-cat-surfaceElevated text-slate-300 border-cat-border'
                    }`}
                  >
                    {isDone ? 'Completed' : `${mod.duration_minutes} min`}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono">{mod.title}</h3>
                  <div className="text-xs text-cat-yellow font-medium mt-1">
                    Reason: {mod.trigger_reason}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {mod.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-cat-border/60">
                {isDone ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs font-bold py-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Module Certified (100%)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartQuiz(mod)}
                    className="w-full bg-cat-yellow hover:bg-cat-yellowLight text-cat-black font-extrabold text-xs py-3 px-4 rounded-xl font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-hud-glow transition-all"
                  >
                    <Play className="w-4 h-4 fill-cat-black" />
                    <span>Start Mini-Quiz</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Quiz Modal */}
      {activeQuizModule && activeQuizModule.quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cat-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-cat-surface border-2 border-cat-yellow text-slate-100 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-hud-glow">
            <div className="flex justify-between items-center border-b border-cat-border pb-3">
              <div className="flex items-center gap-2 text-cat-yellow font-mono text-xs font-bold uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Micro-Learning Checkpoint: {activeQuizModule.title}</span>
              </div>
              <button
                onClick={() => setActiveQuizModule(null)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                {activeQuizModule.quiz.question}
              </h3>

              <div className="space-y-2.5">
                {activeQuizModule.quiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeQuizModule.quiz?.correct_index;

                  let btnStyle = 'bg-cat-surfaceElevated border-cat-border text-slate-200 hover:border-slate-500';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-950/50 border-red-500 text-red-300';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-cat-yellow/20 border-cat-yellow text-white font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="bg-cat-black/80 p-3.5 rounded-xl border border-cat-border text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cat-yellow">Rationale:</div>
                  <p>{activeQuizModule.quiz.explanation}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-cat-border">
              {!quizSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitQuiz}
                  className="bg-cat-yellow hover:bg-cat-yellowLight disabled:opacity-50 text-cat-black font-mono font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider shadow"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuizModule(null)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-mono font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Done & Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CriticalAlertModal: React.FC = () => {
  const { safetyAlert, acknowledgeCriticalAlert } = useApp();
  const navigate = useNavigate();

  if (!safetyAlert || safetyAlert.severity !== 'CRITICAL' || safetyAlert.acknowledged) {
    return null;
  }

  const handleAcknowledge = async () => {
    await acknowledgeCriticalAlert();
  };

  const handleOpenSafetyView = async () => {
    await acknowledgeCriticalAlert();
    navigate('/safety');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cat-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-safety-criticalDark/95 border-4 border-safety-critical text-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-alert-glow relative overflow-hidden animate-bounce-short">
        {/* Flashing Warning Banner Stripe */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse" />

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-red-500/30 border-2 border-red-400 flex items-center justify-center shrink-0 animate-pulse">
            <AlertOctagon className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-black tracking-widest text-xs uppercase bg-red-500 text-white px-2.5 py-1 rounded">
                CRITICAL PROXIMITY ALERT • RISK {safetyAlert.risk_score}/100
              </span>
              <span className="font-mono text-xs text-red-200">
                {safetyAlert.timestamp}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono uppercase">
              {safetyAlert.title}
            </h2>

            <div className="bg-cat-black/70 p-4 rounded-xl border border-red-500/40 space-y-2">
              <p className="text-base sm:text-lg font-semibold text-red-100">
                {safetyAlert.concise_reason}
              </p>
              <div className="text-sm font-bold text-cat-yellow flex items-center gap-1.5 pt-1">
                <span>Directive:</span>
                <span>{safetyAlert.recommended_action}</span>
              </div>
            </div>

            {/* Glove-friendly Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                onClick={handleAcknowledge}
                className="w-full bg-white hover:bg-slate-100 text-red-700 font-extrabold text-base sm:text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6 text-red-600" />
                <span>Acknowledge and Stop</span>
              </button>

              <button
                onClick={handleOpenSafetyView}
                className="w-full bg-cat-surfaceElevated hover:bg-cat-surfaceLight text-white border-2 border-white/30 font-bold text-base py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5 text-cat-yellow" />
                <span>Open Safety View</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

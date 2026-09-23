import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  shortText?: string;
  grounding?: string;
  actions?: string[];
  contextUsed?: Record<string, any>;
  sources?: string[];
  timestamp: string;
}

export const CopilotPage: React.FC = () => {
  const { telemetry, currentOperator } = useApp();

  const suggestedQuestions = [
    'Why did you recommend slowing down?',
    'Why is my fuel consumption high?',
    'How much longer will this task take?',
    'What should I check before starting?',
    'What should I do if someone enters my operating zone?',
    'Why am I getting this warning?',
    'Is there anything unusual about my operation today?',
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'copilot',
      text: `Hello ${currentOperator?.name || 'Priya'}. ForeSight Copilot is active. All live telemetry, 360° proximity radars, and quarry safety rules are loaded. How can I assist your shift?`,
      shortText: 'Copilot ready and monitoring active cab state.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.queryCopilot({
        query: q,
        machine_state: telemetry?.machine_state || 'operating',
        operator_id: currentOperator?.operator_id || 'OP-001',
        task_id: telemetry?.task_id || 'TASK-101',
        machine_id: telemetry?.machine_id || 'CAT-EX-336',
        current_telemetry: telemetry || undefined,
      });

      const copilotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        text: res.full_explanation || res.short_answer,
        shortText: res.short_answer,
        grounding: res.grounded_reasoning,
        actions: res.recommended_actions,
        contextUsed: res.context_used,
        sources: res.source_documents,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isMoving = telemetry?.machine_state === 'operating' || telemetry?.machine_state === 'reversing';

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cat-yellow uppercase mb-1">
            <Bot className="w-4 h-4" />
            <span>Grounded In-Cab Decision Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            ForeSight AI Copilot
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Deterministic local knowledge retrieval grounded on active machine sensors, weather physics, and safety regulations.
          </p>
        </div>

        <div className="bg-cat-surfaceElevated px-4 py-2.5 rounded-xl border border-cat-border font-mono text-xs text-right">
          <div className="text-slate-400">Response Mode</div>
          <div className="font-extrabold text-cat-yellow uppercase">
            {isMoving ? 'Cab Glance Mode (Concise)' : 'Full Diagnostic Mode'}
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase">Suggested In-Cab Queries:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-cat-surface hover:bg-cat-surfaceElevated text-slate-200 hover:text-white border border-cat-border hover:border-cat-yellow px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cat-yellow shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-cat-surface rounded-2xl p-4 sm:p-6 border border-cat-border shadow-cockpit space-y-4 min-h-[420px] max-h-[560px] overflow-y-auto">
        {messages.map((m) => {
          const isCopilot = m.sender === 'copilot';

          return (
            <div
              key={m.id}
              className={`flex gap-3.5 ${isCopilot ? 'justify-start' : 'justify-end'}`}
            >
              {isCopilot && (
                <div className="w-9 h-9 rounded-xl bg-cat-yellow text-cat-black flex items-center justify-center font-bold shrink-0 shadow-hud-glow">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                  isCopilot
                    ? 'bg-cat-surfaceElevated border border-cat-border text-slate-100'
                    : 'bg-cat-yellow text-cat-black font-semibold'
                }`}
              >
                <div className="flex justify-between items-center gap-4 text-[10px] font-mono opacity-75">
                  <span className="font-bold uppercase">{isCopilot ? 'ForeSight Copilot' : currentOperator?.name || 'Operator'}</span>
                  <span>{m.timestamp}</span>
                </div>

                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                  {m.text}
                </p>

                {/* Grounding & Actions Card for Copilot answers */}
                {isCopilot && m.grounding && (
                  <div className="pt-2 border-t border-cat-border/80 space-y-2 text-xs font-mono">
                    <div className="text-[11px] text-cat-yellow font-sans">
                      <span className="font-bold">Evidence: </span>{m.grounding}
                    </div>

                    {m.actions && m.actions.length > 0 && (
                      <div className="bg-cat-black/60 p-3 rounded-lg border border-cat-border/80 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Recommended Actions:</div>
                        <ul className="space-y-1 text-slate-200">
                          {m.actions.map((act, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cat-yellow shrink-0" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-cat-yellow font-mono text-xs animate-pulse">
            <Bot className="w-5 h-5 animate-spin" />
            <span>Retrieving grounded telemetry & safety procedures...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot about warnings, fuel rate, slope, or safety protocols..."
          className="flex-1 bg-cat-surface text-slate-100 border border-cat-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cat-yellow font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-cat-yellow hover:bg-cat-yellowLight disabled:opacity-50 text-cat-black font-extrabold px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-hud-glow transition-all"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

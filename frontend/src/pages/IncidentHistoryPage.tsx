import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IncidentRecord } from '../types';
import { AlertOctagon, CheckCircle2, Clock, ShieldAlert, FileText, Search } from 'lucide-react';

export const IncidentHistoryPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getIncidents().then(setIncidents).catch(console.error);
  }, []);

  const filtered = incidents.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.operator_name.toLowerCase().includes(search.toLowerCase()) ||
      i.machine_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase mb-1">
            <AlertOctagon className="w-4 h-4" />
            <span>Safety Governance & Compliance Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
            Incident History Log
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Immutable log of operator-acknowledged near-misses, proximity interventions, and resolution audits.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title, operator, machine..."
            className="bg-cat-surfaceElevated border border-cat-border rounded-xl pl-9 pr-4 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-cat-yellow min-w-[260px]"
          />
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filtered.map((inc) => (
          <div
            key={inc.incident_id}
            className="bg-cat-surface rounded-2xl p-6 border border-cat-border shadow-cockpit space-y-3 font-mono text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cat-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="bg-red-500/20 text-red-400 font-bold px-2.5 py-1 rounded border border-red-500/30">
                  {inc.severity}
                </span>
                <span className="text-white font-bold text-base">{inc.title}</span>
              </div>
              <span className="text-slate-400">{inc.timestamp}</span>
            </div>

            <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
              {inc.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Operator</span>
                <span className="font-bold text-white">{inc.operator_name} ({inc.operator_id})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Machine</span>
                <span className="font-bold text-cat-yellow">{inc.machine_id}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Status</span>
                <span className="font-bold text-emerald-400">{inc.status}</span>
              </div>
            </div>

            <div className="bg-cat-surfaceElevated p-3 rounded-xl border border-cat-border font-sans text-xs text-slate-300">
              <span className="text-cat-yellow font-bold font-mono">Resolution Action: </span>
              {inc.resolution_notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

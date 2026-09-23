import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Target,
  ShieldAlert,
  Camera,
  Gauge,
  Bot,
  GraduationCap,
  FileCheck2,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navigation: React.FC = () => {
  const { safetyAlert, anomaly } = useApp();

  const isCritical = safetyAlert && safetyAlert.severity === 'CRITICAL' && !safetyAlert.acknowledged;
  const isAnomaly = anomaly && anomaly.is_anomaly;

  const navItems = [
    { to: '/live-cab', label: 'Live Cab', icon: LayoutDashboard },
    { to: '/pre-start', label: 'Pre-Start', icon: ClipboardCheck },
    { to: '/task', label: 'Task & ETA', icon: Target },
    {
      to: '/safety',
      label: 'Safety Center',
      icon: ShieldAlert,
      badge: isCritical ? 'CRITICAL' : null,
      badgeColor: 'bg-red-500 text-white animate-pulse',
    },
    { to: '/camera-vision', label: 'Camera Vision', icon: Camera },
    {
      to: '/machine-health',
      label: 'Machine Health',
      icon: Gauge,
      badge: isAnomaly ? 'ALERT' : null,
      badgeColor: 'bg-amber-500 text-cat-black',
    },
    { to: '/copilot', label: 'AI Copilot', icon: Bot },
    { to: '/training', label: 'Training Hub', icon: GraduationCap },
    { to: '/incidents', label: 'Incidents', icon: AlertOctagon },
    { to: '/shift-summary', label: 'Shift Summary', icon: FileCheck2 },
  ];

  return (
    <nav className="bg-cat-surface border-b border-cat-border px-2 py-1.5 overflow-x-auto scrollbar-thin flex items-center gap-1.5 shadow-inner">
      <div className="flex items-center gap-1 min-w-max mx-auto md:mx-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all select-none whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? 'bg-cat-yellow text-cat-black font-extrabold shadow-hud-glow'
                    : 'text-slate-300 hover:text-white hover:bg-cat-surfaceElevated border border-transparent hover:border-cat-border'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';

export default function StatCard({ 
  label, 
  value, 
  unit = '', 
  icon: Icon, 
  trend = null, 
  trendPositive = true,
  status = 'default', // 'default', 'success', 'warning', 'danger', 'info'
  subtext = null,
  tooltip = null 
}) {
  const statusStyles = {
    default: 'border-slate-800 bg-slate-900/60 text-slate-100',
    success: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    danger: 'border-rose-500/40 bg-rose-950/25 text-rose-300',
    info: 'border-sky-500/30 bg-sky-950/20 text-sky-300',
  };

  const iconStyles = {
    default: 'bg-slate-800 text-slate-300',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-rose-500/20 text-rose-400',
    info: 'bg-sky-500/20 text-sky-400',
  };

  return (
    <div 
      className={`rounded-xl p-4 border backdrop-blur-md transition-all hover:scale-[1.01] ${statusStyles[status]}`}
      title={tooltip || label}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight font-mono">{value}</span>
            {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconStyles[status]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
          {subtext && <span className="text-slate-400 truncate">{subtext}</span>}
          {trend && (
            <span className={`font-mono font-medium ml-auto ${trendPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

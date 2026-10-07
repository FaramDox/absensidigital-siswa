import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  percentageChange?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  percentageChange,
  trend = 'neutral',
}) => {
  const variantStyles = {
    primary: {
      bg: 'bg-white',
      border: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-[#1E3A8A]',
      indicator: 'bg-[#1E3A8A]',
    },
    success: {
      bg: 'bg-white',
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-[#059669]',
      indicator: 'bg-[#059669]',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-[#D97706]',
      indicator: 'bg-[#D97706]',
    },
    info: {
      bg: 'bg-white',
      border: 'border-sky-100 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-[#0284C7]',
      indicator: 'bg-[#0284C7]',
    },
    danger: {
      bg: 'bg-white',
      border: 'border-red-100 hover:border-red-300',
      iconBg: 'bg-red-50 text-[#DC2626]',
      indicator: 'bg-[#DC2626]',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 shadow-xs transition-all duration-200 hover:shadow-md ${style.bg} ${style.border}`}
    >
      <div className={`absolute top-0 left-0 h-1 w-full ${style.indicator}`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </span>
            {percentageChange && (
              <span
                className={`text-xs font-medium ${
                  trend === 'up'
                    ? 'text-emerald-600'
                    : trend === 'down'
                    ? 'text-rose-600'
                    : 'text-slate-500'
                }`}
              >
                {percentageChange}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className={`rounded-xl p-3 shadow-inner ${style.iconBg}`}>
          <Icon className="h-6 w-6 stroke-[2]" />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { MonthAttendanceData } from '../types';
import {
  CalendarDays,
  TrendingUp,
  Award,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface MonthlyAttendanceChartProps {
  data: MonthAttendanceData[];
  classNameTitle?: string;
}

export const MonthlyAttendanceChart: React.FC<MonthlyAttendanceChartProps> = ({
  data,
  classNameTitle = 'XI MIPA 1',
}) => {
  const [viewMode, setViewMode] = useState<'percentage' | 'breakdown'>('percentage');

  // Compute 6-month metrics
  const avgPercentage = (
    data.reduce((sum, item) => sum + item.percentage, 0) / (data.length || 1)
  ).toFixed(1);

  const highestMonth = [...data].sort((a, b) => b.percentage - a.percentage)[0];
  const lowestMonth = [...data].sort((a, b) => a.percentage - b.percentage)[0];

  // Custom tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const itemData: MonthAttendanceData = payload[0].payload;
      const isAboveTarget = itemData.percentage >= itemData.target;

      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl text-xs space-y-1.5 min-w-[210px] animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-bold text-slate-900">{itemData.month}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                isAboveTarget
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isAboveTarget ? 'Memenuhi Target' : 'Di Bawah Target'}
            </span>
          </div>

          <div className="pt-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Tingkat Kehadiran:</span>
              <span className="font-bold text-base text-[#1E3A8A]">
                {itemData.percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Target Sekolah:</span>
              <span className="font-medium text-emerald-700">{itemData.target}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Hari Efektif KBM:</span>
              <span className="font-medium text-slate-700">{itemData.effectiveDays} Hari</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-1.5 grid grid-cols-2 gap-1 text-[11px]">
            <span className="text-emerald-700">Hadir: <b>{itemData.totalHadir}</b></span>
            <span className="text-sky-700">Sakit: <b>{itemData.totalSakit}</b></span>
            <span className="text-amber-700">Izin: <b>{itemData.totalIzin}</b></span>
            <span className="text-red-700">Alfa: <b>{itemData.totalAlfa}</b></span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-[#1E3A8A]">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tren Kehadiran 6 Bulan Terakhir
              </h3>
              <p className="text-xs text-slate-500">
                Akumulasi persentase kehadiran siswa kelas {classNameTitle} (Mei - Oktober 2026)
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('percentage')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              viewMode === 'percentage'
                ? 'bg-white text-[#1E3A8A] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Persentase (%)
          </button>
          <button
            onClick={() => setViewMode('breakdown')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              viewMode === 'breakdown'
                ? 'bg-white text-[#1E3A8A] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rincian Siswa
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Rata-rata 6 Bulan
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#1E3A8A]">{avgPercentage}%</span>
            <span className="text-xs font-semibold text-emerald-700">
              {parseFloat(avgPercentage) >= 95 ? 'Target Tercapai' : 'Perlu Ditingkatkan'}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Bulan Tertinggi
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700">{highestMonth.percentage}%</span>
            <span className="text-xs text-slate-600">({highestMonth.month})</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Bulan Terendah
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-700">{lowestMonth.percentage}%</span>
            <span className="text-xs text-slate-600">({lowestMonth.month})</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart Area */}
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'percentage' ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="shortMonth"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                domain={[85, 100]}
                tick={{ fill: '#64748B', fontSize: 11 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={95}
                stroke="#059669"
                strokeDasharray="4 4"
                label={{
                  value: 'Target 95%',
                  position: 'right',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="percentage"
                name="Kehadiran (%)"
                radius={[6, 6, 0, 0]}
                barSize={38}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.percentage >= 95 ? '#1E3A8A' : '#D97706'}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            /* Breakdown View Mode: Stacked/Grouped bars for Hadir, Sakit, Izin, Alfa */
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="shortMonth"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 11 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              />
              <Bar dataKey="totalHadir" name="Hadir" fill="#059669" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="totalSakit" name="Sakit" fill="#0284C7" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="totalIzin" name="Izin" fill="#D97706" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="totalAlfa" name="Alfa" fill="#DC2626" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Explanatory Footer */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#1E3A8A]" />
            <span>&ge; 95% (Memenuhi Target)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#D97706]" />
            <span>&lt; 95% (Perlu Perhatian)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-[#059669]" />
            <span>Garis Batas Target</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Data akumulasi dihitung per hari efektif sekolah
        </div>
      </div>
    </div>
  );
};

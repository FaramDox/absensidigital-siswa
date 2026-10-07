import React, { useState } from 'react';
import { DayAttendanceTrend } from '../types';
import { TrendingUp, Users, Calendar, Info } from 'lucide-react';

interface WeeklyChartProps {
  trends: DayAttendanceTrend[];
  className?: string;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ trends, className = '' }) => {
  const [selectedDay, setSelectedDay] = useState<DayAttendanceTrend | null>(trends[2] || trends[0]); // Default to Wednesday / today

  // Find max and average
  const avgPercentage = (
    trends.reduce((sum, item) => sum + item.percentage, 0) / (trends.length || 1)
  ).toFixed(1);

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Tren Kehadiran Mingguan
            </h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
              Rata-rata: {avgPercentage}%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Performa kehadiran siswa kelas XI MIPA 1 (Senin - Jumat)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1E3A8A]" />
            <span>Kehadiran (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span>Target (95%)</span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="mt-6">
        <div className="grid grid-cols-5 gap-3 pt-4 pb-2 border-b border-slate-100">
          {trends.map((item) => {
            const isSelected = selectedDay?.dayName === item.dayName;
            const isToday = item.dayName === 'Rabu';
            const barHeight = Math.max(20, Math.min(100, item.percentage));

            return (
              <div
                key={item.dayName}
                onClick={() => setSelectedDay(item)}
                className="group flex cursor-pointer flex-col items-center"
              >
                {/* Percentage label above bar */}
                <div className="mb-2 text-center">
                  <span
                    className={`text-xs font-bold transition-all ${
                      isSelected
                        ? 'text-[#1E3A8A] scale-110 inline-block'
                        : 'text-slate-600 group-hover:text-slate-900'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Bar track and bar */}
                <div className="relative flex h-36 w-full max-w-[48px] items-end justify-center rounded-lg bg-slate-100/90 p-1">
                  {/* 95% Target Line Marker */}
                  <div
                    className="absolute left-0 w-full border-t border-dashed border-slate-300 pointer-events-none"
                    style={{ bottom: '95%' }}
                    title="Target Kehadiran 95%"
                  />

                  {/* Filled bar */}
                  <div
                    style={{ height: `${barHeight}%` }}
                    className={`w-full rounded-md transition-all duration-300 group-hover:opacity-90 ${
                      item.percentage >= 95
                        ? 'bg-gradient-to-t from-[#1E3A8A] to-blue-600'
                        : 'bg-gradient-to-t from-amber-600 to-amber-400'
                    } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  />
                </div>

                {/* Day name & date */}
                <div className="mt-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-[#1E3A8A]' : 'text-slate-700'
                      }`}
                    >
                      {item.dayName}
                    </span>
                    {isToday && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" title="Hari ini" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{item.date.split(' ')[0]} {item.date.split(' ')[1]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detailed Breakdown Widget */}
      {selectedDay && (
        <div className="mt-4 rounded-xl bg-slate-50/90 p-3.5 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#1E3A8A]" />
              <span className="text-xs font-bold text-slate-800">
                Rincian {selectedDay.dayName}, {selectedDay.date}
              </span>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1E3A8A]">
                {selectedDay.percentage}% Kehadiran
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/80 px-2 py-0.5 font-medium text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Hadir: <b>{selectedDay.hadir}</b>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-sky-100/80 px-2 py-0.5 font-medium text-sky-800">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                Sakit: <b>{selectedDay.sakit}</b>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 font-medium text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Izin: <b>{selectedDay.izin}</b>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100/80 px-2 py-0.5 font-medium text-red-800">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                Alfa: <b>{selectedDay.alfa}</b>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ClassRoom, Student, DayAttendanceTrend } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ShieldAlert,
  Send,
  Eye,
  Search,
} from 'lucide-react';

interface AdminOverviewDashboardProps {
  classes: ClassRoom[];
  students: Student[];
  onSelectClassForInspection: (classId: string) => void;
  onOpenReportModal: () => void;
  totalStudentsSchool: number;
}

export const AdminOverviewDashboard: React.FC<AdminOverviewDashboardProps> = ({
  classes,
  students,
  onSelectClassForInspection,
  onOpenReportModal,
  totalStudentsSchool,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'All' | 'X' | 'XI' | 'XII'>('All');
  const [reminderSentClassId, setReminderSentClassId] = useState<string | null>(null);

  // Mock class submission statuses across the school today
  const classStatusData: Record<
    string,
    { submitted: boolean; attendanceRate: number; hadir: number; sakit: number; izin: number; alfa: number; submittedAt?: string }
  > = {
    'xi-mipa-1': { submitted: true, attendanceRate: 90.6, hadir: 29, sakit: 1, izin: 0, alfa: 2, submittedAt: '07.35 WIB' },
    'xi-mipa-2': { submitted: true, attendanceRate: 96.9, hadir: 31, sakit: 1, izin: 0, alfa: 0, submittedAt: '07.25 WIB' },
    'xi-ips-1': { submitted: false, attendanceRate: 94.1, hadir: 32, sakit: 0, izin: 1, alfa: 1 },
    'x-mipa-1': { submitted: true, attendanceRate: 100, hadir: 32, sakit: 0, izin: 0, alfa: 0, submittedAt: '07.15 WIB' },
    'x-ips-1': { submitted: false, attendanceRate: 90.9, hadir: 30, sakit: 2, izin: 0, alfa: 1 },
    'xii-mipa-1': { submitted: true, attendanceRate: 96.9, hadir: 31, sakit: 0, izin: 1, alfa: 0, submittedAt: '07.20 WIB' },
    'xii-ips-1': { submitted: true, attendanceRate: 93.9, hadir: 31, sakit: 1, izin: 0, alfa: 1, submittedAt: '07.40 WIB' },
  };

  const totalClasses = classes.length;
  const submittedClasses = classes.filter((c) => classStatusData[c.id]?.submitted).length;
  const pendingClasses = totalClasses - submittedClasses;

  // School aggregate calculations
  const totalHadirAll = 216;
  const totalSakitAll = 5;
  const totalIzinAll = 2;
  const totalAlfaAll = 5;
  const schoolAverageRate = ((totalHadirAll / 228) * 100).toFixed(1);

  // Filter classes
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.homeroomTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || cls.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleSendReminder = (classId: string, teacherName: string) => {
    setReminderSentClassId(classId);
    setTimeout(() => {
      setReminderSentClassId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner ring-2 ring-white/20">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Admin Overview — Rekapitulasi Sekolah
                </h2>
                <span className="rounded-full bg-blue-400/20 px-2.5 py-0.5 text-xs font-semibold text-blue-200 border border-blue-400/30">
                  Kepala Sekolah & IT
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {SCHOOL_INFO.fullName} • Memantau {totalClasses} Kelas dan 228 Siswa secara Real-Time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#1E3A8A] shadow-md hover:bg-blue-50 transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Rekap Eksekutif Sekolah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* 1. Rata-rata Kehadiran Sekolah */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Rata-rata Sekolah
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E3A8A]">{schoolAverageRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">+0.8% Target</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target Dinas: &ge; 95.0%</p>
        </div>

        {/* 2. Total Siswa Hadir */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Total Siswa Hadir
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{totalHadirAll}</span>
            <span className="text-xs text-slate-500">/ 228 Siswa</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">94.7% Presensi Berlangsung</p>
        </div>

        {/* 3. Status Input Wali Kelas */}
        <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Laporan Wali Kelas
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{submittedClasses} / {totalClasses}</span>
            <span className="text-xs font-bold text-emerald-700">Tersimpan</span>
          </div>
          <p className="text-xs text-amber-700 mt-1 font-medium">
            {pendingClasses} kelas belum setor presensi
          </p>
        </div>

        {/* 4. Kasus Alfa Sekolah */}
        <div className="rounded-xl border border-red-100 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Total Alfa Hari Ini
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">{totalAlfaAll}</span>
            <span className="text-xs text-slate-500">Siswa Tanpa Kabar</span>
          </div>
          <p className="text-xs text-red-600 mt-1 font-medium">Termasuk 2 siswa kritis EWS</p>
        </div>
      </div>

      {/* Class-by-Class Monitoring Table & Grid */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table Header and Toolbar */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Matriks Kehadiran Per Kelas (Tingkat X, XI, XII)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau kecepatan input presensi masing-masing wali kelas hari ini
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kelas / guru..."
                  className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2.5 py-1 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                {(['All', 'X', 'XI', 'XII'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setGradeFilter(grade)}
                    className={`rounded-md px-2.5 py-1 transition ${
                      gradeFilter === grade
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {grade === 'All' ? 'Semua' : `Kelas ${grade}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => {
            const status = classStatusData[cls.id] || {
              submitted: false,
              attendanceRate: 90,
              hadir: 28,
              sakit: 1,
              izin: 1,
              alfa: 2,
            };
            const isReminderSent = reminderSentClassId === cls.id;

            return (
              <div
                key={cls.id}
                className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                  status.submitted
                    ? 'border-slate-200 bg-white'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{cls.name}</h4>
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-[#1E3A8A]">
                        {cls.major}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Wali: <span className="font-semibold text-slate-700">{cls.homeroomTeacher}</span>
                    </p>
                  </div>

                  <div>
                    {status.submitted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Sudah Input
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                        <Clock className="h-3 w-3 text-amber-600" />
                        Belum Input
                      </span>
                    )}
                  </div>
                </div>

                {/* Attendance rate progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Tingkat Kehadiran:</span>
                    <span className="font-bold text-slate-900">{status.attendanceRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${status.attendanceRate}%` }}
                      className={`h-full rounded-full ${
                        status.attendanceRate >= 95
                          ? 'bg-[#059669]'
                          : status.attendanceRate >= 90
                          ? 'bg-[#1E3A8A]'
                          : 'bg-[#D97706]'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick counts */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-600">
                  <span>Hadir: <b>{status.hadir}</b></span>
                  <span>Sakit: <b>{status.sakit}</b></span>
                  <span>Izin: <b>{status.izin}</b></span>
                  <span className={status.alfa > 0 ? 'text-red-600 font-bold' : ''}>
                    Alfa: <b>{status.alfa}</b>
                  </span>
                </div>

                {/* Action footer */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => onSelectClassForInspection(cls.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:text-blue-800"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Periksa Presensi Kelas</span>
                  </button>

                  {!status.submitted && (
                    <button
                      onClick={() => handleSendReminder(cls.id, cls.homeroomTeacher)}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                        isReminderSent
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      <Send className="h-3 w-3" />
                      <span>{isReminderSent ? 'Pengingat Terkirim' : 'Kirim Pengingat'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

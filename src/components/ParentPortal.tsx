import React, { useState } from 'react';
import { AttendanceRecord, Student } from '../types';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Heart,
} from 'lucide-react';

interface ParentPortalProps {
  students: Student[];
  records: AttendanceRecord[];
  onQuickReportExcuse: (student: Student) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  students,
  records,
  onQuickReportExcuse,
}) => {
  // Let parents switch child in mock mode (e.g., Ahmad Dahlan vs Budi Santoso)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-01'); // Ahmad Dahlan

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const todayRecord = records.find((r) => r.studentId === currentStudent.id) || {
    id: 'temp',
    studentId: currentStudent.id,
    studentNisn: currentStudent.nisn,
    studentName: currentStudent.name,
    gender: currentStudent.gender,
    classId: currentStudent.classId,
    date: '2026-10-07',
    time: '07.12 WIB',
    status: 'Hadir',
    note: 'Tepat waktu',
  };

  const isCritical = currentStudent.totalAlfa >= 3;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-[#1E3A8A] p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner">
              <Users className="h-7 w-7 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Portal Orang Tua & Wali Murid</h2>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                  Pemantauan Aktif
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                SMAN 1 Seputih Banyak • Layanan Notifikasi & Transparansi Kehadiran Siswa
              </p>
            </div>
          </div>

          {/* Child Switcher Dropdown (for testing different conditions) */}
          <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-xs border border-white/20">
            <label className="block text-[11px] font-semibold text-blue-200 mb-1">
              Pilih Siswa / Ananda yang Dipantau:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
            >
              <option value="std-01">Ahmad Dahlan (Status: Hadir Rajin)</option>
              <option value="std-02">Budi Santoso (Status: Kritis 3x Alfa)</option>
              <option value="std-03">Citra Dewi (Status: Sakit Terverifikasi)</option>
              <option value="std-04">Dedi Kurniawan (Status: Izin OSN)</option>
              <option value="std-05">Eko Prasetyo (Status: Alfa 3x)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Critical Alert if Child has Alfa >= 3 */}
      {isCritical && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm animate-pulse">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-600 p-2 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-950">
                Pemberitahuan Khusus: Akumulasi Alfa Ananda Memerlukan Perhatian!
              </h4>
              <p className="text-xs text-red-800 mt-1">
                Ananda {currentStudent.name} tercatat memiliki <b>{currentStudent.totalAlfa} kali ketidakhadiran tanpa keterangan</b> pada bulan ini. Mohon segera berkomunikasi dengan Wali Kelas untuk menghindari sanksi akademik atau pemanggilan ke sekolah.
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Pak%20Ahmad%20Fauzi%2C%20saya%20orang%20tua%20dari%20${encodeURIComponent(
                    currentStudent.name
                  )}%20ingin%20berkonsultasi%20mengenai%20kehadiran%20anak%20saya.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Hubungi Wali Kelas via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Status Card Today */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-white shadow-md ${
                todayRecord.status === 'Hadir'
                  ? 'bg-[#059669]'
                  : todayRecord.status === 'Sakit'
                  ? 'bg-[#0284C7]'
                  : todayRecord.status === 'Izin'
                  ? 'bg-[#D97706]'
                  : 'bg-[#DC2626]'
              }`}
            >
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {currentStudent.name}
                </h3>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-[#1E3A8A]">
                  {currentStudent.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Wali Murid: <b>{currentStudent.parentName}</b> • No. Kontak: {currentStudent.parentPhone}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Status Hari Ini:</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${
                    todayRecord.status === 'Hadir'
                      ? 'bg-[#059669]'
                      : todayRecord.status === 'Sakit'
                      ? 'bg-[#0284C7]'
                      : todayRecord.status === 'Izin'
                      ? 'bg-[#D97706]'
                      : 'bg-[#DC2626]'
                  }`}
                >
                  {todayRecord.status}
                </span>
                {todayRecord.time && todayRecord.time !== '-' && (
                  <span className="text-xs text-slate-500 font-mono">
                    ({todayRecord.time})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Homeroom Teacher Contact Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs max-w-sm">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="h-4 w-4 text-[#1E3A8A]" />
              <span>Wali Kelas XI MIPA 1</span>
            </div>
            <p className="mt-1 font-semibold text-slate-900">Ahmad Fauzi, S.Pd.</p>
            <p className="text-slate-500 text-[11px]">NIP: 19790412 200501 1 008</p>
            <div className="mt-2.5 flex items-center gap-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-3 w-3" />
                Chat WhatsApp
              </a>
              <button
                onClick={() => onQuickReportExcuse(currentStudent)}
                className="inline-flex items-center gap-1 rounded bg-[#1E3A8A] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-900"
              >
                Kirim Surat Izin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Log for Child */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#1E3A8A]" />
          <span>Rekap Kehadiran Bulan Oktober 2026</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <span className="text-slate-500 block">Total Hadir</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">
              {currentStudent.totalHadir} Hari
            </span>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
            <span className="text-slate-500 block">Sakit</span>
            <span className="text-2xl font-bold text-sky-700 mt-1 block">
              {currentStudent.totalSakit} Hari
            </span>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <span className="text-slate-500 block">Izin</span>
            <span className="text-2xl font-bold text-amber-700 mt-1 block">
              {currentStudent.totalIzin} Hari
            </span>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
            <span className="text-slate-500 block">Alfa (Tanpa Keterangan)</span>
            <span className="text-2xl font-bold text-red-700 mt-1 block">
              {currentStudent.totalAlfa} Hari
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

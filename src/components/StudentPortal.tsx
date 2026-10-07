import React, { useState } from 'react';
import { AttendanceRecord, LeaveRequest, Student } from '../types';
import { StudentQRScannerModal } from './StudentQRScannerModal';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Upload,
  FileText,
  AlertCircle,
  Award,
  Sparkles,
  QrCode,
  Camera,
  ShieldCheck,
} from 'lucide-react';

interface StudentPortalProps {
  currentStudent: Student;
  records: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onSubmitLeaveRequest: (newRequest: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>) => void;
  onViewLetter: (record: AttendanceRecord) => void;
  currentTeacherToken?: string;
  onScanQRSuccess?: (studentId: string, timeScanned: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  records,
  leaveRequests,
  onSubmitLeaveRequest,
  onViewLetter,
  currentTeacherToken = 'SMAN1-XI-MIPA-1-LIVE-TOKEN',
  onScanQRSuccess,
}) => {
  // Current student record today
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

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Leave Form state
  const [leaveType, setLeaveType] = useState<'Sakit' | 'Izin'>('Sakit');
  const [startDate, setStartDate] = useState('2026-10-08');
  const [endDate, setEndDate] = useState('2026-10-08');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Student's own leave requests
  const studentRequests = leaveRequests.filter((r) => r.studentId === currentStudent.id);

  // Calculated rate
  const totalDays = 23;
  const attendanceRate = ((currentStudent.totalHadir / totalDays) * 100).toFixed(1);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    onSubmitLeaveRequest({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentNisn: currentStudent.nisn,
      className: currentStudent.className,
      startDate,
      endDate,
      type: leaveType,
      reason,
      letterAttachmentUrl:
        fileUrl ||
        (leaveType === 'Sakit'
          ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80'),
      letterFileName: fileName || (leaveType === 'Sakit' ? 'Surat_Dokter.pdf' : 'Surat_Izin.pdf'),
    });

    setIsSuccess(true);
    setReason('');
    setFileName('');
    setFileUrl('');
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const handleScanSuccess = (studentId: string, timeScanned: string) => {
    if (onScanQRSuccess) {
      onScanQRSuccess(studentId, timeScanned);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-indigo-900 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white font-bold text-2xl backdrop-blur-xs ring-2 ring-white/30">
              {currentStudent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold sm:text-2xl">{currentStudent.name}</h2>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                  Siswa Aktif
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                NISN: {currentStudent.nisn} • Kelas: {currentStudent.className} • Wali Kelas: Pak Ahmad Fauzi, S.Pd.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-xs border border-white/20 text-right">
              <span className="text-[11px] text-blue-200 block">Tingkat Kehadiran</span>
              <span className="text-2xl font-black text-emerald-300">{attendanceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Status Banner Card with QR SCAN BUTTON */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white shadow-md ${
                todayRecord.status === 'Hadir'
                  ? 'bg-[#059669]'
                  : todayRecord.status === 'Sakit'
                  ? 'bg-[#0284C7]'
                  : todayRecord.status === 'Izin'
                  ? 'bg-[#D97706]'
                  : 'bg-[#DC2626]'
              }`}
            >
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status Presensi Hari Ini (Rabu, 7 Oktober 2026)
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1E3A8A] border border-blue-200">
                  <ShieldCheck className="h-3 w-3" /> Anti-Duplikasi
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-0.5">
                <span className="text-xl font-black text-slate-900">
                  {todayRecord.status.toUpperCase()}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 font-bold font-mono">
                  {todayRecord.time || '07.12 WIB'}
                </span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  • Tercatat via QR Code Guru
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Catatan: {todayRecord.note || 'Tepat waktu di kelas'}
              </p>
            </div>
          </div>

          {/* Action buttons on today card */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {/* Primary Scanner Button */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-emerald-800 transition"
            >
              <Camera className="h-4 w-4" />
              <span>Pindai QR Barcode Guru</span>
            </button>

            {todayRecord.letterAttachment && (
              <button
                onClick={() => onViewLetter(todayRecord as AttendanceRecord)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-100"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Lihat Bukti Surat</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Leave Request Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Pengajuan Izin / Sakit */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#1E3A8A]">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Formulir Pengajuan Surat Izin / Sakit
              </h3>
              <p className="text-[11px] text-slate-500">
                Kirim permohonan dispensasi langsung ke Wali Kelas
              </p>
            </div>
          </div>

          {isSuccess && (
            <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#059669]" />
              <span>Surat berhasil diajukan! Menunggu konfirmasi Wali Kelas.</span>
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs">
            {/* Kategori Izin */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Kategori Permohonan:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLeaveType('Sakit')}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 font-bold transition ${
                    leaveType === 'Sakit'
                      ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                  <span>Sakit (Perlu Surat Dokter)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveType('Izin')}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 font-bold transition ${
                    leaveType === 'Izin'
                      ? 'border-[#D97706] bg-amber-50 text-[#D97706] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                  <span>Izin (Surat Orang Tua)</span>
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mulai Tanggal:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sampai Tanggal:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Alasan / Keterangan */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alasan / Penjelasan Rinci:
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tuliskan keterangan lengkap (misal: demam tinggi istirahat atas petunjuk dokter, menghadiri acara keluarga luar kota, dll)..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                required
              />
            </div>

            {/* Upload File / Lampiran */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Upload Foto Surat Keterangan / Bukti (PDF / JPG):
              </label>
              <div className="rounded-lg border border-dashed border-slate-300 p-3 text-center bg-slate-50">
                <Upload className="mx-auto h-5 w-5 text-slate-400 mb-1" />
                <p className="text-slate-600 font-medium">
                  {fileName ? (
                    <span className="text-emerald-700 font-bold">Terlampir: {fileName}</span>
                  ) : (
                    'Klik simulasi lampiran surat otomatis di bawah'
                  )}
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFileName(
                        leaveType === 'Sakit'
                          ? 'Surat_Dokter_Puskesmas.pdf'
                          : 'Surat_Izin_Orang_Tua.jpg'
                      );
                      setFileUrl(
                        leaveType === 'Sakit'
                          ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80'
                      );
                    }}
                    className="rounded bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] hover:bg-blue-200"
                  >
                    + Pasang Contoh Dokumen Surat
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1E3A8A] py-2.5 font-bold text-white shadow-xs hover:bg-blue-900 transition flex items-center justify-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>Kirim Pengajuan Izin</span>
            </button>
          </form>
        </div>

        {/* Riwayat Pengajuan Izin Siswa */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#059669]">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Riwayat Pengajuan Surat Anda
              </h3>
              <p className="text-[11px] text-slate-500">
                Status persetujuan oleh pihak sekolah
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {studentRequests.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-6 text-center text-xs text-slate-400">
                Belum ada permohonan izin atau sakit yang diajukan.
              </div>
            ) : (
              studentRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          req.type === 'Sakit'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.type}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {req.startDate} s/d {req.endDate}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status === 'approved'
                        ? 'Disetujui'
                        : req.status === 'pending'
                        ? 'Menunggu'
                        : 'Ditolak'}
                    </span>
                  </div>

                  <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                    "{req.reason}"
                  </p>

                  {req.reviewerNote && (
                    <p className="text-[11px] text-[#1E3A8A] font-medium">
                      Tanggapan Wali Kelas: {req.reviewerNote}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* STUDENT QR SCANNER MODAL */}
      <StudentQRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        student={currentStudent}
        currentTeacherToken={currentTeacherToken}
        onScanSuccess={handleScanSuccess}
        isAlreadyAttended={todayRecord.status === 'Hadir'}
        attendedTime={todayRecord.time}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, ClassRoom } from '../types';
import {
  X,
  CheckCheck,
  RotateCcw,
  Upload,
  FileText,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassRoom;
  allClasses: ClassRoom[];
  initialRecords: AttendanceRecord[];
  onSave: (updatedRecords: AttendanceRecord[], generalNote: string) => void;
}

export const QuickAttendanceModal: React.FC<QuickAttendanceModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  allClasses,
  initialRecords,
  onSave,
}) => {
  if (!isOpen) return null;

  // Local draft state for records
  const [records, setRecords] = useState<AttendanceRecord[]>(() =>
    initialRecords.map((r) => ({ ...r }))
  );
  const [selectedSubject, setSelectedSubject] = useState('Matematika Wajib');
  const [selectedPeriod, setSelectedPeriod] = useState('Jam Ke-1 s/d 2 (07.15 - 08.45)');
  const [generalClassNote, setGeneralClassNote] = useState(
    'KBM berjalan lancar. Materi fungsi kuadrat bab 3.'
  );
  const [activeUploadStudentId, setActiveUploadStudentId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Status counters
  const totalStudents = records.length;
  const hadirCount = records.filter((r) => r.status === 'Hadir').length;
  const sakitCount = records.filter((r) => r.status === 'Sakit').length;
  const izinCount = records.filter((r) => r.status === 'Izin').length;
  const alfaCount = records.filter((r) => r.status === 'Alfa').length;

  // Action: Mark all present
  const handleMarkAllHadir = () => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'Hadir',
        time: r.time && r.time !== '-' ? r.time : '07.10 WIB',
        note: r.note === 'Tidak ada kabar (Alfa ke-3 berturut-turut)' || r.note === 'Tanpa keterangan (Perlu panggilan BK)' ? 'Tepat waktu' : r.note,
      }))
    );
  };

  // Action: Reset
  const handleResetToInitial = () => {
    setRecords(initialRecords.map((r) => ({ ...r })));
  };

  // Action: Toggle individual student status
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          return {
            ...r,
            status: newStatus,
            time: newStatus === 'Hadir' ? (r.time === '-' ? '07.15 WIB' : r.time) : (newStatus === 'Alfa' ? '-' : r.time),
          };
        }
        return r;
      })
    );
  };

  // Action: Update note
  const handleNoteChange = (studentId: string, note: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, note } : r))
    );
  };

  // Action: Simulate attaching a letter
  const handleAttachMockLetter = (studentId: string, type: 'surat_dokter' | 'surat_ortu') => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          return {
            ...r,
            letterAttachment: {
              type,
              fileName: type === 'surat_dokter' ? 'Surat_Keterangan_Dokter.pdf' : 'Surat_Izin_Orang_Tua.jpg',
              fileUrl:
                type === 'surat_dokter'
                  ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
              uploadedAt: '07.30 WIB',
              status: 'approved',
            },
            note: r.note || (type === 'surat_dokter' ? 'Surat dokter terlampir' : 'Surat izin orang tua terlampir'),
          };
        }
        return r;
      })
    );
    setActiveUploadStudentId(null);
  };

  const handleSave = () => {
    onSave(records, generalClassNote);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const statusOptions: AttendanceStatus[] = ['Hadir', 'Sakit', 'Izin', 'Alfa'];

  const getStatusButtonClass = (isSelected: boolean, status: AttendanceStatus) => {
    if (!isSelected) {
      return 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
    }
    switch (status) {
      case 'Hadir':
        return 'bg-[#059669] text-white border-[#059669] shadow-xs';
      case 'Sakit':
        return 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs';
      case 'Izin':
        return 'bg-[#D97706] text-white border-[#D97706] shadow-xs';
      case 'Alfa':
        return 'bg-[#DC2626] text-white border-[#DC2626] shadow-xs';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#1E3A8A] px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">
              <CheckCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold sm:text-lg">
                Input Presensi Harian Siswa
              </h2>
              <p className="text-xs text-blue-100">
                Kelas: <span className="font-semibold text-white">{currentClass.name}</span> • Wali Kelas: {currentClass.homeroomTeacher}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Controls & Fast Actions Toolbar */}
        <div className="border-b border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Subject and Period Selectors */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Mata Pelajaran:
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Presensi Wali Kelas (Harian)">Presensi Wali Kelas (Harian)</option>
                  <option value="Matematika Wajib">Matematika Wajib</option>
                  <option value="Fisika">Fisika</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Biologi">Biologi</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Sesi Pelajaran:
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Pagi (07.00 - 07.15 WIB)">Pagi Masuk (07.00 - 07.15 WIB)</option>
                  <option value="Jam Ke-1 s/d 2 (07.15 - 08.45)">Jam Ke-1 s/d 2 (07.15 - 08.45)</option>
                  <option value="Jam Ke-3 s/d 4 (09.00 - 10.30)">Jam Ke-3 s/d 4 (09.00 - 10.30)</option>
                  <option value="Jam Ke-5 s/d 6 (11.00 - 12.30)">Jam Ke-5 s/d 6 (11.00 - 12.30)</option>
                  <option value="Jam Ke-7 s/d 8 (13.15 - 14.45)">Jam Ke-7 s/d 8 (13.15 - 14.45)</option>
                </select>
              </div>
            </div>

            {/* Quick Actions (Tandai Semua Hadir & Reset) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllHadir}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#059669] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Tandai Semua Hadir</span>
              </button>

              <button
                type="button"
                onClick={handleResetToInitial}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                title="Kembalikan ke status semula"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-2.5 text-xs">
            <span className="font-semibold text-slate-600">Total: {totalStudents} Siswa</span>
            <span className="text-slate-300">•</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
              Hadir: {hadirCount}
            </span>
            <span className="rounded bg-sky-100 px-2 py-0.5 font-bold text-sky-800">
              Sakit: {sakitCount}
            </span>
            <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
              Izin: {izinCount}
            </span>
            <span className="rounded bg-red-100 px-2 py-0.5 font-bold text-red-800">
              Alfa: {alfaCount}
            </span>
          </div>
        </div>

        {/* Scrollable Student Attendance List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs text-slate-500 font-medium">
            💡 <b>Tips Cepat:</b> Gunakan tombol 'Tandai Semua Hadir' di atas, lalu ubah hanya siswa yang berhalangan (Sakit, Izin, atau Alfa).
          </p>

          <div className="space-y-2.5">
            {records.map((studentRec, idx) => {
              const isUploadOpen = activeUploadStudentId === studentRec.studentId;

              return (
                <div
                  key={studentRec.id}
                  className={`rounded-xl border p-3 transition-all ${
                    studentRec.status === 'Hadir'
                      ? 'border-emerald-100 bg-emerald-50/20'
                      : studentRec.status === 'Sakit'
                      ? 'border-sky-200 bg-sky-50/30'
                      : studentRec.status === 'Izin'
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-red-200 bg-red-50/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {studentRec.studentName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {studentRec.studentNisn}
                          </span>
                          <span className={`text-[10px] px-1 rounded font-bold ${studentRec.gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                            {studentRec.gender}
                          </span>
                        </div>
                        {studentRec.time && studentRec.time !== '-' && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>Waktu Presensi: {studentRec.time}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Radio Status Options Buttons */}
                    <div className="flex items-center gap-1.5 self-start md:self-center">
                      {statusOptions.map((status) => {
                        const isSelected = studentRec.status === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleStatusChange(studentRec.studentId, status)}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${getStatusButtonClass(
                              isSelected,
                              status
                            )}`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attachment & Note Row (for Sakit / Izin / Alfa) */}
                  <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-slate-200/50 pt-2">
                    {/* Note Input */}
                    <div>
                      <input
                        type="text"
                        value={studentRec.note || ''}
                        onChange={(e) => handleNoteChange(studentRec.studentId, e.target.value)}
                        placeholder="Catatan guru (misal: sakit demam, izin lomba OSN, tanpa kabar)..."
                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Document Upload / Attachment preview */}
                    <div className="flex items-center justify-between gap-2">
                      {studentRec.letterAttachment ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 w-full truncate">
                          <FileText className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span className="truncate font-medium">{studentRec.letterAttachment.fileName}</span>
                          <span className="text-[10px] bg-emerald-200 px-1 rounded text-emerald-900 shrink-0">Terlampir</span>
                        </div>
                      ) : (
                        <div className="w-full">
                          <button
                            type="button"
                            onClick={() => setActiveUploadStudentId(isUploadOpen ? null : studentRec.studentId)}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Upload className="h-3 w-3 text-slate-400" />
                            <span>Unggah Bukti Surat (Sakit / Izin)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Pop-out Upload Quick Simulator */}
                    {isUploadOpen && (
                      <div className="col-span-full rounded-lg bg-blue-50/70 p-3 border border-blue-200 text-xs">
                        <p className="font-semibold text-[#1E3A8A] mb-1.5">
                          Simulasi Unggah Bukti Surat untuk {studentRec.studentName}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleAttachMockLetter(studentRec.studentId, 'surat_dokter')}
                            className="inline-flex items-center gap-1 rounded bg-[#0284C7] px-2.5 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                          >
                            <FileText className="h-3 w-3" />
                            Lampirkan Surat Dokter (Puskesmas)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttachMockLetter(studentRec.studentId, 'surat_ortu')}
                            className="inline-flex items-center gap-1 rounded bg-[#D97706] px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                          >
                            <FileText className="h-3 w-3" />
                            Lampirkan Surat Izin Orang Tua
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveUploadStudentId(null)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* General Teacher Note for the Whole Class */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 mt-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Umum Guru / Ringkasan Pembelajaran:
            </label>
            <textarea
              rows={2}
              value={generalClassNote}
              onChange={(e) => setGeneralClassNote(e.target.value)}
              placeholder="Tuliskan catatan kelas hari ini jika ada..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3.5">
          <div className="text-xs text-slate-500">
            {saveSuccess ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Berhasil disimpan!
              </span>
            ) : (
              <span>Data akan langsung memperbarui grafik & tabel harian</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-900 transition"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

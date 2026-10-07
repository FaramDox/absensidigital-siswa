import React, { useState } from 'react';
import { Student } from '../types';
import {
  AlertTriangle,
  PhoneCall,
  UserX,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  X,
} from 'lucide-react';

interface EarlyWarningWidgetProps {
  students: Student[];
  onActionComplete?: (studentName: string, actionType: string) => void;
}

export const EarlyWarningWidget: React.FC<EarlyWarningWidgetProps> = ({
  students,
  onActionComplete,
}) => {
  // Filter students with Alfa > 2 (e.g. >= 3)
  const warningStudents = students.filter(
    (s) => (s.totalAlfa && s.totalAlfa >= 3) || (s.consecutiveAlfa && s.consecutiveAlfa >= 2)
  );

  const [activeModalStudent, setActiveModalStudent] = useState<Student | null>(null);
  const [modalActionType, setModalActionType] = useState<'whatsapp' | 'bk' | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleOpenAction = (student: Student, action: 'whatsapp' | 'bk') => {
    setActiveModalStudent(student);
    setModalActionType(action);
  };

  const handleConfirmAction = () => {
    if (!activeModalStudent || !modalActionType) return;

    const actionText =
      modalActionType === 'whatsapp'
        ? `Pesan WhatsApp peringatan resmi telah diteruskan ke orang tua (${activeModalStudent.parentName}).`
        : `Surat rujukan konseling siswa diteruskan ke Guru BK (Ibu Dra. Hartati).`;

    setActionSuccessMessage(actionText);
    if (onActionComplete) {
      onActionComplete(activeModalStudent.name, modalActionType);
    }

    setTimeout(() => {
      setActiveModalStudent(null);
      setModalActionType(null);
    }, 1200);

    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="rounded-xl border border-red-200 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-[#DC2626]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Early Warning System
              </h2>
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                Perlu Perhatian
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Siswa dengan akumulasi Alfa &gt; 2 kali bulan ini
            </p>
          </div>
        </div>

        <span className="flex h-6 items-center justify-center rounded-full bg-red-100 px-2.5 text-xs font-bold text-red-800">
          {warningStudents.length} Siswa
        </span>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800 border border-emerald-200 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* List of Warning Students */}
      <div className="mt-4 space-y-3">
        {warningStudents.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-6 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Tidak ada siswa kritis</p>
            <p className="mt-1">Semua siswa memiliki kehadiran baik (&le; 2 Alfa).</p>
          </div>
        ) : (
          warningStudents.map((student) => (
            <div
              key={student.id}
              className="rounded-lg border border-red-100 bg-red-50/40 p-3 transition hover:border-red-200 hover:bg-red-50/70"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Student Info */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-200 text-red-800 font-bold text-xs">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {student.name}
                      </h4>
                      <span className="rounded bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                        {student.totalAlfa}x Alfa
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      NISN: {student.nisn} • Wali: {student.parentName} ({student.parentPhone})
                    </p>
                    <p className="text-[11px] font-medium text-red-700 mt-1">
                      ⚠️ Status: {student.consecutiveAlfa ? `${student.consecutiveAlfa} hari berturut-turut tanpa kabar` : 'Akumulasi alfa melewati ambang batas'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenAction(student, 'whatsapp')}
                    title="Kirim Peringatan ke WhatsApp Orang Tua"
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-700 shadow-2xs"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Hubungi Ortu</span>
                  </button>

                  <button
                    onClick={() => handleOpenAction(student, 'bk')}
                    title="Rujuk ke Guru Bimbingan Konseling (BK)"
                    className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#DC2626] transition hover:bg-red-50"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    <span>Panggil BK</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Dialog Modal */}
      {activeModalStudent && modalActionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                {modalActionType === 'whatsapp' ? (
                  <>
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>Peringatan WhatsApp Orang Tua</span>
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 text-red-600" />
                    <span>Rujukan Bimbingan Konseling (BK)</span>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setActiveModalStudent(null);
                  setModalActionType(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <p className="font-semibold text-slate-800">Data Siswa Terkait:</p>
                <p className="mt-1">Nama: <span className="font-bold text-slate-900">{activeModalStudent.name}</span></p>
                <p>Kelas: <span className="font-medium text-slate-700">{activeModalStudent.className}</span></p>
                <p>Wali Murid: <span className="font-medium text-slate-700">{activeModalStudent.parentName} ({activeModalStudent.parentPhone})</span></p>
                <p className="text-red-700 font-bold mt-1">Total Kehadiran Tanpa Keterangan: {activeModalStudent.totalAlfa} Kali</p>
              </div>

              {modalActionType === 'whatsapp' ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-slate-700 font-mono text-[11px] leading-relaxed">
                  <p className="font-bold text-emerald-900">Format Pesan Otomatis Sekolah:</p>
                  <p className="mt-1.5 italic">
                    "Yth. Bapak/Ibu {activeModalStudent.parentName}, kami dari SMAN 1 Seputih Banyak menginformasikan bahwa ananda {activeModalStudent.name} telah tercatat tidak hadir tanpa keterangan (Alfa) sebanyak {activeModalStudent.totalAlfa} kali. Mohon konfirmasi atau kehadiran Bapak/Ibu ke sekolah menemui Wali Kelas. Terima kasih."
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 text-slate-700 text-[11px] leading-relaxed">
                  <p className="font-bold text-red-900">Surat Pengantar Pemanggilan BK:</p>
                  <p className="mt-1">
                    Sistem akan membuat tiket konsultasi resmi untuk guru BK agar segera mengagendakan sesi bimbingan khusus dan pemanggilan wali murid sesuai SOP Kesiswaan SMAN 1 Seputih Banyak.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setActiveModalStudent(null);
                  setModalActionType(null);
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAction}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-xs ${
                  modalActionType === 'whatsapp'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {modalActionType === 'whatsapp' ? 'Kirim Pesan WhatsApp' : 'Teruskan ke Guru BK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

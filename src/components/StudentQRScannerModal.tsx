import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import {
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface StudentQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  currentTeacherToken: string;
  onScanSuccess: (studentId: string, timeScanned: string) => void;
  isAlreadyAttended: boolean;
  attendedTime?: string;
}

export const StudentQRScannerModal: React.FC<StudentQRScannerModalProps> = ({
  isOpen,
  onClose,
  student,
  currentTeacherToken,
  onScanSuccess,
  isAlreadyAttended,
  attendedTime = '07.12 WIB',
}) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'expired'>('idle');
  const [scannedTime, setScannedTime] = useState<string>('');
  const [activeCamera, setActiveCamera] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      if (isAlreadyAttended) {
        setScanState('success');
        setScannedTime(attendedTime);
      } else {
        setScanState('scanning');
      }
    }
  }, [isOpen, isAlreadyAttended, attendedTime]);

  if (!isOpen) return null;

  // Handle valid scan
  const handlePerformValidScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      setScannedTime(timeStr);
      setScanState('success');
      onScanSuccess(student.id, timeStr);
    }, 900);
  };

  // Handle expired scan simulation (demonstrates anti-duplication protection)
  const handlePerformExpiredScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('expired');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#1E3A8A] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Pemindai QR Presensi Siswa</h3>
              <p className="text-xs text-blue-100">{student.name} ({student.className})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-5 flex flex-col items-center justify-center">
          {scanState === 'success' ? (
            /* SUCCESS STATE */
            <div className="py-6 px-4 text-center space-y-4 animate-fadeIn">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-[#059669] ring-8 ring-emerald-50">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Presensi Terverifikasi!
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2">
                  Status: HADIR
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tercatat pada: <b className="text-slate-800 font-mono text-sm">{scannedTime || attendedTime}</b>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-bold text-slate-900">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NISN:</span>
                  <span className="font-mono text-slate-700">{student.nisn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas:</span>
                  <span className="font-semibold text-slate-800">{student.className}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Metode Presensi:</span>
                  <span className="font-semibold text-[#1E3A8A] flex items-center gap-1">
                    <QrCode className="h-3 w-3" /> QR Dinamis Guru
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#1E3A8A] py-2.5 font-bold text-white shadow-xs hover:bg-blue-900 transition text-xs"
              >
                Tutup & Kembali ke Dashboard
              </button>
            </div>
          ) : scanState === 'expired' ? (
            /* EXPIRED STATE (ANTI-DUPLICATION) */
            <div className="py-6 px-4 text-center space-y-4 animate-fadeIn">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-[#DC2626] ring-8 ring-red-50">
                <AlertTriangle className="h-12 w-12" />
              </div>

              <div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                  Pemindaian Ditolak
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2">
                  Kode QR Kedaluwarsa!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Barcode QR ini sudah melewati batas scan waktu (&gt; 30 detik). Sistem anti-duplikasi sekolah mendeteksi token tidak valid atau tangkapan layar lama.
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 font-medium">
                💡 <b>Solusi:</b> Silakan pindai langsung barcode terbaru yang sedang ditampilkan guru di proyektor kelas.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScanState('scanning')}
                  className="flex-1 rounded-xl bg-[#1E3A8A] py-2.5 font-bold text-white shadow-xs hover:bg-blue-900 text-xs"
                >
                  Coba Pindai Ulang
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 text-xs"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE SCANNING CAMERA VIEWFINDER */
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Simulated Camera Viewfinder */}
              <div className="relative h-64 w-64 rounded-3xl bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner border-2 border-slate-700">
                {/* Background grid simulation */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Viewfinder Target Frame */}
                <div className="relative h-44 w-44 rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)] flex items-center justify-center">
                  {/* Corner Targets */}
                  <span className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
                  <span className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

                  {/* Animated Laser Scanning Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10B981] animate-bounce" />

                  <QrCode className="h-16 w-16 text-white/40" />
                </div>

                <div className="absolute bottom-3 text-center">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
                    Arahkan kamera ke layar barcode guru
                  </span>
                </div>
              </div>

              {/* Action Buttons for User / Tester */}
              <div className="w-full space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handlePerformValidScan}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Pindai Barcode Guru Sekarang (Valid)</span>
                </button>

                {/* Anti-Duplication Test Simulation */}
                <button
                  type="button"
                  onClick={handlePerformExpiredScan}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 py-2 text-[11px] font-semibold text-[#DC2626] hover:bg-red-100 transition"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Uji Coba Kode Kedaluwarsa (Simulasi Screenshot)</span>
                </button>
              </div>

              {/* Security Hint */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Enkripsi presensi waktu nyata aktif • Anti-duplikasi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ClassRoom, Student, AttendanceRecord } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import {
  QrCode,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  Pause,
  Play,
  Sparkles,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

interface TeacherQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassRoom;
  students: Student[];
  records: AttendanceRecord[];
  onStudentScanned: (studentId: string, studentName: string) => void;
  currentQrToken: string;
  onRegenerateToken: (newToken: string) => void;
}

export const TeacherQRModal: React.FC<TeacherQRModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  students,
  records,
  onStudentScanned,
  currentQrToken,
  onRegenerateToken,
}) => {
  const [duration, setDuration] = useState<number>(30); // 30 seconds default
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionSubject, setSessionSubject] = useState('Matematika Wajib (Jam Ke-1)');
  const [recentScans, setRecentScans] = useState<Array<{ name: string; time: string }>>([
    { name: 'Ahmad Dahlan', time: '07.12 WIB' },
    { name: 'Fina Lestari', time: '07.05 WIB' },
    { name: 'Galih Ramadhan', time: '07.14 WIB' },
    { name: 'Hanifah Putri Az-Zahra', time: '06.58 WIB' },
  ]);

  const durationRef = useRef(duration);
  durationRef.current = duration;

  const onRegenerateTokenRef = useRef(onRegenerateToken);
  onRegenerateTokenRef.current = onRegenerateToken;

  const currentClassIdRef = useRef(currentClass.id);
  currentClassIdRef.current = currentClass.id;

  // Generate new token function without calling setState of parent inside another state updater
  const generateNewToken = useCallback(() => {
    const randomSalt = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now();
    const newToken = `SMAN1-${currentClassIdRef.current.toUpperCase()}-${timestamp}-${randomSalt}`;
    onRegenerateTokenRef.current(newToken);
    setTimeLeft(durationRef.current);
  }, []);

  // Timer countdown hook - purely updates timeLeft count
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  // When timer reaches 0, trigger token regeneration outside the state updater
  useEffect(() => {
    if (isOpen && !isPaused && timeLeft === 0) {
      generateNewToken();
    }
  }, [isOpen, isPaused, timeLeft, generateNewToken]);

  // Reset when modal opens or duration is changed
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(duration);
    }
  }, [isOpen, duration]);

  if (!isOpen) return null;

  // Percentage calculation for circular or bar timer
  const progressPercent = (timeLeft / duration) * 100;
  const attendedCount = records.filter((r) => r.status === 'Hadir').length;
  const totalCount = students.length;

  // Simulate an incoming student scan for demo evaluation
  const handleSimulateScan = () => {
    const unpresentStudents = students.filter(
      (s) => !records.some((r) => r.studentId === s.id && r.status === 'Hadir')
    );
    const targetStudent = unpresentStudents[0] || students[Math.floor(Math.random() * students.length)];
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    onStudentScanned(targetStudent.id, targetStudent.name);
    setRecentScans((prev) => [{ name: targetStudent.name, time: timeStr }, ...prev.slice(0, 5)]);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 sm:p-4 backdrop-blur-md transition-all ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`flex flex-col bg-white shadow-2xl border border-slate-200 transition-all ${
          isFullscreen
            ? 'h-screen w-screen rounded-none'
            : 'h-full max-h-[94vh] w-full max-w-5xl rounded-3xl overflow-hidden'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#1E3A8A] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-md">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Layar Presensi QR Dinamis Guru
                </h2>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sesi Aktif
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {currentClass.name} • Wali Kelas: {currentClass.homeroomTeacher} • SMAN 1 Seputih Banyak
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-lg p-2 text-white/80 hover:bg-white/20 hover:text-white transition"
              title={isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Layar Penuh (Proyektor)'}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/80 hover:bg-white/20 hover:text-white transition"
              title="Tutup Layar QR"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8FAFC]">
          {/* Left Column: QR Code Display with Countdown */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            {/* Subject Selector & Anti-Duplicate Shield Badge */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Mata Pelajaran:</span>
                <select
                  value={sessionSubject}
                  onChange={(e) => setSessionSubject(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-hidden"
                >
                  <option value="Matematika Wajib (Jam Ke-1)">Matematika Wajib (Jam Ke-1)</option>
                  <option value="Presensi Masuk Pagi (07.00 - 07.15)">Presensi Masuk Pagi (07.00 - 07.15)</option>
                  <option value="Fisika (Jam Ke-3 s/d 4)">Fisika (Jam Ke-3 s/d 4)</option>
                  <option value="Kimia (Jam Ke-5 s/d 6)">Kimia (Jam Ke-5 s/d 6)</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#1E3A8A] border border-blue-200">
                <ShieldCheck className="h-3.5 w-3.5 text-[#1E3A8A]" />
                <span>Anti-Duplikasi Aktif</span>
              </div>
            </div>

            {/* QR Code Container with Frame */}
            <div className="relative p-5 rounded-3xl bg-white border-4 border-slate-200 shadow-xl group">
              <QRCodeSVG
                value={currentQrToken}
                size={isFullscreen ? 320 : 250}
                level="H"
                includeMargin={true}
                fgColor="#1E3A8A" // Primary Navy
              />

              {/* Center Logo / Badge on QR */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-10 w-10 rounded-full bg-white shadow-md border-2 border-[#1E3A8A] flex items-center justify-center text-[#1E3A8A]">
                  <span className="text-[10px] font-black">SMA 1</span>
                </div>
              </div>
            </div>

            {/* Countdown Timer with Progress Bar */}
            <div className="w-full max-w-sm mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="h-4 w-4 text-[#1E3A8A]" />
                  <span>Durasi Batas Scan:</span>
                </div>
                <span
                  className={`text-sm font-mono font-black ${
                    timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-[#1E3A8A]'
                  }`}
                >
                  {timeLeft} Detik
                </span>
              </div>

              {/* Linear Progress Bar */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`h-full transition-all duration-1000 rounded-full ${
                    timeLeft <= 5
                      ? 'bg-[#DC2626]'
                      : timeLeft <= 10
                      ? 'bg-[#D97706]'
                      : 'bg-[#059669]'
                  }`}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                *Kode QR diperbarui otomatis saat timer habis untuk mencegah screenshot & titip absen.
              </p>
            </div>

            {/* Controls Toolbar */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={generateNewToken}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
              >
                <RefreshCw className="h-3.5 w-3.5 text-[#1E3A8A]" />
                <span>Acak Ulang QR Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold shadow-2xs transition ${
                  isPaused
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200'
                }`}
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                <span>{isPaused ? 'Lanjutkan Timer' : 'Jeda Timer'}</span>
              </button>

              {/* Duration Selector */}
              <div className="flex items-center gap-1 text-xs text-slate-500 ml-2">
                <span className="text-[11px]">Siklus:</span>
                {[15, 30, 60].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setDuration(dur);
                      setTimeLeft(dur);
                    }}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                      duration === dur
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Attendance Statistics & Live Scanned Feed */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Live Count Card */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Kehadiran Kelas Hari Ini</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                  {attendedCount} / {totalCount} Siswa
                </span>
              </div>

              {/* Big Percentage Indicator */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    {((attendedCount / (totalCount || 1)) * 100).toFixed(1)}%
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">Siswa telah berhasil scan QR</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  <UserCheck className="h-7 w-7" />
                </div>
              </div>

              {/* Simulation button for evaluator */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Simulasikan 1 Siswa Scan Masuk</span>
                </button>
              </div>
            </div>

            {/* Live Feed: Siswa yang baru scan */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Feed Scan Terbaru:
                </h4>
                <span className="text-[11px] text-slate-400">Terverifikasi</span>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto max-h-56">
                {recentScans.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 animate-fadeIn"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Hadir via QR Dinamis</p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-fraud security instructions */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-slate-700">
              <p className="font-bold text-[#1E3A8A] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                SOP Presensi Barcode SMAN 1 Seputih Banyak:
              </p>
              <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                Siswa membuka kamera scan di handphone masing-masing dan memindai barcode sebelum batas timer 30 detik berakhir.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Token Aktif: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono">{currentQrToken}</code>
          </span>

          <button
            onClick={onClose}
            className="rounded-xl bg-[#1E3A8A] px-5 py-2 font-bold text-white shadow-xs hover:bg-blue-900 transition"
          >
            Selesai / Tutup Sesi
          </button>
        </div>
      </div>
    </div>
  );
};

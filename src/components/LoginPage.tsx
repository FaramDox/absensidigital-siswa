import React, { useState } from 'react';
import { UserRole, AuthUser, Student, ClassRoom } from '../types';
import { SCHOOL_INFO, MOCK_CLASSES, MOCK_STUDENTS_XI_MIPA_1 } from '../data/mockData';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User,
  Users,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  Sparkles,
  Phone,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  classes: ClassRoom[];
  students: Student[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  classes,
  students,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>('wali_kelas');
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields State
  // 1. Admin
  const [adminUsername, setAdminUsername] = useState('admin_sekolah');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // 2. Wali Kelas
  const [teacherNip, setTeacherNip] = useState('19790412 200501 1 008');
  const [selectedClassId, setSelectedClassId] = useState('xi-mipa-1');
  const [teacherPassword, setTeacherPassword] = useState('guru123');

  // 3. Siswa
  const [studentNisn, setStudentNisn] = useState('0085431201'); // Ahmad Dahlan
  const [studentDob, setStudentDob] = useState('2008-05-14');

  // 4. Orang Tua
  const [parentPhone, setParentPhone] = useState('081273849102');
  const [parentChildId, setParentChildId] = useState('std-01'); // Ahmad Dahlan

  // Role Configurations
  const roleConfigs = {
    admin: {
      title: 'Portal Admin & Manajemen Sekolah',
      subtitle: 'Akses pimpinan sekolah & operator data kehadiran pusat',
      landingName: 'Admin Overview Dashboard (Statistik Seluruh Sekolah)',
      icon: ShieldCheck,
      color: 'from-[#1E3A8A] to-blue-900',
      badgeBg: 'bg-blue-100 text-[#1E3A8A]',
      accentColor: '#1E3A8A',
      demoUser: {
        id: 'usr-admin-01',
        name: SCHOOL_INFO.principal,
        role: 'admin' as UserRole,
        identifier: SCHOOL_INFO.principalNip,
        title: 'Kepala Sekolah & Super Admin',
      },
    },
    wali_kelas: {
      title: 'Portal Wali Kelas & Guru Pengampu',
      subtitle: 'Pencatatan presensi harian, verifikasi surat & pantau kelas',
      landingName: 'Workspace Presensi Wali Kelas (XI MIPA 1)',
      icon: UserCheck,
      color: 'from-[#1E3A8A] to-indigo-900',
      badgeBg: 'bg-indigo-100 text-indigo-900',
      accentColor: '#1E3A8A',
      demoUser: {
        id: 'usr-guru-01',
        name: 'Ahmad Fauzi, S.Pd.',
        role: 'wali_kelas' as UserRole,
        identifier: '19790412 200501 1 008',
        title: 'Wali Kelas XI MIPA 1',
        classId: 'xi-mipa-1',
        className: 'XI MIPA 1',
      },
    },
    siswa: {
      title: 'Portal Mandiri Siswa',
      subtitle: 'Cek persentase kehadiran pribadi & kirim surat izin/sakit',
      landingName: 'Dashboard Mandiri Siswa (Portofolio Presensi)',
      icon: User,
      color: 'from-emerald-700 to-[#059669]',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      accentColor: '#059669',
      demoUser: {
        id: 'usr-std-01',
        name: 'Ahmad Dahlan',
        role: 'siswa' as UserRole,
        identifier: '0085431201',
        title: 'Siswa Kelas XI MIPA 1',
        classId: 'xi-mipa-1',
        className: 'XI MIPA 1',
        studentId: 'std-01',
      },
    },
    orang_tua: {
      title: 'Portal Wali Murid & Orang Tua',
      subtitle: 'Pemantauan kehadiran anak real-time & transparansi sekolah',
      landingName: 'Portal Monitoring Orang Tua (Pemantauan Ananda)',
      icon: Users,
      color: 'from-amber-700 to-orange-800',
      badgeBg: 'bg-amber-100 text-amber-900',
      accentColor: '#D97706',
      demoUser: {
        id: 'usr-ortu-01',
        name: 'H. Dahlan Syarif',
        role: 'orang_tua' as UserRole,
        identifier: '081273849102',
        title: 'Wali Murid Ananda Ahmad Dahlan',
        studentId: 'std-01',
      },
    },
  };

  const [redirectingTarget, setRedirectingTarget] = useState<string | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setErrorText(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorText(null);

    const targetLanding = roleConfigs[activeRole].landingName;
    setRedirectingTarget(targetLanding);

    setTimeout(() => {
      setIsLoading(false);
      if (activeRole === 'admin') {
        onLoginSuccess({
          id: 'admin-01',
          name: SCHOOL_INFO.principal,
          role: 'admin',
          identifier: adminUsername,
          title: 'Kepala SMAN 1 Seputih Banyak',
        });
      } else if (activeRole === 'wali_kelas') {
        const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];
        onLoginSuccess({
          id: 'guru-01',
          name: targetClass.homeroomTeacher,
          role: 'wali_kelas',
          identifier: teacherNip,
          title: `Wali Kelas ${targetClass.name}`,
          classId: targetClass.id,
          className: targetClass.name,
        });
      } else if (activeRole === 'siswa') {
        const found = students.find((s) => s.nisn === studentNisn) || students[0];
        onLoginSuccess({
          id: `siswa-${found.id}`,
          name: found.name,
          role: 'siswa',
          identifier: found.nisn,
          title: `Siswa ${found.className}`,
          classId: found.classId,
          className: found.className,
          studentId: found.id,
        });
      } else {
        // orang_tua
        const foundChild = students.find((s) => s.id === parentChildId) || students[0];
        onLoginSuccess({
          id: `ortu-${foundChild.id}`,
          name: foundChild.parentName,
          role: 'orang_tua',
          identifier: parentPhone,
          title: `Orang Tua / Wali dari ${foundChild.name}`,
          studentId: foundChild.id,
        });
      }
    }, 650);
  };

  // Quick 1-Click Login Helper
  const handleQuickDemoLogin = (role: UserRole, specificStudentId?: string) => {
    setActiveRole(role);
    setIsLoading(true);
    const targetLanding = roleConfigs[role].landingName;
    setRedirectingTarget(targetLanding);

    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        onLoginSuccess(roleConfigs.admin.demoUser);
      } else if (role === 'wali_kelas') {
        onLoginSuccess(roleConfigs.wali_kelas.demoUser);
      } else if (role === 'siswa') {
        const std = specificStudentId ? students.find((s) => s.id === specificStudentId) || students[0] : students[0];
        onLoginSuccess({
          id: `usr-${std.id}`,
          name: std.name,
          role: 'siswa',
          identifier: std.nisn,
          title: `Siswa Kelas ${std.className}`,
          classId: std.classId,
          className: std.className,
          studentId: std.id,
        });
      } else {
        const std = specificStudentId ? students.find((s) => s.id === specificStudentId) || students[0] : students[0];
        onLoginSuccess({
          id: `usr-ortu-${std.id}`,
          name: std.parentName,
          role: 'orang_tua',
          identifier: std.parentPhone,
          title: `Orang Tua dari ${std.name}`,
          studentId: std.id,
        });
      }
    }, 600);
  };

  const currentConfig = roleConfigs[activeRole];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <div className="bg-[#1E3A8A] text-white px-4 py-2.5 shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-200" />
            <span className="font-bold">{SCHOOL_INFO.fullName}</span>
            <span className="hidden sm:inline text-blue-200">
              • Lampung Tengah (NPSN: {SCHOOL_INFO.npsn})
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar className="h-3.5 w-3.5" />
            <span>{SCHOOL_INFO.todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Main Login Content Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Role Overview & School Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E3A8A] via-blue-900 to-indigo-950 p-6 sm:p-8 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white shadow-md ring-2 ring-white/30 backdrop-blur-xs">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-base font-bold leading-tight">
                    {SCHOOL_INFO.name}
                  </h1>
                  <p className="text-xs text-blue-200">
                    Sistem Presensi Siswa Terpadu
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-200 border border-white/20">
                  Pilih Portal Peran Anda
                </span>
                <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                  Silakan pilih jenis akun yang sesuai untuk masuk ke antarmuka aplikasi dengan hak akses masing-masing.
                </p>
              </div>

              {/* Role Selection Tabs in Left Column */}
              <div className="mt-6 space-y-2.5">
                {(['wali_kelas', 'admin', 'siswa', 'orang_tua'] as UserRole[]).map((role) => {
                  const cfg = roleConfigs[role];
                  const Icon = cfg.icon;
                  const isSelected = activeRole === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-md ring-2 ring-blue-300 font-semibold'
                          : 'bg-white/10 text-white/90 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? 'bg-blue-100 text-[#1E3A8A]' : 'bg-white/15 text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">
                          {role === 'admin' && 'Admin Sekolah'}
                          {role === 'wali_kelas' && 'Wali Kelas / Guru'}
                          {role === 'siswa' && 'Siswa'}
                          {role === 'orang_tua' && 'Orang Tua / Wali'}
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-slate-500' : 'text-blue-200'
                          }`}
                        >
                          {role === 'admin' && 'Pimpinan & Operator'}
                          {role === 'wali_kelas' && 'Input Presensi & Validasi'}
                          {role === 'siswa' && 'Lihat Riwayat & Buat Izin'}
                          {role === 'orang_tua' && 'Pantau Kehadiran Anak'}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-[#1E3A8A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-8 pt-4 border-t border-white/20 text-[11px] text-blue-200 space-y-1">
              <p>📍 {SCHOOL_INFO.address}</p>
              <p>Akreditasi: <b>{SCHOOL_INFO.akreditasi}</b> • TA {SCHOOL_INFO.academicYear}</p>
            </div>
          </div>

          {/* Right Panel: Role-Specific Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Dynamic Role Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${currentConfig.badgeBg}`}>
                    <CurrentIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {currentConfig.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentConfig.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorText && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
                {/* ROLE 1: ADMIN FORM */}
                {activeRole === 'admin' && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Username / NIP Administrator
                      </label>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Contoh: admin_sekolah atau 19680814..."
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Password Admin
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Masukkan password admin"
                          className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ROLE 2: WALI KELAS FORM */}
                {activeRole === 'wali_kelas' && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        NIP / NUPTK Guru
                      </label>
                      <input
                        type="text"
                        value={teacherNip}
                        onChange={(e) => setTeacherNip(e.target.value)}
                        placeholder="Contoh: 19790412 200501 1 008"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Kelas Binaan yang Diampu
                      </label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      >
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} — Wali: {cls.homeroomTeacher}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Password Akun Guru
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          placeholder="Masukkan password"
                          className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ROLE 3: SISWA FORM */}
                {activeRole === 'siswa' && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        NISN Siswa (10 Digit)
                      </label>
                      <input
                        type="text"
                        value={studentNisn}
                        onChange={(e) => setStudentNisn(e.target.value)}
                        placeholder="Contoh: 0085431201"
                        maxLength={10}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Pilih Profil Siswa
                      </label>
                      <select
                        value={studentNisn}
                        onChange={(e) => setStudentNisn(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      >
                        <option value="0085431201">Ahmad Dahlan (NISN: 0085431201 - XI MIPA 1)</option>
                        <option value="0087452303">Citra Dewi Permata (NISN: 0087452303 - XI MIPA 1)</option>
                        <option value="0086291402">Budi Santoso (NISN: 0086291402 - XI MIPA 1)</option>
                        <option value="0088923404">Dedi Kurniawan (NISN: 0088923404 - XI MIPA 1)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Tanggal Lahir Siswa (Verifikasi Keamanan)
                      </label>
                      <input
                        type="date"
                        value={studentDob}
                        onChange={(e) => setStudentDob(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                        required
                      />
                    </div>
                  </>
                )}

                {/* ROLE 4: ORANG TUA FORM */}
                {activeRole === 'orang_tua' && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nomor Handphone / WhatsApp Terdaftar
                      </label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="Contoh: 081273849102"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Pilih Ananda / Siswa yang Dipantau
                      </label>
                      <select
                        value={parentChildId}
                        onChange={(e) => setParentChildId(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      >
                        <option value="std-01">Ahmad Dahlan (Wali: H. Dahlan Syarif) - Hadir</option>
                        <option value="std-02">Budi Santoso (Wali: Suraji Santoso) - Kritis Alfa 3x</option>
                        <option value="std-03">Citra Dewi Permata (Wali: Hendra Permata) - Sakit</option>
                        <option value="std-04">Dedi Kurniawan (Wali: Kurnia Wahyudi) - Izin OSN</option>
                      </select>
                      <p className="mt-1 text-[11px] text-slate-400">
                        *Data terhubung langsung dengan buku induk kesiswaan
                      </p>
                    </div>
                  </>
                )}

                {/* Redirection Alert when authenticating */}
                {isLoading && redirectingTarget && (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-900 shadow-sm animate-pulse">
                    <div className="flex items-center gap-2 font-bold">
                      <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
                      <span>Autentikasi Berhasil! Mengalihkan...</span>
                    </div>
                    <p className="mt-1 text-[11px] text-emerald-800">
                      Membuka landing view: <b>{redirectingTarget}</b>
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full animate-[progress_1s_ease-in-out_infinite] w-3/4" />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-md transition-all ${
                      isLoading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : activeRole === 'admin'
                        ? 'bg-[#1E3A8A] hover:bg-blue-900'
                        : activeRole === 'wali_kelas'
                        ? 'bg-[#1E3A8A] hover:bg-blue-900'
                        : activeRole === 'siswa'
                        ? 'bg-[#059669] hover:bg-emerald-700'
                        : 'bg-[#D97706] hover:bg-amber-700'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>
                      {isLoading
                        ? 'Mengalihkan...'
                        : activeRole === 'admin'
                        ? 'Masuk ke Admin Overview'
                        : activeRole === 'wali_kelas'
                        ? 'Masuk ke Workspace Wali Kelas'
                        : activeRole === 'siswa'
                        ? 'Masuk ke Dashboard Siswa'
                        : 'Masuk ke Portal Orang Tua'}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick 1-Click Demo Buttons for Fast Evaluation */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Mode Cepat Pengujian (1-Klik):
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('wali_kelas')}
                  className="rounded-lg border border-blue-200 bg-blue-50/70 p-2 font-semibold text-[#1E3A8A] hover:bg-blue-100 text-left transition flex items-center justify-between"
                >
                  <span>👨‍🏫 Wali Kelas (Pak Ahmad)</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 font-semibold text-slate-700 hover:bg-slate-100 text-left transition flex items-center justify-between"
                >
                  <span>🛡️ Admin (Kepala Sekolah)</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('siswa', 'std-01')}
                  className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2 font-semibold text-emerald-800 hover:bg-emerald-100 text-left transition flex items-center justify-between"
                >
                  <span>🎓 Siswa (Ahmad Dahlan)</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('orang_tua', 'std-02')}
                  className="rounded-lg border border-amber-200 bg-amber-50/70 p-2 font-semibold text-amber-900 hover:bg-amber-100 text-left transition flex items-center justify-between"
                >
                  <span>👨‍👩‍👧 Ortu Budi S. (3x Alfa)</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-3 text-xs text-slate-400">
        © 2026 SMAN 1 Seputih Banyak • Sistem Informasi Presensi Siswa Digital
      </div>
    </div>
  );
};

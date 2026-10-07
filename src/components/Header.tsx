import React from 'react';
import { UserRole, AuthUser } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User,
  Users,
  Bell,
  Calendar,
  RotateCcw,
  FileCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
  pendingRequestsCount: number;
  criticalStudentsCount: number;
  onOpenLeaveRequests: () => void;
  onResetData: () => void;
  selectedClassName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onRoleChange,
  pendingRequestsCount,
  criticalStudentsCount,
  onOpenLeaveRequests,
  onResetData,
  selectedClassName,
}) => {
  const currentRole = currentUser.role;

  const roleNames: Record<UserRole, { label: string; icon: React.ElementType; desc: string }> = {
    admin: { label: 'Admin Sekolah', icon: ShieldCheck, desc: `${SCHOOL_INFO.principal} (Kepsek)` },
    wali_kelas: { label: 'Wali Kelas', icon: UserCheck, desc: `Ahmad Fauzi, S.Pd. (${selectedClassName})` },
    siswa: { label: 'Siswa', icon: User, desc: `${currentUser.name} (${currentUser.identifier})` },
    orang_tua: { label: 'Orang Tua', icon: Users, desc: `${currentUser.name} (${currentUser.title})` },
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Banner / School Branding */}
      <div className="border-b border-slate-100 bg-[#1E3A8A] text-white px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Presensi Aktif
            </span>
            <span className="hidden sm:inline text-blue-100">
              Tahun Ajaran {SCHOOL_INFO.academicYear} • Semester {SCHOOL_INFO.semester}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-blue-100">
            <span className="hidden md:inline">NPSN: {SCHOOL_INFO.npsn} • Akreditasi: {SCHOOL_INFO.akreditasi}</span>
            <div className="flex items-center gap-1.5 text-white font-medium">
              <Calendar className="h-3.5 w-3.5 text-blue-200" />
              <span>{SCHOOL_INFO.todayFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-blue-900 text-white shadow-md ring-2 ring-blue-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {SCHOOL_INFO.name}
                </h1>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-[#1E3A8A]">
                  Presensi Digital
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kec. Seputih Banyak, Kab. Lampung Tengah • Prov. Lampung
              </p>
            </div>
          </div>

          {/* User Info, Role Switcher & Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Quick Demo Reset */}
            <button
              onClick={onResetData}
              title="Reset ke data awal simulasi"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Leave Request Approval Badge Button */}
            {(currentRole === 'wali_kelas' || currentRole === 'admin') && (
              <button
                onClick={onOpenLeaveRequests}
                className="relative inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 shadow-2xs"
              >
                <FileCheck className="h-4 w-4 text-[#D97706]" />
                <span>Verifikasi Surat</span>
                {pendingRequestsCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D97706] text-[10px] font-bold text-white shadow-xs animate-bounce">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Alert */}
            <div className="relative">
              <button
                title="Notifikasi"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Bell className="h-4 w-4" />
                {criticalStudentsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
                    {criticalStudentsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Role Switcher Pill Container */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
              <span className="px-2 text-[11px] font-semibold text-slate-400 hidden xl:inline">
                Ganti Mode:
              </span>
              {(['admin', 'wali_kelas', 'siswa', 'orang_tua'] as UserRole[]).map((role) => {
                const info = roleNames[role];
                const Icon = info.icon;
                const isActive = currentRole === role;

                return (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1E3A8A] text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{info.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout / Keluar Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-[#DC2626] transition hover:bg-red-100 shadow-2xs"
              title="Keluar ke Halaman Login"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Active Role User Info Banner */}
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Akun Aktif:</span>
            <span className="font-bold text-[#1E3A8A]">{currentUser.name}</span>
            <span className="rounded-md bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-[#1E3A8A]">
              {roleNames[currentRole].label}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600 hidden sm:inline">{currentUser.title}</span>
          </div>

          <div className="text-[11px] text-slate-500 hidden md:block">
            {currentRole === 'wali_kelas' && 'Fokus: Rekap & Presensi Kelas XI MIPA 1'}
            {currentRole === 'admin' && 'Fokus: Rekap & Manajemen Seluruh Kelas'}
            {currentRole === 'siswa' && 'Fokus: Portofolio Kehadiran Pribadi & Izin'}
            {currentRole === 'orang_tua' && 'Fokus: Monitoring Kehadiran Ananda'}
          </div>
        </div>
      </div>
    </header>
  );
};

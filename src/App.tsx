/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  ClassRoom,
  DayAttendanceTrend,
  AuthUser,
  QRScanLogEntry,
} from './types';
import {
  SCHOOL_INFO,
  MOCK_CLASSES,
  MOCK_STUDENTS_XI_MIPA_1,
  INITIAL_ATTENDANCE_RECORDS,
  MOCK_WEEKLY_TRENDS,
  MOCK_MONTHLY_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_SCAN_LOGS,
} from './data/mockData';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { WeeklyChart } from './components/WeeklyChart';
import { MonthlyAttendanceChart } from './components/MonthlyAttendanceChart';
import { EarlyWarningWidget } from './components/EarlyWarningWidget';
import { DailyAttendanceTable } from './components/DailyAttendanceTable';
import { ScanLog } from './components/ScanLog';
import { QuickAttendanceModal } from './components/QuickAttendanceModal';
import { LetterPreviewModal } from './components/LetterPreviewModal';
import { LeaveApprovalModal } from './components/LeaveApprovalModal';
import { ReportModal } from './components/ReportModal';
import { StudentPortal } from './components/StudentPortal';
import { ParentPortal } from './components/ParentPortal';
import { AdminOverviewDashboard } from './components/AdminOverviewDashboard';
import { TeacherQRModal } from './components/TeacherQRModal';
import {
  Percent,
  CheckCircle2,
  HeartPulse,
  FileCheck2,
  AlertOctagon,
  Users,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Building2,
  UserCheck,
  QrCode,
  Calendar,
} from 'lucide-react';

export default function App() {
  // Storage Keys
  const STORAGE_AUTH_USER = 'sman1_att_auth_user';
  const STORAGE_ROLE = 'sman1_att_role';
  const STORAGE_RECORDS = 'sman1_att_records';
  const STORAGE_REQUESTS = 'sman1_att_requests';
  const STORAGE_STUDENTS = 'sman1_att_students';
  const STORAGE_SCAN_LOGS = 'sman1_att_scan_logs';

  // State: Authenticated User (null = show Login Page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Default logged in as Wali Kelas for immediate interactivity
    return {
      id: 'usr-guru-01',
      name: 'Ahmad Fauzi, S.Pd.',
      role: 'wali_kelas',
      identifier: '19790412 200501 1 008',
      title: 'Wali Kelas XI MIPA 1',
      classId: 'xi-mipa-1',
      className: 'XI MIPA 1',
    };
  });

  const [selectedClassId, setSelectedClassId] = useState<string>('xi-mipa-1');
  const [adminViewMode, setAdminViewMode] = useState<'overview' | 'class_details'>('overview');
  const [homeroomViewTab, setHomeroomViewTab] = useState<'table' | 'scan_log'>('table');

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_RECORDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ATTENDANCE_RECORDS;
  });

  const [scanLogs, setScanLogs] = useState<QRScanLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_SCAN_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SCAN_LOGS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_STUDENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_STUDENTS_XI_MIPA_1;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_REQUESTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  const [weeklyTrends, setWeeklyTrends] = useState<DayAttendanceTrend[]>(MOCK_WEEKLY_TRENDS);

  // Modals state
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isTeacherQROpen, setIsTeacherQROpen] = useState(false);
  const [currentQrToken, setCurrentQrToken] = useState<string>(
    () => `SMAN1-XI-MIPA-1-${Date.now()}-INITIAL`
  );
  const [previewRecord, setPreviewRecord] = useState<AttendanceRecord | null>(null);
  const [previewLeaveRequest, setPreviewLeaveRequest] = useState<LeaveRequest | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_ROLE, currentUser.role);
    } else {
      localStorage.removeItem(STORAGE_AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SCAN_LOGS, JSON.stringify(scanLogs));
  }, [scanLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Login handler
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setAdminViewMode('overview');
    }
    if (user.classId) {
      setSelectedClassId(user.classId);
    }

    const landingNames: Record<UserRole, string> = {
      admin: 'Admin Overview Dashboard (Statistik Sekolah)',
      wali_kelas: `Workspace Wali Kelas (${user.className || 'XI MIPA 1'})`,
      siswa: 'Dashboard Mandiri Siswa',
      orang_tua: 'Portal Monitoring Orang Tua',
    };

    showToast(`Berhasil masuk! Selamat datang di ${landingNames[user.role]}.`);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari sistem.');
  };

  // Role Switcher while logged in
  const handleRoleChange = (newRole: UserRole) => {
    if (!currentUser) return;
    if (newRole === 'admin') {
      setCurrentUser({
        id: 'usr-admin-01',
        name: SCHOOL_INFO.principal,
        role: 'admin',
        identifier: SCHOOL_INFO.principalNip,
        title: 'Kepala Sekolah & Super Admin',
      });
      setAdminViewMode('overview');
    } else if (newRole === 'wali_kelas') {
      setCurrentUser({
        id: 'usr-guru-01',
        name: 'Ahmad Fauzi, S.Pd.',
        role: 'wali_kelas',
        identifier: '19790412 200501 1 008',
        title: 'Wali Kelas XI MIPA 1',
        classId: 'xi-mipa-1',
        className: 'XI MIPA 1',
      });
      setSelectedClassId('xi-mipa-1');
    } else if (newRole === 'siswa') {
      const std = students[0];
      setCurrentUser({
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
      const std = students[0];
      setCurrentUser({
        id: `usr-ortu-${std.id}`,
        name: std.parentName,
        role: 'orang_tua',
        identifier: std.parentPhone,
        title: `Wali Murid Ananda ${std.name}`,
        studentId: std.id,
      });
    }
    showToast(`Beralih ke landing view: ${newRole.toUpperCase()}`);
  };

  // Reset demo function
  const handleResetData = () => {
    localStorage.removeItem(STORAGE_RECORDS);
    localStorage.removeItem(STORAGE_REQUESTS);
    localStorage.removeItem(STORAGE_STUDENTS);
    localStorage.removeItem(STORAGE_SCAN_LOGS);
    setRecords(INITIAL_ATTENDANCE_RECORDS);
    setStudents(MOCK_STUDENTS_XI_MIPA_1);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setWeeklyTrends(MOCK_WEEKLY_TRENDS);
    setScanLogs(INITIAL_SCAN_LOGS);
    showToast('Data demo berhasil direset ke pengaturan awal!');
  };

  // If user is not logged in, render the dedicated LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        classes={MOCK_CLASSES}
        students={students}
      />
    );
  }

  const currentRole = currentUser.role;

  // Active Class Info
  const currentClass =
    MOCK_CLASSES.find((c) => c.id === selectedClassId) || MOCK_CLASSES[0];

  // Calculated Real-Time Metrics for today
  const totalStudents = records.length;
  const totalHadir = records.filter((r) => r.status === 'Hadir').length;
  const totalSakit = records.filter((r) => r.status === 'Sakit').length;
  const totalIzin = records.filter((r) => r.status === 'Izin').length;
  const totalAlfa = records.filter((r) => r.status === 'Alfa').length;
  const attendancePercentage =
    totalStudents > 0
      ? ((totalHadir / totalStudents) * 100).toFixed(1)
      : '0';

  // Counts for header badges
  const pendingRequestsCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const criticalStudentsCount = students.filter((s) => s.totalAlfa >= 3).length;

  // Handler: Change single record status directly from table
  const handleSingleStatusChange = (recordId: string, newStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const updatedTime =
            newStatus === 'Hadir'
              ? r.time === '-' ? '07.15 WIB' : r.time
              : newStatus === 'Alfa'
              ? '-'
              : r.time;
          return {
            ...r,
            status: newStatus,
            time: updatedTime,
          };
        }
        return r;
      })
    );
    showToast(`Status kehadiran siswa berhasil diperbarui ke '${newStatus}'.`);
  };

  // Handler: Save from Quick Attendance modal
  const handleSaveBulkAttendance = (
    updatedRecords: AttendanceRecord[],
    generalNote: string
  ) => {
    setRecords(updatedRecords);
    // Update Wednesday trend in weekly chart
    setWeeklyTrends((prev) =>
      prev.map((t) => {
        if (t.dayName === 'Rabu') {
          const hadir = updatedRecords.filter((r) => r.status === 'Hadir').length;
          const sakit = updatedRecords.filter((r) => r.status === 'Sakit').length;
          const izin = updatedRecords.filter((r) => r.status === 'Izin').length;
          const alfa = updatedRecords.filter((r) => r.status === 'Alfa').length;
          const pct = parseFloat(((hadir / (updatedRecords.length || 1)) * 100).toFixed(1));
          return {
            ...t,
            hadir,
            sakit,
            izin,
            alfa,
            percentage: pct,
          };
        }
        return t;
      })
    );
    showToast('Presensi kelas berhasil disimpan & diperbarui secara otomatis!');
  };

  // Handler: Approve Leave Request
  const handleApproveLeave = (reqId: string, note?: string) => {
    const target = leaveRequests.find((r) => r.id === reqId);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'approved',
              reviewerNote: note || 'Disetujui oleh Wali Kelas',
            }
          : r
      )
    );

    // Also update student's attendance record today if matches
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId === target.studentId) {
          return {
            ...r,
            status: target.type as AttendanceStatus,
            note: target.reason,
            letterAttachment: {
              type: target.type === 'Sakit' ? 'surat_dokter' : 'surat_ortu',
              fileName: target.letterFileName || 'Surat_Izin.pdf',
              fileUrl:
                target.letterAttachmentUrl ||
                'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
              uploadedAt: '07.00 WIB',
              status: 'approved',
            },
          };
        }
        return r;
      })
    );

    showToast(`Pengajuan ${target.type} untuk ${target.studentName} telah disetujui!`);
  };

  // Handler: Reject Leave Request
  const handleRejectLeave = (reqId: string, note?: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'rejected',
              reviewerNote: note || 'Ditolak: Dokumen tidak sesuai',
            }
          : r
      )
    );
    showToast('Pengajuan izin ditolak.');
  };

  // Handler: Student submits leave request
  const handleSubmitStudentLeave = (
    newReq: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>
  ) => {
    const created: LeaveRequest = {
      ...newReq,
      id: `req-${Date.now()}`,
      submittedAt: '07 Okt 2026, 08:30 WIB',
      status: 'pending',
    };
    setLeaveRequests((prev) => [created, ...prev]);
    showToast('Surat permohonan izin berhasil dikirim ke Wali Kelas!');
  };

  // Handler: Student scanned rolling QR code
  const handleStudentScannedQR = (studentId: string, timeScanned?: string) => {
    const studentObj = students.find((s) => s.id === studentId);
    const studentName = studentObj?.name || 'Siswa';
    const now = new Date();
    const exactTimeStr =
      timeScanned ||
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

    // Parse punctuality (> 07:15 is terlambat)
    const isLate = exactTimeStr > '07:15:00';

    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          return {
            ...r,
            status: 'Hadir',
            time: exactTimeStr,
            note: 'Presensi via QR Barcode Dinamis',
          };
        }
        return r;
      })
    );

    // Create real-time scan log entry
    const newLogEntry: QRScanLogEntry = {
      id: `log-${Date.now()}`,
      studentId,
      studentName,
      studentNisn: studentObj?.nisn || '0085431201',
      gender: studentObj?.gender || 'L',
      className: currentClass.name,
      timestamp: exactTimeStr,
      exactDate: '2026-10-07',
      punctuality: isLate ? 'terlambat' : 'tepat_waktu',
      verifiedToken: currentQrToken,
    };

    setScanLogs((prev) => [newLogEntry, ...prev.filter((l) => l.studentId !== studentId)]);
    showToast(`Presensi Berhasil! ${studentName} tercatat Hadir (${exactTimeStr}).`);
  };

  const handleRegenerateToken = React.useCallback((newToken: string) => {
    setCurrentQrToken(newToken);
  }, []);

  // Active student for Student Portal
  const activeStudent =
    (currentUser.studentId && students.find((s) => s.id === currentUser.studentId)) ||
    students[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onRoleChange={handleRoleChange}
        pendingRequestsCount={pendingRequestsCount}
        criticalStudentsCount={criticalStudentsCount}
        onOpenLeaveRequests={() => setIsApprovalModalOpen(true)}
        onResetData={handleResetData}
        selectedClassName={currentClass.name}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 border border-slate-700">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {/* ROLE LANDING VIEW 1: ADMIN OVERVIEW DASHBOARD */}
        {currentRole === 'admin' && (
          <div className="space-y-6">
            {adminViewMode === 'overview' ? (
              <AdminOverviewDashboard
                classes={MOCK_CLASSES}
                students={students}
                totalStudentsSchool={228}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onSelectClassForInspection={(classId) => {
                  setSelectedClassId(classId);
                  setAdminViewMode('class_details');
                  showToast(`Membuka audit presensi kelas ${MOCK_CLASSES.find((c) => c.id === classId)?.name}...`);
                }}
              />
            ) : (
              /* Admin drilled down to inspect a specific class */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdminViewMode('overview')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#1E3A8A] hover:bg-slate-50 transition shadow-2xs"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Kembali ke Admin Overview</span>
                    </button>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Audit Presensi: Kelas {currentClass.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Wali Kelas: {currentClass.homeroomTeacher} • NIP: {currentClass.teacherNip}
                      </p>
                    </div>
                  </div>

                  {/* Switch Class Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="admin-class-select" className="text-xs font-semibold text-slate-600">Ganti Kelas:</label>
                    <select
                      id="admin-class-select"
                      aria-label="Pilih Kelas"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden"
                    >
                      {MOCK_CLASSES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.homeroomTeacher})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Class Detail Metrics & Table */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <MetricCard
                    title="Persentase Kehadiran"
                    value={`${attendancePercentage}%`}
                    subtitle={`Target: 95.0%`}
                    icon={Percent}
                    variant="primary"
                    trend={parseFloat(attendancePercentage) >= 95 ? 'up' : 'down'}
                  />
                  <MetricCard
                    title="Total Hadir"
                    value={`${totalHadir} / ${totalStudents}`}
                    subtitle="Siswa di ruang kelas"
                    icon={CheckCircle2}
                    variant="success"
                  />
                  <MetricCard
                    title="Sakit"
                    value={`${totalSakit} Siswa`}
                    subtitle="Surat dokter"
                    icon={HeartPulse}
                    variant="info"
                  />
                  <MetricCard
                    title="Izin"
                    value={`${totalIzin} Siswa`}
                    subtitle="Dispensasi / ortu"
                    icon={FileCheck2}
                    variant="warning"
                  />
                  <MetricCard
                    title="Alfa"
                    value={`${totalAlfa} Siswa`}
                    subtitle="Tanpa kabar"
                    icon={AlertOctagon}
                    variant="danger"
                  />
                </div>

                {/* Class Detail Table and Scan Log Tabs */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHomeroomViewTab('table')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-2xs ${
                          homeroomViewTab === 'table'
                            ? 'bg-[#1E3A8A] text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Tabel Presensi Harian ({records.length} Siswa)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHomeroomViewTab('scan_log')}
                        className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-2xs ${
                          homeroomViewTab === 'scan_log'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        <QrCode className="h-4 w-4" />
                        <span>Scan Log Real-Time ({scanLogs.length} Entri Masuk)</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 hidden md:block">
                      {homeroomViewTab === 'table' ? (
                        <span>Audit tabel presensi kelas {currentClass.name}</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          🟢 Log pemindaian QR presensi real-time
                        </span>
                      )}
                    </div>
                  </div>

                  {homeroomViewTab === 'table' ? (
                    <DailyAttendanceTable
                      records={records}
                      onStatusChange={handleSingleStatusChange}
                      onViewLetter={(rec) => setPreviewRecord(rec)}
                      onOpenQuickModal={() => setIsQuickModalOpen(true)}
                      onOpenReportModal={() => setIsReportModalOpen(true)}
                      onOpenQRModal={() => setIsTeacherQROpen(true)}
                      classNameTitle={currentClass.name}
                    />
                  ) : (
                    <ScanLog
                      logs={scanLogs}
                      classNameTitle={currentClass.name}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROLE LANDING VIEW 2: WALI KELAS WORKSPACE */}
        {currentRole === 'wali_kelas' && (
          <div className="space-y-6">
            {/* Homeroom Teacher Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#1E3A8A]">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Workspace Wali Kelas: {currentClass.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Wali Kelas: <span className="font-semibold text-slate-700">{currentClass.homeroomTeacher}</span> (NIP: {currentClass.teacherNip})
                  </p>
                </div>
              </div>

              {/* Class Selector for Teacher */}
              <div className="flex items-center gap-2">
                <label htmlFor="teacher-class-select" className="text-xs font-semibold text-slate-600">Kelas Diampu:</label>
                <select
                  id="teacher-class-select"
                  aria-label="Pilih Kelas"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:bg-white focus:outline-hidden"
                >
                  {MOCK_CLASSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalStudents} Siswa) - {c.homeroomTeacher}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1. METRIC CARDS ROW */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard
                title="Persentase Kehadiran"
                value={`${attendancePercentage}%`}
                subtitle={`Target Kelas: 95.0%`}
                icon={Percent}
                variant="primary"
                percentageChange={parseFloat(attendancePercentage) >= 95 ? '+1.2% (Target Tercapai)' : '-2.4% (Di bawah Target)'}
                trend={parseFloat(attendancePercentage) >= 95 ? 'up' : 'down'}
              />

              <MetricCard
                title="Total Hadir"
                value={`${totalHadir} / ${totalStudents}`}
                subtitle="Siswa di ruang kelas"
                icon={CheckCircle2}
                variant="success"
                percentageChange="Tepat Waktu"
                trend="up"
              />

              <MetricCard
                title="Sakit"
                value={`${totalSakit} Siswa`}
                subtitle="Dengan surat keterangan"
                icon={HeartPulse}
                variant="info"
              />

              <MetricCard
                title="Izin"
                value={`${totalIzin} Siswa`}
                subtitle="Surat ortu / dispensasi"
                icon={FileCheck2}
                variant="warning"
              />

              <MetricCard
                title="Alfa"
                value={`${totalAlfa} Siswa`}
                subtitle="Tanpa keterangan"
                icon={AlertOctagon}
                variant="danger"
                percentageChange={totalAlfa > 0 ? 'Perlu tindakan' : 'Bagus'}
                trend={totalAlfa > 0 ? 'down' : 'up'}
              />
            </div>

            {/* 2. CHARTS & EARLY WARNING SYSTEM ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Trend Chart */}
              <div className="lg:col-span-2">
                <WeeklyChart trends={weeklyTrends} />
              </div>

              {/* Early Warning System Widget */}
              <div className="lg:col-span-1">
                <EarlyWarningWidget
                  students={students}
                  onActionComplete={(name, type) => {
                    showToast(
                      type === 'whatsapp'
                        ? `Pemberitahuan telah dikirim ke orang tua ${name}`
                        : `Rujukan BK untuk ${name} telah dibuat`
                    );
                  }}
                />
              </div>
            </div>

            {/* 3. RECHARTS 6-MONTH ATTENDANCE BAR CHART */}
            <MonthlyAttendanceChart
              data={MOCK_MONTHLY_ATTENDANCE}
              classNameTitle={currentClass.name}
            />

            {/* 4. TABLE & REAL-TIME SCAN LOG TABS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHomeroomViewTab('table')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-2xs ${
                      homeroomViewTab === 'table'
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Tabel Presensi Harian ({records.length} Siswa)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHomeroomViewTab('scan_log')}
                    className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-2xs ${
                      homeroomViewTab === 'scan_log'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <QrCode className="h-4 w-4" />
                    <span>Scan Log Real-Time ({scanLogs.length} Entri Masuk)</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 hidden md:block">
                  {homeroomViewTab === 'table' ? (
                    <span>Mode tabel lengkap: edit status, catatan & surat izin</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      🟢 Menampilkan timestamp kedatangan siswa detik per detik
                    </span>
                  )}
                </div>
              </div>

              {homeroomViewTab === 'table' ? (
                <DailyAttendanceTable
                  records={records}
                  onStatusChange={handleSingleStatusChange}
                  onViewLetter={(rec) => setPreviewRecord(rec)}
                  onOpenQuickModal={() => setIsQuickModalOpen(true)}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                  onOpenQRModal={() => setIsTeacherQROpen(true)}
                  classNameTitle={currentClass.name}
                />
              ) : (
                <ScanLog
                  logs={scanLogs}
                  classNameTitle={currentClass.name}
                />
              )}
            </div>
          </div>
        )}

        {/* ROLE LANDING VIEW 3: SISWA PORTAL */}
        {currentRole === 'siswa' && (
          <StudentPortal
            currentStudent={activeStudent}
            records={records}
            leaveRequests={leaveRequests}
            onSubmitLeaveRequest={handleSubmitStudentLeave}
            onViewLetter={(rec) => setPreviewRecord(rec)}
            currentTeacherToken={currentQrToken}
            onScanQRSuccess={handleStudentScannedQR}
          />
        )}

        {/* ROLE LANDING VIEW 4: ORANG TUA PORTAL */}
        {currentRole === 'orang_tua' && (
          <ParentPortal
            students={students}
            records={records}
            onQuickReportExcuse={(student) => {
              setIsQuickModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-12">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#1E3A8A]" />
            <span className="font-semibold text-slate-800">
              SMAN 1 Seputih Banyak
            </span>
            <span>•</span>
            <span>Sistem Informasi Absensi Digital Siswa</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Provinsi Lampung</span>
            <span>•</span>
            <span>NPSN: {SCHOOL_INFO.npsn}</span>
            <span>•</span>
            <span>TA {SCHOOL_INFO.academicYear}</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Quick Attendance Modal */}
      <QuickAttendanceModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        currentClass={currentClass}
        allClasses={MOCK_CLASSES}
        initialRecords={records}
        onSave={handleSaveBulkAttendance}
      />

      {/* 2. Official Printable Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentClass={currentClass}
        records={records}
      />

      {/* 3. Leave Requests Approval Modal */}
      <LeaveApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        requests={leaveRequests}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
        onViewAttachment={(req) => setPreviewLeaveRequest(req)}
      />

      {/* 4. Letter Preview Modal */}
      <LetterPreviewModal
        isOpen={!!previewRecord || !!previewLeaveRequest}
        onClose={() => {
          setPreviewRecord(null);
          setPreviewLeaveRequest(null);
        }}
        record={previewRecord}
        leaveRequest={previewLeaveRequest}
      />

      {/* 5. Teacher Dynamic Rolling QR Code Modal */}
      <TeacherQRModal
        isOpen={isTeacherQROpen}
        onClose={() => setIsTeacherQROpen(false)}
        currentClass={currentClass}
        students={students}
        records={records}
        onStudentScanned={(studentId, studentName) => handleStudentScannedQR(studentId)}
        currentQrToken={currentQrToken}
        onRegenerateToken={handleRegenerateToken}
      />
    </div>
  );
}

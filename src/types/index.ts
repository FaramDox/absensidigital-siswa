export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';

export type UserRole = 'admin' | 'wali_kelas' | 'siswa' | 'orang_tua';

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  avatarUrl?: string;
  // Summary stats in current month
  totalHadir: number;
  totalSakit: number;
  totalIzin: number;
  totalAlfa: number;
  consecutiveAlfa?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentNisn: string;
  studentName: string;
  gender: 'L' | 'P';
  classId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm WIB
  status: AttendanceStatus;
  note?: string;
  letterAttachment?: {
    type: 'surat_dokter' | 'surat_ortu' | 'lainnya';
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  className: string;
  startDate: string;
  endDate: string;
  type: 'Sakit' | 'Izin';
  reason: string;
  letterAttachmentUrl?: string;
  letterFileName?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerNote?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: 'X' | 'XI' | 'XII';
  major: 'MIPA' | 'IPS';
  homeroomTeacher: string;
  teacherNip: string;
  totalStudents: number;
}

export interface DayAttendanceTrend {
  dayName: string;
  date: string;
  percentage: number;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total: number;
}

export interface MonthAttendanceData {
  month: string;
  shortMonth: string;
  percentage: number;
  target: number;
  totalHadir: number;
  totalSakit: number;
  totalIzin: number;
  totalAlfa: number;
  effectiveDays: number;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // NIP, NISN, or Phone
  title: string;
  className?: string;
  classId?: string;
  studentId?: string;
}

export interface QRAttendanceSession {
  sessionId: string;
  classId: string;
  className: string;
  subject: string;
  token: string;
  tokenGeneratedAt: number;
  durationSeconds: number;
  isActive: boolean;
  attendedStudentIds: string[];
}

export interface QRScanLogEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  gender: 'L' | 'P';
  className: string;
  timestamp: string; // e.g. "07:12:45 WIB"
  exactDate: string; // "2026-10-07"
  punctuality: 'tepat_waktu' | 'terlambat';
  verifiedToken: string;
}




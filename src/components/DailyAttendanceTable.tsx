import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../types';
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  PlusCircle,
  Download,
  Printer,
  ChevronDown,
  Edit3,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface DailyAttendanceTableProps {
  records: AttendanceRecord[];
  onStatusChange: (recordId: string, newStatus: AttendanceStatus) => void;
  onViewLetter: (record: AttendanceRecord) => void;
  onOpenQuickModal: () => void;
  onOpenReportModal: () => void;
  onOpenQRModal?: () => void;
  classNameTitle: string;
}

export const DailyAttendanceTable: React.FC<DailyAttendanceTableProps> = ({
  records,
  onStatusChange,
  onViewLetter,
  onOpenQuickModal,
  onOpenReportModal,
  onOpenQRModal,
  classNameTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AttendanceStatus>('All');
  const [genderFilter, setGenderFilter] = useState<'All' | 'L' | 'P'>('All');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentNisn.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesGender = genderFilter === 'All' || r.gender === genderFilter;
    return matchesSearch && matchesStatus && matchesGender;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Hadir':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#059669] border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
            Hadir
          </span>
        );
      case 'Sakit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-[#0284C7] border border-sky-200">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
            Sakit
          </span>
        );
      case 'Izin':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-[#D97706] border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
            Izin
          </span>
        );
      case 'Alfa':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-[#DC2626] border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
            Alfa
          </span>
        );
    }
  };

  const statusOptions: AttendanceStatus[] = ['Hadir', 'Sakit', 'Izin', 'Alfa'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Table Header and Toolbar */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Tabel Presensi Harian Siswa
              </h2>
              <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#1E3A8A]">
                {classNameTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredRecords.length} dari {records.length} siswa terdaftar
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenQRModal && (
              <button
                type="button"
                onClick={onOpenQRModal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 transition"
                title="Tampilkan barcode QR dinamis berbatas waktu untuk scan siswa"
              >
                <QrCode className="h-4 w-4" />
                <span>📱 Barcode QR Presensi</span>
                <span className="rounded bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">Anti-Duplikasi</span>
              </button>
            )}

            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Cetak Rekap</span>
            </button>

            <button
              onClick={onOpenQuickModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Input Presensi Cepat</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa atau NISN..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 hidden lg:inline">
              Filter Status:
            </span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                statusFilter === 'All'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({records.length})
            </button>
            <button
              onClick={() => setStatusFilter('Hadir')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                statusFilter === 'Hadir'
                  ? 'bg-[#059669] text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Hadir ({records.filter((r) => r.status === 'Hadir').length})
            </button>
            <button
              onClick={() => setStatusFilter('Sakit')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                statusFilter === 'Sakit'
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
              }`}
            >
              Sakit ({records.filter((r) => r.status === 'Sakit').length})
            </button>
            <button
              onClick={() => setStatusFilter('Izin')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                statusFilter === 'Izin'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Izin ({records.filter((r) => r.status === 'Izin').length})
            </button>
            <button
              onClick={() => setStatusFilter('Alfa')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                statusFilter === 'Alfa'
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-red-50 text-red-800 hover:bg-red-100'
              }`}
            >
              Alfa ({records.filter((r) => r.status === 'Alfa').length})
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">NISN</th>
              <th className="py-3 px-4">Nama Siswa</th>
              <th className="py-3 px-4 text-center">L/P</th>
              <th className="py-3 px-4">Waktu</th>
              <th className="py-3 px-4">Status Presensi</th>
              <th className="py-3 px-4">Bukti Surat</th>
              <th className="py-3 px-4">Catatan Guru</th>
              <th className="py-3 px-4 text-right">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Tidak ada data siswa yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => {
                const isDropdownOpen = activeDropdownId === record.id;

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {record.studentNisn}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {record.studentName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          record.gender === 'L'
                            ? 'bg-blue-100 text-[#1E3A8A]'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {record.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{record.time || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      {record.letterAttachment ? (
                        <button
                          onClick={() => onViewLetter(record)}
                          className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#1E3A8A] hover:bg-blue-100 transition border border-blue-200"
                        >
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>Lihat Surat</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {record.note || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* Inline Status Toggle Buttons */}
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveDropdownId(isDropdownOpen ? null : record.id)
                          }
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                        >
                          <Edit3 className="h-3 w-3 text-slate-400" />
                          <span>Ubah Status</span>
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </button>

                        {/* Dropdown Menu for Quick Status Swap */}
                        {isDropdownOpen && (
                          <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg bg-white p-1 shadow-lg ring-1 ring-black/5 border border-slate-200">
                            {statusOptions.map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  onStatusChange(record.id, st);
                                  setActiveDropdownId(null);
                                }}
                                className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-semibold transition ${
                                  record.status === st
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <span>{st}</span>
                                {record.status === st && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Ringkasan Presensi Hari Ini:</span>
          <span>{records.filter((r) => r.status === 'Hadir').length} Hadir</span>
          <span>•</span>
          <span>{records.filter((r) => r.status === 'Sakit').length} Sakit</span>
          <span>•</span>
          <span>{records.filter((r) => r.status === 'Izin').length} Izin</span>
          <span>•</span>
          <span className="font-bold text-red-600">
            {records.filter((r) => r.status === 'Alfa').length} Alfa
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Data tersinkronisasi otomatis dengan server SMAN 1 Seputih Banyak
        </div>
      </div>
    </div>
  );
};

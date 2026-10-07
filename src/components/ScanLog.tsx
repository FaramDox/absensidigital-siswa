import React, { useState } from 'react';
import { QRScanLogEntry } from '../types';
import {
  QrCode,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Copy,
  Download,
  Check,
  ShieldCheck,
  Filter,
  Sparkles,
} from 'lucide-react';

interface ScanLogProps {
  logs: QRScanLogEntry[];
  classNameTitle?: string;
}

export const ScanLog: React.FC<ScanLogProps> = ({
  logs,
  classNameTitle = 'XI MIPA 1',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [punctualityFilter, setPunctualityFilter] = useState<'All' | 'tepat_waktu' | 'terlambat'>('All');
  const [copied, setCopied] = useState(false);

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.studentNisn.includes(searchTerm);
    const matchesFilter = punctualityFilter === 'All' || log.punctuality === punctualityFilter;
    return matchesSearch && matchesFilter;
  });

  // KPI Calculations
  const totalScans = logs.length;
  const onTimeCount = logs.filter((l) => l.punctuality === 'tepat_waktu').length;
  const lateCount = logs.filter((l) => l.punctuality === 'terlambat').length;
  const earliestScan = logs.length > 0 ? logs[logs.length - 1].timestamp : '-';
  const latestScan = logs.length > 0 ? logs[0].timestamp : '-';

  const handleCopyLogs = () => {
    const textData = logs
      .map(
        (l, i) =>
          `${i + 1}. [${l.timestamp}] ${l.studentName} (${l.studentNisn}) - ${l.punctuality.toUpperCase()}`
      )
      .join('\n');
    navigator.clipboard.writeText(textData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = 'No,Waktu Scan,NISN,Nama Siswa,Kelas,Jenis Kelamin,Status Ketepatan,Token Terverifikasi\n';
    const rows = logs
      .map(
        (l, i) =>
          `${i + 1},"${l.timestamp}","${l.studentNisn}","${l.studentName}","${l.className}","${l.gender}","${l.punctuality}","${l.verifiedToken}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Scan_Log_Presensi_${classNameTitle.replace(/\s+/g, '_')}_2026-10-07.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Header & Live Stream Indicator */}
      <div className="border-b border-slate-200 bg-slate-50/80 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#059669] shadow-xs">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Scan Log Presensi QR Real-Time
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-[#059669] animate-ping" />
                  Live Feed Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar siswa yang telah berhasil memindai barcode QR hari ini di kelas {classNameTitle}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              title="Salin rekap log presensi"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin!' : 'Salin Log'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-900 transition"
              title="Unduh scan log dalam format CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Badges Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
            <span className="text-slate-500 block text-[11px]">Total Scan Masuk</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900">{totalScans}</span>
              <span className="text-slate-400">Siswa</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 shadow-2xs">
            <span className="text-emerald-700 block text-[11px] font-semibold">Tepat Waktu (&le; 07.15 WIB)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-emerald-800">{onTimeCount}</span>
              <span className="text-emerald-600">Siswa</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3 shadow-2xs">
            <span className="text-amber-800 block text-[11px] font-semibold">Terlambat (&gt; 07.15 WIB)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-amber-900">{lateCount}</span>
              <span className="text-amber-700">Siswa</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 shadow-2xs">
            <span className="text-blue-800 block text-[11px] font-semibold">Waktu Scan Terkini</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black font-mono text-[#1E3A8A]">{latestScan}</span>
            </div>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NISN siswa..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] hidden md:inline">Filter:</span>
            <button
              onClick={() => setPunctualityFilter('All')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                punctualityFilter === 'All'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua ({logs.length})
            </button>
            <button
              onClick={() => setPunctualityFilter('tepat_waktu')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                punctualityFilter === 'tepat_waktu'
                  ? 'bg-[#059669] text-white'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Tepat Waktu ({onTimeCount})
            </button>
            <button
              onClick={() => setPunctualityFilter('terlambat')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                punctualityFilter === 'terlambat'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Terlambat ({lateCount})
            </button>
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-100/70 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Waktu Presisi (Entry)</th>
              <th className="py-3 px-4">Nama Siswa</th>
              <th className="py-3 px-4">NISN</th>
              <th className="py-3 px-4 text-center">L/P</th>
              <th className="py-3 px-4">Ketepatan Waktu</th>
              <th className="py-3 px-4">Token QR Terverifikasi</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  Belum ada log pemindaian QR yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => {
                const isOnTime = log.punctuality === 'tepat_waktu';

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* Exact Timestamp */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {log.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                        {log.studentName}
                      </div>
                      <span className="text-[10px] text-slate-400">{log.className}</span>
                    </td>

                    {/* NISN */}
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                      {log.studentNisn}
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          log.gender === 'L'
                            ? 'bg-blue-100 text-[#1E3A8A]'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {log.gender}
                      </span>
                    </td>

                    {/* Punctuality Badge */}
                    <td className="py-3 px-4">
                      {isOnTime ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Tepat Waktu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          Terlambat
                        </span>
                      )}
                    </td>

                    {/* Verified Token */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                        {log.verifiedToken}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Hadir</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>Sesi: Jam Masuk Pagi (07.00 - 07.25 WIB)</span>
          <span>•</span>
          <span>SOP SMAN 1 Seputih Banyak</span>
        </div>
        <div className="text-slate-400">
          Timestamp dicatat berdasarkan sinkronisasi server resmi
        </div>
      </div>
    </div>
  );
};

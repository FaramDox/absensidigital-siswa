import React from 'react';
import { AttendanceRecord, LeaveRequest } from '../types';
import { X, FileText, CheckCircle, Clock, XCircle, ExternalLink, Download } from 'lucide-react';

interface LetterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: AttendanceRecord | null;
  leaveRequest?: LeaveRequest | null;
}

export const LetterPreviewModal: React.FC<LetterPreviewModalProps> = ({
  isOpen,
  onClose,
  record,
  leaveRequest,
}) => {
  if (!isOpen || (!record && !leaveRequest)) return null;

  const title = record
    ? `Bukti Surat: ${record.studentName}`
    : `Pengajuan Izin: ${leaveRequest?.studentName}`;

  const studentName = record ? record.studentName : leaveRequest?.studentName;
  const nisn = record ? record.studentNisn : leaveRequest?.studentNisn;
  const statusType = record ? record.status : leaveRequest?.type;
  const note = record ? record.note : leaveRequest?.reason;
  const fileName =
    record?.letterAttachment?.fileName || leaveRequest?.letterFileName || 'Surat_Keterangan.pdf';
  const fileUrl =
    record?.letterAttachment?.fileUrl || leaveRequest?.letterAttachmentUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
  const approvalStatus =
    record?.letterAttachment?.status || leaveRequest?.status || 'approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#1E3A8A]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">NISN: {nisn} • Tipe: {statusType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Metadata Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-medium">Siswa:</span>
                <p className="font-bold text-slate-900">{studentName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Status Verifikasi:</span>
                <div className="mt-0.5 flex items-center gap-1.5 font-semibold">
                  {approvalStatus === 'approved' && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                      <CheckCircle className="h-3 w-3" /> Disetujui
                    </span>
                  )}
                  {approvalStatus === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                      <Clock className="h-3 w-3" /> Menunggu Validasi
                    </span>
                  )}
                  {approvalStatus === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[11px]">
                      <XCircle className="h-3 w-3" /> Ditolak
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-medium">Keterangan / Alasan:</span>
                <p className="mt-0.5 italic text-slate-800 bg-white p-2 rounded border border-slate-200">
                  "{note || 'Tidak ada catatan tambahan'}"
                </p>
              </div>
            </div>
          </div>

          {/* Letter Document Preview Area */}
          <div>
            <div className="flex items-center justify-between pb-2 text-xs">
              <span className="font-semibold text-slate-700">Lampiran Dokumen Bukti:</span>
              <span className="text-slate-400 text-[11px]">{fileName}</span>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 text-center group">
              <img
                src={fileUrl}
                alt="Bukti Surat Keterangan"
                className="max-h-72 w-full object-cover rounded-lg shadow-xs"
              />
              <div className="mt-2 flex items-center justify-center gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-900"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka Gambar Ukuran Penuh
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};

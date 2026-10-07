import React from 'react';
import { LeaveRequest } from '../types';
import { X, Check, XCircle, FileText, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: LeaveRequest[];
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, note?: string) => void;
  onViewAttachment: (req: LeaveRequest) => void;
}

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  isOpen,
  onClose,
  requests,
  onApprove,
  onReject,
  onViewAttachment,
}) => {
  if (!isOpen) return null;

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const processedRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#1E3A8A] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Verifikasi Pengajuan Surat Izin & Sakit
              </h3>
              <p className="text-xs text-blue-100">
                Persetujuan surat oleh Wali Kelas / Admin SMAN 1 Seputih Banyak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section: Pending Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Menunggu Verifikasi ({pendingRequests.length})
              </h4>
              <span className="text-xs text-slate-400">Harap segera divalidasi</span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                Semua surat telah diproses. Tidak ada pengajuan yang tertunda.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-bold ${
                              req.type === 'Sakit'
                                ? 'bg-[#0284C7] text-white'
                                : 'bg-[#D97706] text-white'
                            }`}
                          >
                            {req.type}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm">
                            {req.studentName}
                          </h5>
                          <span className="text-xs text-slate-500 font-mono">
                            ({req.studentNisn})
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <p>
                            <span className="font-semibold text-slate-700">Tanggal:</span>{' '}
                            {req.startDate} s/d {req.endDate}
                          </p>
                          <p className="italic bg-white p-2 rounded border border-amber-200/80 text-slate-800">
                            "{req.reason}"
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Diajukan pada: {req.submittedAt}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        {req.letterAttachmentUrl && (
                          <button
                            type="button"
                            onClick={() => onViewAttachment(req)}
                            className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-50"
                          >
                            <FileText className="h-3.5 w-3.5 text-blue-600" />
                            <span>Lihat Surat Bukti</span>
                          </button>
                        )}

                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => onApprove(req.id, 'Disetujui oleh Wali Kelas')}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#059669] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Setujui</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onReject(req.id, 'Surat tidak valid atau tanpa tanda tangan')}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Processed History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Riwayat Terverifikasi Terbaru ({processedRequests.length})
            </h4>

            <div className="space-y-2">
              {processedRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        req.status === 'approved' ? 'bg-[#059669]' : 'bg-[#DC2626]'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-slate-800">
                        {req.studentName} — <span className="text-slate-500 font-normal">{req.type} ({req.startDate})</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Catatan: {req.reviewerNote || (req.status === 'approved' ? 'Disetujui' : 'Ditolak')}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {req.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

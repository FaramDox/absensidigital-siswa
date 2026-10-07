import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SCHOOL_INFO } from '../data/mockData';
import { AttendanceRecord, ClassRoom } from '../types';
import {
  Printer,
  Download,
  X,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassRoom;
  records: AttendanceRecord[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  records,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const hadirCount = records.filter((r) => r.status === 'Hadir').length;
  const sakitCount = records.filter((r) => r.status === 'Sakit').length;
  const izinCount = records.filter((r) => r.status === 'Izin').length;
  const alfaCount = records.filter((r) => r.status === 'Alfa').length;
  const total = records.length || 1;
  const attendanceRate = ((hadirCount / total) * 100).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'No,NISN,Nama Siswa,L/P,Status,Waktu,Catatan\n';
    const rows = records
      .map(
        (r, i) =>
          `${i + 1},"${r.studentNisn}","${r.studentName}","${r.gender}","${r.status}","${r.time || '-'}","${r.note || '-'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Presensi_${currentClass.name}_${SCHOOL_INFO.todayDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setIsGeneratingPdf(true);

    try {
      // 1. Inisialisasi dokumen jsPDF (A4 portrait)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 14;

      // 2. KOP SURAT RESMI (DINAS PENDIDIKAN DAN KEBUDAYAAN)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text('PEMERINTAH PROVINSI LAMPUNG', pageWidth / 2, currentY, { align: 'center' });
      currentY += 4.5;

      doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, currentY, { align: 'center' });
      currentY += 5.5;

      // Nama Sekolah Utama (Bold Navy)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 58, 138); // Primary Navy #1E3A8A
      doc.text('SMA NEGERI 1 SEPUTIH BANYAK', pageWidth / 2, currentY, { align: 'center' });
      currentY += 4.5;

      // Alamat & Kontak Sekolah
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(
        'Jl. Raya Seputih Banyak, Kec. Seputih Banyak, Kab. Lampung Tengah, Prov. Lampung 34156',
        pageWidth / 2,
        currentY,
        { align: 'center' }
      );
      currentY += 3.8;

      doc.text(
        `NPSN: ${SCHOOL_INFO.npsn}  |  Akreditasi: ${SCHOOL_INFO.akreditasi}  |  Email: ${SCHOOL_INFO.email}`,
        pageWidth / 2,
        currentY,
        { align: 'center' }
      );
      currentY += 3.5;

      // Garis Pembatas Kop Surat Ganda (Garis tebal atas, tipis bawah)
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.8);
      doc.line(14, currentY, pageWidth - 14, currentY);
      currentY += 1;
      doc.setDrawColor(100, 116, 139);
      doc.setLineWidth(0.2);
      doc.line(14, currentY, pageWidth - 14, currentY);
      currentY += 6;

      // 3. JUDUL LAPORAN
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('LAPORAN REKAPITULASI PRESENSI SISWA', pageWidth / 2, currentY, { align: 'center' });
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Periode: Bulan Oktober 2026 • Semester ${SCHOOL_INFO.semester} TA ${SCHOOL_INFO.academicYear}`,
        pageWidth / 2,
        currentY,
        { align: 'center' }
      );
      currentY += 5;

      // 4. METADATA KELAS DAN STATISTIK RINGKASAN DALAM KOTAK
      const boxStartY = currentY;
      const boxHeight = 16;
      doc.setFillColor(248, 250, 252); // Neutral background #F8FAFC
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, boxStartY, pageWidth - 28, boxHeight, 2, 2, 'FD');

      // Kolom Kiri Metadata
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'bold');
      doc.text(`Kelas: `, 18, boxStartY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`${currentClass.name} (${currentClass.major})`, 30, boxStartY + 5);

      doc.setFont('helvetica', 'bold');
      doc.text(`Wali Kelas: `, 18, boxStartY + 10.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`${currentClass.homeroomTeacher} (NIP: ${currentClass.teacherNip})`, 37, boxStartY + 10.5);

      // Kolom Kanan Metadata
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Siswa: `, 115, boxStartY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text(`${records.length} Siswa`, 135, boxStartY + 5);

      doc.setFont('helvetica', 'bold');
      doc.text(`Tingkat Kehadiran: `, 115, boxStartY + 10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 138);
      doc.text(`${attendanceRate}%`, 146, boxStartY + 10.5);

      // Rincian Status Badge text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `[ Hadir: ${hadirCount} | Sakit: ${sakitCount} | Izin: ${izinCount} | Alfa: ${alfaCount} ]`,
        158,
        boxStartY + 10.5
      );

      currentY = boxStartY + boxHeight + 4;

      // 5. TABEL PRESENSI MENGGUNAKAN JSPDF-AUTOTABLE
      const tableData = records.map((r, index) => [
        (index + 1).toString(),
        r.studentNisn,
        r.studentName,
        r.gender,
        r.status,
        r.time || '-',
        r.note || '-',
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['No', 'NISN', 'Nama Siswa', 'L/P', 'Status', 'Waktu', 'Catatan / Keterangan']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 58, 138], // Navy #1E3A8A
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          cellPadding: 2,
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
          cellPadding: 1.8,
          valign: 'middle',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // #F8FAFC
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { halign: 'center', cellWidth: 24, font: 'courier' },
          2: { halign: 'left', cellWidth: 46, fontStyle: 'bold' },
          3: { halign: 'center', cellWidth: 10 },
          4: { halign: 'center', cellWidth: 20 },
          5: { halign: 'center', cellWidth: 22 },
          6: { halign: 'left' },
        },
        didParseCell: function (data) {
          // Highlight status cell text color
          if (data.section === 'body' && data.column.index === 4) {
            const val = data.cell.raw;
            if (val === 'Hadir') {
              data.cell.styles.textColor = [5, 150, 105]; // #059669
              data.cell.styles.fontStyle = 'bold';
            } else if (val === 'Sakit') {
              data.cell.styles.textColor = [2, 132, 199]; // #0284C7
              data.cell.styles.fontStyle = 'bold';
            } else if (val === 'Izin') {
              data.cell.styles.textColor = [217, 119, 6]; // #D97706
              data.cell.styles.fontStyle = 'bold';
            } else if (val === 'Alfa') {
              data.cell.styles.textColor = [220, 38, 38]; // #DC2626
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { left: 14, right: 14 },
      });

      // 6. LEMBAR PENGESAHAN & TANDA TANGAN DI BAGIAN BAWAH
      // Ambil posisi Y akhir setelah tabel selesai dibuat
      const finalY = (doc as any).lastAutoTable?.finalY || currentY + 100;
      let signatureY = finalY + 8;

      // Jika ruang tanda tangan mepet ke bagian bawah halaman, tambahkan halaman baru
      if (signatureY + 36 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        signatureY = 20;
      }

      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);

      // Tanda Tangan Kiri: Kepala Sekolah
      doc.setFont('helvetica', 'normal');
      doc.text('Mengetahui,', 30, signatureY);
      doc.text('Kepala SMAN 1 Seputih Banyak', 30, signatureY + 4);

      doc.setFont('helvetica', 'bold');
      doc.text(SCHOOL_INFO.principal, 30, signatureY + 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`NIP. ${SCHOOL_INFO.principalNip}`, 30, signatureY + 28);

      // Tanda Tangan Kanan: Wali Kelas
      doc.setFontSize(8);
      doc.text('Seputih Banyak, 7 Oktober 2026', pageWidth - 70, signatureY);
      doc.text(`Wali Kelas ${currentClass.name}`, pageWidth - 70, signatureY + 4);

      doc.setFont('helvetica', 'bold');
      doc.text(currentClass.homeroomTeacher, pageWidth - 70, signatureY + 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`NIP. ${currentClass.teacherNip}`, pageWidth - 70, signatureY + 28);

      // 7. FOOTER HALAMAN DOKUMEN
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Dokumen Resmi Presensi SMAN 1 Seputih Banyak | Halaman ${i} dari ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 6,
          { align: 'center' }
        );
      }

      // 8. SIMPAN / UNDUH FILE PDF
      const fileName = `Laporan_Presensi_${currentClass.name.replace(/\s+/g, '_')}_Oktober_2026.pdf`;
      doc.save(fileName);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Gagal membuat dokumen PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Controls Toolbar (Hidden when printed) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 bg-[#1E3A8A] px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <span className="font-bold text-sm">
              Pratinjau Laporan Presensi Resmi SMAN 1 Seputih Banyak
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol Ekspor PDF via jsPDF */}
            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPdf}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold shadow-md transition ${
                isGeneratingPdf
                  ? 'bg-blue-300 text-blue-900 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Unduh Laporan PDF'}</span>
            </button>

            {/* Tombol Ekspor CSV */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950/70 border border-blue-400/40 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-900 shadow-2xs"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ekspor CSV</span>
            </button>

            {/* Tombol Cetak Browser */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1E3A8A] hover:bg-slate-100 shadow-2xs"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Browser</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifikasi Keberhasilan Ekspor PDF */}
        {pdfSuccess && (
          <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-2 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#059669]" />
              <span>Dokumen PDF berhasil dibuat dan diunduh ke perangkat Anda!</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-mono">Format Resmi Dinas (A4)</span>
          </div>
        )}

        {/* Printable Official Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 print:p-0">
          {/* Formal School Letterhead (KOP SURAT DINAS) */}
          <div className="border-b-2 border-black pb-4 text-center">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-700">
              Pemerintah Provinsi Lampung • Dinas Pendidikan dan Kebudayaan
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900 mt-0.5">
              SMA NEGERI 1 SEPUTIH BANYAK
            </h1>
            <p className="text-[11px] text-slate-600">
              {SCHOOL_INFO.address}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              NPSN: {SCHOOL_INFO.npsn} • Status: {SCHOOL_INFO.akreditasi} • Email: {SCHOOL_INFO.email}
            </p>
          </div>

          {/* Document Title */}
          <div className="mt-5 text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 underline">
              Laporan Rekapitulasi Presensi Harian Siswa
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Hari/Tanggal: <b>{SCHOOL_INFO.todayFormatted}</b> • Semester {SCHOOL_INFO.semester} TA {SCHOOL_INFO.academicYear}
            </p>
          </div>

          {/* Metadata Section */}
          <div className="mt-4 grid grid-cols-2 text-xs border border-slate-300 rounded-lg p-3 bg-slate-50/50">
            <div>
              <p><span className="text-slate-500">Kelas:</span> <b>{currentClass.name}</b></p>
              <p><span className="text-slate-500">Program / Jurusan:</span> <b>{currentClass.major}</b></p>
              <p><span className="text-slate-500">Wali Kelas:</span> <b>{currentClass.homeroomTeacher}</b></p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">Total Siswa Terdaftar:</span> <b>{records.length} Siswa</b></p>
              <p><span className="text-slate-500">Hadir:</span> <b className="text-emerald-700">{hadirCount}</b> | <span className="text-slate-500">S:</span> {sakitCount} | <span className="text-slate-500">I:</span> {izinCount} | <span className="text-slate-500">A:</span> <b className="text-red-700">{alfaCount}</b></p>
              <p><span className="text-slate-500">Persentase Kehadiran:</span> <b className="text-[#1E3A8A] font-bold">{attendanceRate}%</b></p>
            </div>
          </div>

          {/* Table Matrix */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-800 text-center">
                  <th className="border border-slate-300 p-2 w-10">No</th>
                  <th className="border border-slate-300 p-2 text-left w-24">NISN</th>
                  <th className="border border-slate-300 p-2 text-left">Nama Siswa</th>
                  <th className="border border-slate-300 p-2 w-12">L/P</th>
                  <th className="border border-slate-300 p-2 w-20">Status</th>
                  <th className="border border-slate-300 p-2 w-24">Waktu</th>
                  <th className="border border-slate-300 p-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id} className="text-slate-800 hover:bg-slate-50">
                    <td className="border border-slate-300 p-1.5 text-center font-medium">{i + 1}</td>
                    <td className="border border-slate-300 p-1.5 font-mono text-[11px]">{r.studentNisn}</td>
                    <td className="border border-slate-300 p-1.5 font-semibold">{r.studentName}</td>
                    <td className="border border-slate-300 p-1.5 text-center">{r.gender}</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold">
                      <span
                        className={
                          r.status === 'Hadir'
                            ? 'text-emerald-700'
                            : r.status === 'Sakit'
                            ? 'text-sky-700'
                            : r.status === 'Izin'
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-600">{r.time || '-'}</td>
                    <td className="border border-slate-300 p-1.5 text-[11px] text-slate-600">{r.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature Area */}
          <div className="mt-8 grid grid-cols-2 text-xs text-slate-800 pt-4">
            <div className="text-center">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala SMAN 1 Seputih Banyak</p>
              <div className="h-16" />
              <p className="font-bold underline">{SCHOOL_INFO.principal}</p>
              <p className="text-[11px] text-slate-500">NIP. {SCHOOL_INFO.principalNip}</p>
            </div>

            <div className="text-center">
              <p>Seputih Banyak, 7 Oktober 2026</p>
              <p className="font-semibold">Wali Kelas {currentClass.name}</p>
              <div className="h-16" />
              <p className="font-bold underline">{currentClass.homeroomTeacher}</p>
              <p className="text-[11px] text-slate-500">NIP. {currentClass.teacherNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

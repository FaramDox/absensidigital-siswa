## 🚀 Demo

🌐 **Demo aplikasi:** https://1dashboard-absensi-siswa-sman-1-seputih-banyak-8500.ai.studio

Silakan buka link di atas untuk mencoba versi demo **Dashboard Absensi Siswa SMAN 1 Seputih Banyak** secara langsung.

# 📊 Dashboard Absensi Siswa SMAN 1 Seputih Banyak

Sistem informasi presensi siswa berbasis web yang dirancang untuk membantu sekolah dalam melakukan pencatatan, pemantauan, dan pengelolaan kehadiran siswa secara digital.

Aplikasi ini menyediakan dashboard berbeda berdasarkan peran pengguna, yaitu **Admin Sekolah, Wali Kelas/Guru, Siswa, dan Orang Tua/Wali**. Sistem juga dilengkapi dengan simulasi presensi menggunakan **QR Code dinamis**, pengajuan izin/sakit, monitoring kehadiran, log pemindaian QR, serta laporan dan statistik kehadiran.

> **Catatan:** Proyek ini merupakan aplikasi demo/prototipe. Data siswa, data presensi, dan beberapa proses autentikasi masih menggunakan data simulasi serta `localStorage` browser, bukan database produksi.

---

## ✨ Fitur Utama

### 👨‍💼 Admin Sekolah
- Dashboard overview statistik presensi sekolah.
- Monitoring status presensi setiap kelas.
- Melihat persentase kehadiran siswa.
- Melihat jumlah siswa hadir, sakit, izin, dan alfa.
- Monitoring kecepatan pengumpulan presensi wali kelas.
- Melihat detail presensi kelas.

### 👨‍🏫 Wali Kelas / Guru
- Melihat daftar presensi siswa dalam kelas.
- Input presensi siswa secara cepat.
- Verifikasi dan pengelolaan pengajuan izin/sakit.
- Melihat tren kehadiran mingguan dan bulanan.
- Menampilkan QR Code presensi untuk siswa.
- Melihat log pemindaian QR secara real-time pada simulasi aplikasi.
- Mengekspor log scan QR ke format CSV.
- Melihat preview surat/keterangan izin atau sakit.

### 🎓 Siswa
- Melihat dashboard kehadiran pribadi.
- Melihat riwayat presensi.
- Mengajukan izin atau sakit.
- Mengunggah/menyertakan informasi surat pendukung pada simulasi pengajuan.
- Melakukan simulasi pemindaian QR presensi.
- Mendapatkan status presensi setelah QR berhasil dipindai.

### 👨‍👩‍👧 Orang Tua / Wali
- Memantau kehadiran siswa.
- Melihat informasi status kehadiran anak.
- Melihat ringkasan presensi siswa.

### 🔐 Presensi QR Dinamis
- Guru menampilkan QR Code presensi melalui layar/proyektor.
- QR Code memiliki token yang dapat diperbarui.
- Tersedia simulasi QR valid dan QR kedaluwarsa.
- Sistem mendemonstrasikan konsep perlindungan terhadap penggunaan screenshot QR lama.
- Tersedia log pemindaian QR.

### 📈 Dashboard & Laporan
- Kartu statistik presensi.
- Grafik tren kehadiran mingguan.
- Grafik kehadiran bulanan.
- Tabel presensi harian.
- Early warning untuk kondisi kehadiran tertentu.
- Preview dan pembuatan laporan.
- Dukungan ekspor data tertentu ke CSV/PDF sesuai fitur pada aplikasi.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| **React 19** | Membangun antarmuka aplikasi |
| **TypeScript** | Menambahkan type safety pada kode |
| **Vite** | Development server dan proses build |
| **Tailwind CSS** | Styling dan responsive UI |
| **Lucide React** | Ikon antarmuka |
| **Recharts** | Grafik dan visualisasi data presensi |
| **QRCode.react** | Menampilkan QR Code |
| **Motion** | Animasi antarmuka |
| **jsPDF** | Pembuatan dokumen PDF |
| **jsPDF AutoTable** | Membuat tabel pada laporan PDF |
| **Express** | Dependensi pendukung untuk kebutuhan server |
| **localStorage** | Penyimpanan data demo pada browser |

---

## 📁 Struktur Folder

```text
.
├── index.html
├── package.json
├── bun.lock
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    │
    ├── types/
    │   └── index.ts
    │
    ├── data/
    │   └── mockData.ts
    │
    └── components/
        ├── LoginPage.tsx
        ├── Header.tsx
        ├── MetricCard.tsx
        ├── AdminOverviewDashboard.tsx
        ├── DailyAttendanceTable.tsx
        ├── WeeklyChart.tsx
        ├── MonthlyAttendanceChart.tsx
        ├── EarlyWarningWidget.tsx
        ├── ScanLog.tsx
        ├── QuickAttendanceModal.tsx
        ├── LetterPreviewModal.tsx
        ├── LeaveApprovalModal.tsx
        ├── ReportModal.tsx
        ├── TeacherQRModal.tsx
        ├── StudentQRScannerModal.tsx
        ├── StudentPortal.tsx
        └── ParentPortal.tsx
```

---

## 💻 Persyaratan

Sebelum menjalankan proyek, pastikan perangkat sudah memiliki:

- **Node.js** versi yang kompatibel dengan dependency proyek.
- **npm** atau package manager lain seperti Bun.
- Browser modern seperti Google Chrome, Microsoft Edge, atau Mozilla Firefox.

Cek instalasi Node.js dan npm:

```bash
node -v
npm -v
```

---

## 🚀 Instalasi

### 1. Clone repository

Jika proyek sudah diunggah ke GitHub:

```bash
git clone https://github.com/USERNAME/dashboard-absensi-siswa-sman-1-seputih-banyak.git
cd dashboard-absensi-siswa-sman-1-seputih-banyak
```

### 2. Install dependency

Menggunakan npm:

```bash
npm install
```

Atau jika menggunakan Bun:

```bash
bun install
```

### 3. Jalankan aplikasi

Dengan npm:

```bash
npm run dev
```

Dengan Bun:

```bash
bun run dev
```

Setelah server berjalan, buka alamat yang ditampilkan Vite pada terminal, biasanya:

```text
http://localhost:3000
```

---

## 🏗️ Build untuk Production

Untuk membuat build production:

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

Untuk memeriksa tipe TypeScript:

```bash
npm run lint
```

---

## 🔑 Konfigurasi Environment

Proyek menyediakan file `.env.example` sebagai contoh konfigurasi environment.

Salin menjadi `.env.local` jika konfigurasi environment diperlukan:

```bash
cp .env.example .env.local
```

Variabel yang tersedia pada contoh konfigurasi:

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

> **Catatan:** Jangan memasukkan API key atau credential rahasia ke repository publik. Pada versi aplikasi saat ini, sebagian besar fitur dashboard menggunakan data simulasi lokal.

---

## 👤 Role Pengguna

Aplikasi menyediakan empat role utama:

| Role | Fungsi |
|---|---|
| **Admin Sekolah** | Monitoring statistik dan status presensi sekolah |
| **Wali Kelas / Guru** | Mengelola presensi kelas dan QR Code |
| **Siswa** | Melihat presensi dan mengajukan izin/sakit |
| **Orang Tua / Wali** | Memantau kehadiran siswa |

Pada halaman login tersedia mode/demo role sehingga aplikasi dapat langsung dicoba tanpa sistem autentikasi backend.

---

## 🧪 Data Demo

Data awal aplikasi berada pada:

```text
src/data/mockData.ts
```

Data tersebut digunakan untuk mengisi:

- Informasi sekolah.
- Daftar kelas.
- Data siswa.
- Data presensi.
- Tren presensi mingguan.
- Data presensi bulanan.
- Pengajuan izin/sakit.
- Log pemindaian QR.

Perubahan data demo disimpan pada `localStorage` browser agar tetap tersedia ketika halaman dimuat ulang.

---

## 🔄 Reset Data Demo

Aplikasi memiliki mekanisme reset data demo yang menghapus data yang tersimpan di `localStorage` dan mengembalikannya ke data awal aplikasi.

Jika ingin membersihkan data secara manual, buka **Developer Tools → Application/Storage → Local Storage**, kemudian hapus data yang menggunakan key berikut:

```text
sman1_att_auth_user
sman1_att_role
sman1_att_records
sman1_att_requests
sman1_att_students
sman1_att_scan_logs
```

---

## 📱 Alur Presensi QR

Alur simulasi presensi QR pada aplikasi:

```text
Guru/Wali Kelas
      │
      ▼
Menampilkan QR Code Dinamis
      │
      ▼
Siswa Membuka Pemindai QR
      │
      ▼
QR Code Dipindai
      │
      ├── Token Valid ──────► Presensi Berhasil
      │
      └── Token Kedaluwarsa ► Pemindaian Ditolak
                                  │
                                  ▼
                         Scan Ulang QR Terbaru
```

Konsep QR dinamis digunakan untuk mendemonstrasikan pencegahan penggunaan screenshot atau kode QR lama. Implementasi pada proyek ini masih berupa **simulasi frontend**, sehingga belum dapat dianggap sebagai sistem keamanan presensi produksi.

---

## 🗃️ Penyimpanan Data

Versi demo menggunakan browser `localStorage` untuk menyimpan beberapa state aplikasi.

Contoh data yang disimpan:

```text
Data pengguna yang sedang login
Data siswa
Data presensi
Data pengajuan izin/sakit
Log pemindaian QR
```

Karena menggunakan `localStorage`, data hanya tersimpan pada browser/perangkat yang digunakan dan belum tersinkronisasi dengan server atau database.

---

## 🔒 Catatan Keamanan

Proyek ini sebaiknya dianggap sebagai **prototype/demo aplikasi akademik**, bukan sistem produksi.

Untuk implementasi nyata di sekolah, disarankan menambahkan:

- Backend/API.
- Database terpusat.
- Autentikasi dan otorisasi berbasis role.
- Password yang di-hash.
- Validasi server-side.
- HTTPS.
- Token QR yang dibuat dan divalidasi di server.
- Expiration token di sisi server.
- Audit log.
- Backup database.
- Manajemen hak akses data siswa dan orang tua.
- Perlindungan data pribadi siswa.

---

## 🎯 Tujuan Pengembangan

Aplikasi ini dikembangkan sebagai konsep **sistem informasi presensi siswa digital** yang dapat membantu:

1. Mengurangi pencatatan presensi secara manual.
2. Mempermudah wali kelas dalam mengelola kehadiran siswa.
3. Membantu sekolah memantau statistik kehadiran.
4. Memberikan akses kepada siswa untuk melihat riwayat presensi.
5. Membantu orang tua memantau kehadiran anak.
6. Mendemonstrasikan penggunaan QR Code untuk presensi digital.
7. Menyediakan data dan visualisasi yang lebih mudah dipahami.

---

## 📌 Status Proyek

**Status:** Prototype / Demo Akademik

Fitur utama antarmuka dan simulasi alur presensi sudah tersedia. Pengembangan lanjutan dapat dilakukan pada sisi backend, database, autentikasi, integrasi kamera QR sebenarnya, dan deployment production.

---

## 👨‍💻 Pengembang

**Damar Adin Firdaus**

Mahasiswa Program Studi **Teknologi Rekayasa Perangkat Lunak**

Proyek ini dibuat sebagai bagian dari pengembangan dan pembelajaran aplikasi berbasis web.

---

## 📄 Lisensi

Proyek menggunakan komponen dan library open-source yang tercantum pada `package.json`. Silakan menyesuaikan lisensi proyek sesuai kebutuhan apabila aplikasi akan dikembangkan atau didistribusikan secara publik.

---

<div align="center">

**Dashboard Absensi Siswa SMAN 1 Seputih Banyak**  
*Digital Attendance • School Dashboard • QR Attendance*

</div>

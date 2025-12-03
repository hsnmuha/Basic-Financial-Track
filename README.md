# Catat.in - Aplikasi Pencatat Keuangan Pribadi

**Catat.in** adalah aplikasi web sederhana namun *powerful* untuk mencatat dan memantau keuangan pribadi Anda. Dengan antarmuka yang bersih dan mudah digunakan, aplikasi ini membantu Anda melacak pendapatan dan pengeluaran, serta menyimpan bukti transaksi secara digital.

![Catat.in Header](Header.png)

## 📋 Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur untuk memudahkan manajemen keuangan Anda:

*   **Pencatatan Transaksi Mudah**: Tambahkan pendapatan atau pengeluaran dengan cepat melalui formulir yang intuitif.
*   **Kategori Transaksi**: Kelompokkan transaksi Anda berdasarkan kategori (Makanan, Transportasi, Gaji, Investasi, dll).
*   **Upload & Edit Struk**: Unggah foto struk/bukti transaksi. Dilengkapi dengan fitur **editor gambar** bawaan untuk memutar (rotate) foto sebelum disimpan.
*   **Ringkasan Keuangan**: Lihat total pendapatan, pengeluaran, dan saldo bersih secara *real-time*.
*   **Filter & Pencarian Canggih**:
    *   Cari transaksi berdasarkan deskripsi atau kategori.
    *   Filter berdasarkan Tahun dan Bulan.
    *   Filter berdasarkan Rentang Tanggal (Mulai - Sampai).
*   **Ekspor Laporan PDF**: Unduh laporan keuangan Anda dalam format PDF dengan satu klik.
*   **Cloud Storage**: Data tersimpan aman di Cloud menggunakan **Supabase**, sehingga dapat diakses dari perangkat mana saja.
*   **PWA Ready**: Dapat diinstal sebagai aplikasi di perangkat mobile (Progressive Web App).

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan teknologi web modern tanpa framework yang berat (*Vanilla JS*), menjadikannya ringan dan cepat:

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+).
*   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL & Storage).
*   **Libraries**:
    *   [SweetAlert2](https://sweetalert2.github.io/): Untuk notifikasi dan modal dialog yang cantik.
    *   [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/): Untuk fitur ekspor ke PDF.
    *   [SortableJS](https://sortablejs.github.io/Sortable/): (Jika digunakan untuk drag-and-drop).

## 📂 Struktur Proyek

Berikut adalah struktur file utama dalam proyek ini:

```
/
├── index.html          # Halaman utama aplikasi
├── app.js              # Logika utama aplikasi (CRUD, Supabase, UI)
├── style.css           # Styling dan tata letak
├── service-worker.js   # Script untuk kemampuan PWA (Offline support)
├── manifest.json       # Konfigurasi instalasi PWA
├── Header.png          # Gambar header untuk README
└── README.md           # Dokumentasi proyek ini
```

## 🚀 Cara Menjalankan

1.  **Clone Repository** (atau download ZIP):
    ```bash
    git clone https://github.com/username/catat-in.git
    ```
2.  **Buka Aplikasi**:
    Cukup buka file `index.html` di browser modern Anda (Chrome, Firefox, Edge).
    > **Catatan**: Karena kebijakan keamanan browser (CORS) dan modul ES6, disarankan untuk menjalankannya menggunakan local server (seperti Live Server di VS Code) daripada membuka file secara langsung (`file:///`).

3.  **Konfigurasi Supabase**:
    Aplikasi ini menggunakan Supabase yang sudah terkonfigurasi di `app.js`. Jika Anda ingin menggunakan database Anda sendiri:
    *   Buat proyek baru di [Supabase](https://supabase.com/).
    *   Buat tabel `transaksi` dengan kolom: `id`, `tanggal`, `jenis`, `kategori`, `jumlah`, `deskripsi`, `gambar`.
    *   Buat bucket storage bernama `bukti_transaksi`.
    *   Update `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di file `app.js`.

## 📱 Instalasi di HP (PWA)

1.  Buka aplikasi di browser HP (Chrome untuk Android, Safari untuk iOS).
2.  Ketuk menu browser (titik tiga atau tombol share).
3.  Pilih **"Tambahkan ke Layar Utama"** (Add to Home Screen).
4.  Aplikasi akan muncul seperti aplikasi native di HP Anda.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat *Pull Request* atau laporkan *Issue* jika Anda menemukan bug atau memiliki ide fitur baru.

---
Dibuat dengan ❤️ untuk manajemen keuangan yang lebih baik.

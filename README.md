# 💰 Personal Finance Tracker (Pelacak Keuangan Pribadi)

> Aplikasi web sederhana dan profesional untuk mencatat pemasukan dan pengeluaran pribadi.

---

## ✨ Tentang Proyek

**Personal Finance Tracker** adalah solusi berbasis web yang dirancang untuk membantu Anda mengelola dan melacak keuangan pribadi secara efektif. Proyek ini dibangun dengan fokus pada antarmuka yang **simpel, bersih, dan profesional**, memastikan pengalaman pengguna yang intuitif.

### 🚀 Fitur Utama

* **Pencatatan Transaksi Cepat:** Catat pemasukan dan pengeluaran Anda dengan mudah.
* **Ringkasan Keuangan:** Lihat total pemasukan, pengeluaran, dan saldo bersih Anda secara instan.
* **Filter Transaksi:** Cari dan filter transaksi berdasarkan periode atau kata kunci.
* **Akses Multi-Perangkat:** Data keuangan Anda terpusat di **Google Spreadsheet** pribadi, memungkinkan Anda mengakses catatan dari perangkat manapun.
* **Integrasi API:** Menggunakan API kustom untuk menghubungkan aplikasi web secara aman dengan data di Spreadsheet Anda.
* **Tampilan Responsif:** Dirancang agar terlihat bagus dan berfungsi optimal di berbagai ukuran layar.

---

## 📸 Tampilan Aplikasi (Screenshots)

Berikut adalah beberapa tampilan dari aplikasi Personal Finance Tracker:

### Menambah Transaksi Baru
Ini adalah langkah awal untuk mencatat transaksi baru, di mana Anda bisa memilih tanggal dan jenis transaksi (Pendapatan/Pengeluaran).

http://googleusercontent.com/image_generation_content/1

 

### Daftar Transaksi
Setelah data tersedia, Anda dapat melihat daftar semua transaksi, mencari, memfilter berdasarkan periode, serta melihat ringkasan keuangan dan opsi untuk mengunduh laporan.

http://googleusercontent.com/image_generation_content/2

 ---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi web dasar dan andal:

* **HTML5:** Untuk struktur dasar konten.
* **CSS3:** Untuk gaya, tata letak, dan memastikan tampilan yang profesional.
* **JavaScript (ES6+):** Untuk fungsionalitas inti, logika aplikasi, dan manajemen koneksi API.

### Integrasi Data

* **Google Spreadsheet:** Digunakan sebagai database backend yang fleksibel dan mudah diakses.
* **Custom API:** Jembatan penghubung (misalnya: Google Apps Script atau solusi API *proxy* lainnya) yang memungkinkan aplikasi web berkomunikasi dengan data Spreadsheet.

---

## 💻 Instalasi dan Penggunaan

### Prasyarat

Sebelum menjalankan proyek, pastikan Anda memiliki:

1.  Akses ke Google Spreadsheet pribadi untuk menyimpan data.
2.  Sebuah **API Endpoint** yang telah dikonfigurasi (misalnya, menggunakan Google Apps Script) yang dapat **membaca** dan **menulis** data ke Spreadsheet tersebut.

### Langkah-Langkah

1.  **Clone Repositori:**
    ```bash
    git clone [LINK_REPOSITORI_ANDA]
    cd personal-finance-tracker
    ```

2.  **Konfigurasi API:**
    * Buka file `script.js` (atau file konfigurasi data Anda).
    * Ganti *placeholder* `[URL_API_ANDA]` dengan URL API Endpoint yang telah Anda siapkan.

    ```javascript
    const API_ENDPOINT = '[URL_API_ANDA]'; 
    // ... kode lainnya
    ```

3.  **Jalankan Aplikasi:**
    * Cukup buka file `index.html` di *browser* Anda untuk mulai menggunakan aplikasi, atau *deploy* ke layanan *hosting* statis (seperti GitHub Pages atau Netlify).

---

## 🤝 Kontribusi

Proyek ini masih dalam pengembangan (atau terima kontribusi dari siapa saja!). Jika Anda ingin berkontribusi, silakan:

1.  *Fork* repositori ini.
2.  Buat *branch* fitur baru (`git checkout -b fitur/nama-fitur`).
3.  *Commit* perubahan Anda (`git commit -m 'Tambahkan Fitur X'`).
4.  *Push* ke *branch* Anda (`git push origin fitur/nama-fitur`).
5.  Buka *Pull Request*.

---

## 📝 Lisensi

Proyek ini bersifat open-source dan dirilis di bawah lisensi MIT License.
Kamu bebas memodifikasi, menyalin, dan mengembangkan proyek ini untuk keperluan pribadi.

***

_Dibuat dengan ❤️ oleh [Nama/Username GitHub Anda]_

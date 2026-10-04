# 🛍️ Ghanimah POS

Aplikasi *Point of Sales* (POS) moderen dan pintar yang dirancang khusus untuk toko busana muslimah. Proyek ini dibangun dengan fokus pada performa yang cepat, akurasi akuntansi (algoritma FIFO untuk stok), dan kemudahan penggunaan kasir.

## 🚀 Teknologi yang Digunakan

- **Framework:** [SvelteKit 2](https://svelte.dev/)
- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Database:** PostgreSQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Autentikasi:** [Better Auth](https://better-auth.com/)
- **Styling & UI:** Tailwind CSS & [Shadcn-Svelte](https://www.shadcn-svelte.com/)

## ✨ Fitur Utama

- **Multi-Role Authentication:** Pemisahan hak akses antara **Admin (Pemilik)** dan **Kasir**.
- **Transaksi Cepat (POS):** Layar kasir responsif yang mendukung pemindai *barcode* (*barcode scanner friendly*).
- **Akuntansi FIFO (First-In, First-Out):** Mengelola harga pokok penjualan (HPP) secara akurat dengan selalu mengalokasikan / memotong stok dari barang yang paling lama masuk terlebih dahulu.
- **Manajemen Voucher Cerdas:** Pembuatan diskon nominal atau persentase, dengan opsi pembatasan minimal belanja dan limitasi pada produk/merek tertentu.
- **Cetak Nota & Laporan PDF:** Pembuatan otomatis struk (nota) transaksi cetak serta ekspor Laporan Pendapatan berkala ke dalam format PDF.

---

## 💻 Panduan Instalasi (Development)

### 1. Prasyarat (*Prerequisites*)
Pastikan Anda sudah menginstal **PostgreSQL** dan service database-nya sudah berjalan.
Selain itu, proyek ini mutlak membutuhkan **Bun**. Cara menginstalnya:
- **Pengguna Windows (PowerShell):**
  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```
- **Pengguna macOS / Linux (Terminal):**
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

### 2. Kloning Proyek & Instalasi Dependensi
Buka terminal Anda, lalu jalankan:
```bash
git clone <url-repository-anda>
cd POS
bun install
```

### 3. Konfigurasi Lingkungan (Environment)
Buat file bernama `.env` di folder utama proyek (root), dan isikan variabel berikut menyesuaikan dengan kredensial PostgreSQL Anda:
```env
# Contoh koneksi PostgreSQL lokal
DATABASE_URL="postgresql://postgres:password_postgres_anda@localhost:5432/ghanimah_pos"

# Secret untuk session & JWT (Ketik acak)
BETTER_AUTH_SECRET="rahasia_super_aman_123"

# URL base aplikasi (Diperlukan oleh Better Auth)
ORIGIN="http://localhost:5173"
```
*(Catatan: Pastikan Anda telah membuat database kosong bernama `ghanimah_pos` di PostgreSQL Anda terlebih dahulu).*

### 4. Migrasi Database & Seeding
Sinkronkan skema database Drizzle ke PostgreSQL dan masukkan (*seed*) data awal untuk presentasi/uji coba:
```bash
# Melakukan push skema tabel ke database
bun run db:push

# Mengisi database dengan akun admin, dummy data produk, dan demo Voucher FIFO
bun run seed
```

### 5. Menjalankan Aplikasi
Mulai *server development*:
```bash
bun run dev
```
Buka browser Anda dan akses **`http://localhost:5173`**.

---

## 🔐 Akun Default (Hasil Seeding)
Jika Anda telah menjalankan script seed di atas, sistem telah membuatkan satu akun Admin awal:
- **Username:** `admin`
- **Password:** `password123`

Dari *Dashboard Admin*, Anda bisa langsung menuju **Manajemen Kasir** untuk menambahkan akun karyawan Anda.

---

### 📝 Catatan untuk Presentasi Mata Kuliah
Jika Anda mendemokan *Algoritma FIFO*, Anda dapat langsung melihat riwayat **Sisa Stok** pada halaman Riwayat Stok di tab Admin setelah melakukan checkout suatu produk pada tab Kasir. Sistem didesain untuk tidak menghapus (`DELETE`) tabel barang masuk, melainkan membuat nilai sisa stok menjadi `0` untuk menjaga jejak audit (*audit trail*).

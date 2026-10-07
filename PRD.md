# PRD — TUANMUDA / NUSADIGITAL Creative Agency

**Versi:** 1.0 (Paket A — Vercel Starter Standard)  
**Studio:** Jl. Tuan Guru Umar No. 18, Selong, Lombok Timur, NTB 83612  
**Tagline:** *Solusi Digital & Kreatif Terpercaya di Selong*

---

## 1. Ringkasan Produk

Website resmi, mesin konversi lead bisnis, dan platform Content Management System (CMS) untuk **TUANMUDA / NUSADIGITAL Creative Agency**. Berfungsi memamerkan kapabilitas agensi, paket harga transparan, studi kasus portofolio, alur kerja pengerjaan, dan menangkap calon klien secara otomatis melalui WhatsApp dan formulir database online.

### Tujuan Bisnis:
1. **Lead Generation**: Mengubah traffic lokal (Lombok Timur & sekitarnya) dan nasional menjadi pemesanan jasa dengan konversi tinggi.
2. **Kredibilitas & Trust**: Menampilkan portofolio, bukti sosial (*social proof*), jam operasional studio fisik di Selong, dan 4 pilar standar mutu.
3. **Pemberdayaan UMKM**: Memberikan paket transparan ramah kantong untuk pelaku usaha lokal go-digital.
4. **Full Self-Management**: Pengelola agensi dapat mengubah seluruh konten (judul, narasi, logo, gambar, testimoni, notifikasi) melalui Panel Admin CMS tanpa perlu menyentuh kode.

---

## 2. Target Pengguna (User Persona)

| Segmen | Profil & Kebutuhan | Fitur Utama yang Digunakan |
|---|---|---|
| **UMKM & Pebisnis Lokal** | Butuh website toko, optimasi Google Maps/SEO, materi iklan video reels medsos untuk menaikkan penjualan. | Tab Paket & Harga, Formulir Booking Konsultasi, WhatsApp Float. |
| **Instansi / Sekolah** | Memerlukan landing page resmi, web portal, atau aplikasi custom bergaransi. | Layanan Ekstensi, Portofolio Case Study, Standar Mutu. |
| **Pengunjung Umum** | Mencari jasa agensi digital tepercaya di area NTB. | Solusi Terpadu, 6 Alur Kerja, Testimoni Klien. |
| **Admin Agensi / Tim Internal** | Mengelola konten website, memperbarui harga, mengunggah foto portofolio, memantau leads konsultasi. | Panel Admin CMS (`/admin`), Storage File Upload, Export/Import Data. |

---

## 3. Fitur Utama & Kebutuhan Sistem

### Halaman Depan (Public Website):
- **Hero Section**: Badge bersinar, judul gradien, teks ketik layanan animasi berputar, penampil harga real-time, dan parallax cursor spotlight.
- **Solusi Terpadu (Services Bar)**: 6 kartu layanan utama dengan hover lift & glowing border.
- **4 Standar Mutu (Why Us)**: Differentiator cards (Berpengalaman, Proses Cepat, Harga Terjangkau, Bergaransi Penuh).
- **Paket Layanan & Harga**: Tab interaktif 2 baris (3 atas, 2 bawah) dengan frame bergaris neon berputar halus:
  - Website & Landing Page (Model Lepas & Model Langganan Hemat)
  - Kelola Sosial Media (Instagram & Facebook, Add-on platform lain)
  - Video & Image Ads (Formula Hook AIDA)
  - Jasa Meta Ads (Scale-Up Conversion & Traffic)
  - Optimasi SEO (Local SEO Google Maps & Ranking)
- **Layanan Ekstensi**: Kartu detail produk tambahan & thumbnail preview.
- **Portofolio Proyek**: Showcase proyek dengan filter kategori, metrik capaian, dan tantangan/solusi.
- **6 Alur Kerja Transparan**: Tahapan proyek terstruktur dari konsultasi hingga serah terima.
- **Testimoni Klien**: Marquee otomatis ulasan bintang 5 klien nyata.
- **Social Proof Alerts**: Pop-up toast berkala pesanan masuk dan konsultasi aktif.
- **Booking Modal & WhatsApp**: Formulir pemesanan langsung tersimpan ke database & terhubung ke WhatsApp Studio.

### Panel Admin CMS (`/admin`):
- **Keamanan Akses**: Proteksi login tersembunyi dengan password `suksesbareng`, sesi tersimpan, dan opsi ganti password.
- **Tombol Tersembunyi**: Pemicu transparan di footer di dekat kalimat hak cipta dengan ikon lock yang muncul saat diarahkan kursor atau di-tap.
- **Manajemen Konten 11 Section**: Brand & Logo, Hero, Solusi Terpadu, Standar Mutu, Paket Harga, Ekstensi, Portofolio, Alur Kerja, Testimoni, Social Proof, Backup.
- **Storage & Upload Gambar**: Dukungan upload gambar ke storage lokal/cloud dan preview seketika.
- **Manajemen Prospek / Booking**: Melihat daftar calon klien yang mengisi formulir konsultasi.
- **Backup & Reset**: Unduh cadangan JSON dan tombol kembalikan ke setelan pabrik.

---

## 4. Metrik Keberhasilan (KPI)
- Page load time < 2.5 detik pada jaringan 4G.
- Skor Google Lighthouse: Performance > 90, Accessibility > 95, Best Practices > 95, SEO 100.
- 0 error pada build lint dan TypeScript compilation.

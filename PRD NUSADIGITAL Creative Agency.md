# PRD — Website NUSADIGITAL Creative Agency

**Versi:** 1.0 (draft) · **Studio:** Selong, Lombok Timur, NTB · **Tagline:** *Digital Rapi, Hasil Nyata.*

---

## 1. Ringkasan

NUSADIGITAL adalah agensi kreatif & jasa digital dengan official studio di Selong, Lombok Timur. Website ini berfungsi sebagai **etalase, mesin lead, dan sistem booking project** untuk semua layanan (web, ads, sosmed, SEO, pelatihan AI, packaging, web app).

**Tujuan bisnis**

1. Mengubah pengunjung menjadi booking konsultasi (target konversi hero → konsultasi ≥ 4%).
2. Membangun kepercayaan: portofolio, garansi, proses transparan.
3. Menangkap segmen UMKM lewat skema diskon khusus.
4. Mengotomatiskan alur dari konsultasi sampai serah terima.

**Nilai jual utama (dipakai di seluruh copy):** Berpengalaman · Proses cepat · Harga terjangkau · Bergaransi · Studio fisik di Lombok Timur.

---

## 2. Target Pengguna

| Segmen | Kebutuhan | Pesan kunci |
| --- | --- | --- |
| UMKM & toko online | Web/landing, iklan, konten produk | "Naik kelas digital tanpa mahal" |
| Brand/bisnis lokal & pariwisata | Web, SEO, Meta Ads, sosmed | "Ditemukan pelanggan di Google & Instagram" |
| Sekolah, instansi, guru | Web app (raport, app guru), pelatihan AI | "Sistem sederhana yang benar-benar dipakai" |
| Individu/komunitas | Workshop & pelatihan AI | "Belajar AI dari dasar, langsung praktik" |

---

## 3. Arah Visual & Motion (mengacu pada 2 gambar referensi)

**Karakter:** *futuristic soft-UI* — cerah, modern, premium tapi ramah.

### Visual

- **Palet:** gradien biru tua → ungu → magenta (hero, seperti referensi 1) dipadukan biru muda/putih bersih (section konten, seperti referensi 2). Aksen CTA: biru elektrik & pink/magenta. Teks gelap navy di atas area terang.
- **Token warna (usulan):** `--navy #1B1F5E`, `--indigo #4B3FD6`, `--violet #8B5CF6`, `--magenta #EC4899`, `--sky #38BDF8`, `--ice #EEF4FF`, `--ink #0F172A`.
- **Ilustrasi:** objek 3D glossy/glass (ponsel, laptop, bola gradien, bentuk blob cair, ikon melayang), bukan stock photo. Dibuat dengan AI image + dirapikan; konsisten satu gaya.
- **Kartu:** radius besar (20–28px), efek **glassmorphism** (blur + border putih transparan), bayangan lembut berwarna (bukan hitam).
- **Latar:** blob gradien besar blur, bintang/sparkle kecil, partikel titik halus.
- **Tipografi:** heading *geometric bold* (Plus Jakarta Sans / Sora), body Inter. Heading besar, baris pendek, kontras jelas.
- **Ikon layanan:** kotak ikon 3D bergradien berbeda per layanan (gaya baris ikon referensi 1).

### Motion (diimplementasi dengan GSAP + ScrollTrigger; smooth scroll Lenis)

| Elemen | Animasi | Detail |
| --- | --- | --- |
| Hero – teks | Reveal per baris | fade + translateY 24px, stagger 0.08s, easing `power3.out`, 0.8s |
| Hero – ilustrasi 3D | Float loop + parallax mouse | naik-turun ±12px, 6s sine; parallax ±20px mengikuti kursor |
| Hero – sparkle/blob | Pulse & drift lambat | opacity 0.4↔1, drift 10–20s |
| Navbar | Glass saat scroll | transparan → blur + border setelah scroll 40px |
| Section masuk | Reveal on scroll | fade + translateY 32px, sekali jalan |
| Grid kartu layanan | Stagger | jeda 0.1s kiri→kanan |
| Hover kartu | Lift + glow | translateY -8px, scale 1.02, shadow berwarna, ikon 3D miring 6° |
| Angka statistik | Count-up | 1.5s saat masuk viewport |
| Portofolio | Hover overlay + zoom gambar 1.06 | tombol "Lihat Project" muncul |
| Testimoni | Carousel geser + fade tepi | auto-play 6s, pause saat hover |
| Proses kerja | Garis progres menggambar | SVG path ter-*draw* mengikuti scroll |
| Tombol CTA | Magnetik + shine | efek kilau lewat saat hover |

**Aturan:** hormati `prefers-reduced-motion` (animasi dimatikan), durasi ≤ 1s, target 60fps, ilustrasi berat dimuat lazy.

---

## 4. Sitemap

1. **Beranda** (landing utama)
2. **Layanan** (hub) → halaman detail per layanan: Web · Video & Image Ads · Kelola Sosmed · SEO · Meta Ads · *Ekstensi:* Workshop AI, Pelatihan Foto/Video AI, Desain Packaging, Web App
3. **Paket & Harga**
4. **Portofolio/Project** (+ detail project)
5. **Promo UMKM**
6. **Proses Kerja**
7. **Tentang & Studio** (alamat Selong, peta, tim)
8. **Blog/Insight** (opsional fase 2, mendukung SEO)
9. **Booking** (form konsultasi → akun client)
10. **Dashboard Client** (status project, invoice, file)
11. **Admin/CMS**

---

## 5. Spesifikasi Section Beranda + Copywriting

### 5.1 Navbar

Logo · Layanan · Paket · Portofolio · Promo UMKM · Tentang · tombol **"Konsultasi Gratis"** (pill, gradien magenta).

### 5.2 Hero (gaya referensi 1: latar gradien biru-ungu, teks kiri, ilustrasi 3D kanan)

- **Badge kecil:** ✦ Official Studio · Selong, Lombok Timur
- **Headline:** *Bisnis Anda Layak Tampil Hebat di Dunia Digital.*
- **Subheadline:** Website, iklan, sosial media, sampai SEO, dikerjakan tim berpengalaman di Lombok. **Cepat, terjangkau, dan bergaransi.**
- **CTA utama:** Konsultasi Gratis → · **CTA sekunder:** Lihat Portofolio
- **Trust chips:** ⚡ Proses Cepat · 🛡️ Bergaransi · 💸 Harga UMKM-Friendly
- **Visual kanan:** laptop 3D menampilkan dashboard, ponsel melayang, ikon iklan/chart/pin lokasi, bola gradien & sparkle (float + parallax).
- **Strip bawah hero (glass):** `50+ Project Selesai` · `Estimasi mulai 3 hari*` · `Garansi Revisi & Perbaikan` · `Studio Fisik di Selong` *(angka diganti data asli)*

### 5.3 Section "Layanan Kami" (gaya baris ikon 3D referensi 1)

**Judul:** *Satu Tim, Semua Kebutuhan Digital Anda.* Kartu glass dengan ikon 3D, judul, 1 kalimat, tautan "Selengkapnya →":

| Layanan | Copy singkat |
| --- | --- |
| Website | Dari landing page sampai web + panel admin. Beli lepas atau langganan. Gratis hosting & custom domain. |
| Video & Image Ads | Iklan yang bikin berhenti scroll dan **bikin beli**, untuk produk digital maupun fisik. |
| Kelola Sosial Media | Konten rutin, desain konsisten, akun hidup. Anda fokus jualan. |
| SEO | Naik ke halaman 1 Google, dapatkan pelanggan yang memang sedang mencari Anda. |
| Meta Ads | Iklan Facebook & Instagram yang terukur, tepat sasaran, hemat budget. |
| Lebih dari itu | Workshop AI, desain packaging, web app sederhana. |

### 5.4 Section "Mengapa NUSADIGITAL?" (kartu fitur 4 kolom, gaya referensi 2)

1. **Berpengalaman** — Sudah menangani berbagai bisnis: kuliner, pariwisata, pendidikan, retail.
2. **Proses Cepat** — Alur jelas, timeline tertulis, progres bisa dipantau.
3. **Harga Terjangkau** — Paket transparan, tanpa biaya tersembunyi, diskon khusus UMKM.
4. **Bergaransi** — Garansi revisi & perbaikan bug sesuai paket. Tenang setelah serah terima.
5. **Studio Nyata di Selong** — Bisa bertemu langsung, konsultasi tatap muka, bukan agensi "tanpa wajah".

### 5.5 Section Website: Pilih Cara Memilikinya

Tab: **Beli Lepas** | **Langganan**

- **Beli Lepas:** bayar sekali, website jadi milik Anda sepenuhnya. Termasuk panduan penggunaan.
- **Langganan:** biaya bulanan ringan, sudah termasuk hosting, perawatan, dan update. Tanpa modal besar di awal.
- **Semua paket:** 🎁 Free Hosting (periode sesuai paket) · 🌐 Custom Domain · 📱 Responsif · 🔍 SEO dasar.
- Pilihan tipe: **Landing Page** · **Company Profile** · **Web + Panel Admin/CMS** (edit konten sendiri tanpa coding).

### 5.6 Section Paket Kelola Sosial Media (3 paket)

|  | **Basic** | **Growth** | **Pro** |
| --- | --- | --- | --- |
| Platform | 1 | 2 | 3 |
| Feed/post per bulan | 8 | 16 | 24 |
| Story/Reels | 4 story | 8 story + 4 reels | 12 story + 8 reels |
| Desain & caption | ✓ | ✓ | ✓ |
| Content plan bulanan | ✓ | ✓ | ✓ |
| Balas komentar/DM | – | ✓ | ✓ prioritas |
| Laporan performa | – | bulanan | bulanan + evaluasi |
| Harga/bulan | Rp \_\_\_ | Rp \_\_\_ | Rp \_\_\_ |

*Jumlah & fitur adalah usulan; ubah sesuai kapasitas tim. Harga diisi admin lewat CMS.*

### 5.7 Section Iklan & Pertumbuhan

Tiga kartu: **Video Ads** (produk digital & fisik) · **Image Ads (Convert Sale)** · **Meta Ads** · **SEO**. Copy: *"Konten bagus tanpa strategi hanya jadi pajangan. Kami buat iklan dan SEO yang diukur dari satu hal: penjualan."* Deliverable ditampilkan: contoh hasil (video 9:16, banner), metrik utama yang dilaporkan (reach, klik, leads, ROAS, posisi keyword).

### 5.8 Section Layanan Ekstensi ("Lebih dari Sekadar Website")

- **Workshop AI Basic** — Umum (kelas kelompok) & Private (1-on-1/tim). Belajar AI untuk kerja & bisnis dari nol.
- **Pelatihan Foto & Video Produk dengan AI** — Produksi konten produk tanpa studio mahal.
- **Desain Packaging** — Kemasan yang menjual dan memperkuat brand.
- **Web App Sederhana** — Aplikasi guru, e-raport, POS kasir, dan sistem custom lainnya.

### 5.9 Section Portofolio (preview 6 project, kartu gaya "Featured Ads" referensi 2)

Filter chip: Semua · Web · Ads · Sosmed · Packaging · Web App. Kartu: gambar, label kategori, nama klien, hasil singkat. Tombol **"Lihat Semua Project"**.

### 5.10 Section Promo UMKM (banner gradien biru penuh, gaya banner referensi 2)

**Judul:** *UMKM Naik Kelas? Kami Bantu dengan Harga Spesial.* **Copy:** Diskon khusus pelaku UMKM untuk paket website, desain, dan sosial media. Cukup tunjukkan identitas usaha Anda. **CTA:** Klaim Diskon UMKM →

### 5.11 Section Proses Kerja (timeline 7 langkah, garis menggambar saat scroll)

1. Pilih layanan & booking
2. Konsultasi kebutuhan
3. DP & kickoff
4. Proses pengerjaan
5. Review & presentasi hasil
6. Pelunasan
7. Serah terima + garansi

### 5.12 Testimoni, FAQ, CTA akhir

- **Testimoni:** carousel 3 kartu (foto, nama, usaha, rating). Judul: *"Kata Mereka yang Sudah Tumbuh Bersama Kami."*
- **FAQ:** berapa lama pengerjaan, apa isi garansi, apakah boleh langganan lalu beli, cara diskon UMKM, cara bayar.
- **CTA akhir (banner gradien):** *Siap Bikin Bisnis Anda Terlihat Profesional? Konsultasi gratis, tanpa kewajiban.* \[Booking Sekarang\] \[Chat WhatsApp\]

### 5.13 Footer

Logo & deskripsi · menu · layanan · **alamat studio Selong, Lombok Timur** + peta · kontak (WhatsApp, email) · sosmed · © NUSADIGITAL.

---

## 6. Halaman Portofolio/Project

- **Daftar:** grid kartu, filter kategori & industri, pencarian, pagination/infinite scroll.
- **Detail project:** hero gambar, ringkasan (klien, layanan, durasi, tahun), tantangan → solusi → hasil (angka bila ada), galeri (gambar/video/mockup), tautan live, testimoni klien, CTA "Mau project serupa?" + project terkait.
- **CMS:** admin dapat tambah/edit/urutkan project, tandai "Featured", sembunyikan.

---

## 7. Skema Diskon UMKM

- **Eligibilitas:** pelaku usaha mikro/kecil (bukti: foto usaha, akun marketplace/sosmed bisnis, NIB/SKU bila ada).
- **Diskon:** persentase tetap per kategori layanan (nilai diatur admin, mis. 10–20%).
- **Alur:** centang "Saya pelaku UMKM" saat booking → upload bukti → admin verifikasi → kode/diskon otomatis diterapkan di invoice.
- **Aturan:** tidak digabung promo lain; berlaku per project; masa berlaku kode diatur admin.

---

## 8. Sistem Booking & Alur Project (inti fungsional)

```
Pilih layanan/paket → Isi form booking → Jadwal konsultasi → Konsultasi
→ Proposal & penawaran → Setuju → Invoice DP → Bayar DP → Pengerjaan
→ Review/presentasi → Revisi (sesuai kuota) → Invoice pelunasan
→ Bayar lunas → Serah terima & garansi → Testimoni
```

### Status project (tampil di dashboard client)

`Booking Masuk` → `Konsultasi Dijadwalkan` → `Proposal Terkirim` → `Menunggu DP` → `Dalam Pengerjaan` → `Review Client` → `Revisi` → `Menunggu Pelunasan` → `Selesai & Diserahkan` → `Garansi Aktif`

### Fitur per tahap

| Tahap | Fitur |
| --- | --- |
| Booking | Form (layanan, paket, budget, deadline, deskripsi, upload brief, centang UMKM), pilih slot konsultasi (online via Google Meet/WA atau tatap muka di studio) |
| Konsultasi | Notifikasi & pengingat WhatsApp/email, catatan hasil konsultasi oleh admin |
| Proposal | Ringkasan scope, timeline, harga, syarat garansi; client **setuju/tolak/minta revisi proposal** |
| DP | Invoice otomatis (mis. 50% atau sesuai kebijakan), opsi bayar: transfer bank/QRIS/e-wallet via payment gateway + upload bukti manual sebagai cadangan |
| Pengerjaan | Timeline milestone, progres %, upload preview/file kerja, kolom komentar |
| Review | Link preview/staging, presentasi (jadwal meeting), form feedback terstruktur, **kuota revisi** terlacak |
| Pelunasan | Invoice sisa pembayaran; **file final terkunci sampai lunas** |
| Serah terima | Unduh aset, akses admin/hosting/domain, panduan penggunaan, berita acara serah terima (PDF), aktivasi masa garansi |
| Pasca | Permintaan testimoni, pengingat perpanjangan langganan/hosting |

---

## 9. Dashboard Client & Admin/CMS

**Dashboard Client:** daftar project & status, timeline, invoice & riwayat bayar, file & preview, komentar, jadwal meeting, klaim garansi.

**Admin/CMS (edit semuanya tanpa coding):**

- Konten halaman (hero, copy, FAQ, testimoni, statistik)
- Layanan & paket (nama, fitur, harga, badge "Populer")
- Portofolio/project
- Blog (fase 2)
- Booking & pipeline project (kanban per status)
- Kalender konsultasi & slot tersedia
- Invoice/pembayaran & verifikasi UMKM
- Pengaturan diskon/kode promo
- Pengguna & peran (Admin, Staf/PM, Client)
- Template notifikasi WhatsApp/email

---

## 10. Model Data (ringkas)

`users` · `services` · `packages` · `portfolio_items` · `bookings` · `projects` · `milestones` · `revisions` · `invoices` · `payments` · `discounts` · `umkm_verifications` · `files` · `testimonials` · `faqs` · `site_settings` · `notifications`

Relasi inti: `booking → project → milestones/revisions/invoices → payments`.

---

## 11. Rekomendasi Teknis

- **Front-end:** Next.js (React) + Tailwind, GSAP + ScrollTrigger, Lenis.
- **Back-end/DB:** Supabase (auth, database, storage) — selaras dengan stack proyek lain; storage file besar dapat memakai Google Drive.
- **Pembayaran:** payment gateway lokal (Midtrans/Xendit) — QRIS, VA, e-wallet.
- **Notifikasi:** WhatsApp (API/gateway) + email.
- **Hosting:** Vercel/VPS; CDN untuk aset.
- **Analytics:** GA4, Meta Pixel, Search Console.

---

## 12. Kebutuhan Non-Fungsional

- **Performa:** LCP \< 2,5 s, CLS \< 0,1; gambar WebP/AVIF; lazy-load ilustrasi 3D.
- **SEO (web agensi SEO harus contoh SEO):** SSR/SSG, meta & Open Graph per halaman, schema `LocalBusiness` + `Service`, sitemap.xml, URL bersih, Google Business Profile Selong.
- **Responsif:** mobile-first (mayoritas trafik UMKM dari ponsel).
- **Aksesibilitas:** kontras WCAG AA, fokus keyboard, `prefers-reduced-motion`.
- **Keamanan:** HTTPS, RLS di database, validasi upload, backup harian, perlindungan spam (reCAPTCHA/Turnstile).
- **Bahasa:** Indonesia (opsi Inggris fase 2).

---

## 13. Prioritas & Roadmap

| Fase | Cakupan | Estimasi |
| --- | --- | --- |
| **MVP** | Beranda (hero + semua section), halaman layanan, paket, portofolio, promo UMKM, form booking + notifikasi WA, CMS dasar | 3–4 minggu |
| **Fase 2** | Dashboard client, invoice & payment gateway, alur status penuh, verifikasi UMKM otomatis | 3–4 minggu |
| **Fase 3** | Blog/SEO konten, multi-bahasa, referral, kalender sinkron, laporan otomatis | berkelanjutan |

---

## 14. Metrik Keberhasilan

Jumlah booking konsultasi/bulan · rasio konsultasi → project · waktu rata-rata booking → DP · % project selesai sesuai timeline · skor testimoni · trafik organik & ranking keyword brand ("jasa website Lombok", "agensi digital Lombok Timur") · penggunaan diskon UMKM.

---

## 15. Risiko & Pertanyaan Terbuka

**Risiko:** animasi berat memperlambat web (mitigasi: lazy-load, reduced-motion, budget performa) · konten portofolio awal masih sedikit (mitigasi: studi kasus internal & project demo) · sengketa scope (mitigasi: proposal & berita acara tertulis).

**Perlu dikonfirmasi:**

1. Harga final tiap paket (web, sosmed, ads, SEO, workshop) dan besar diskon UMKM.
2. Persentase DP dan jumlah revisi gratis per layanan.
3. Isi detail garansi (durasi, cakupan bug vs. revisi desain).
4. Aset: logo final, foto tim/studio, project asli untuk portofolio.
5. Pembayaran: memakai payment gateway atau transfer manual dulu?
6. Nomor WhatsApp bisnis, alamat lengkap studio, jam operasional.
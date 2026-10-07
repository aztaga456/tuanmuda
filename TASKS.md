# TASKS.md — Rincian Task & Checklist Pelaksanaan

**Project:** TUANMUDA / NUSADIGITAL Creative Agency  
**Panduan:** [Paket A — Vercel Starter](https://github.com/askiya/MONOREPO-SKILLS/tree/main/paket/paket-A)

---

## Fase 1 — Pedoman (6 Dokumen Perencanaan)

- [x] Tulis `PRD.md` (Product Requirements Document lengkap)
- [x] Tulis `SDLC.md` (Workflow kerja, git commit, lint & build quality gate)
- [x] Tulis `DESIGN.md` (Design tokens, palet warna, tipografi, efek neon glow & motion)
- [x] Tulis `ARCHITECTURE.md` (Stack teknologi, skema database Prisma, storage adapter, API endpoints)
- [x] Tulis `TASKS.md` (Checklist task semua fase)
- [x] Tulis `AGENTS.md` (Aturan kerja AI agent Antigravity)

---

## Fase 2 — AI Agent Setup & Context

- [x] Antigravity memiliki akses penuh ke folder project
- [x] Antigravity memahami arsitektur Next.js 16 App Router & Prisma ORM

---

## Fase 3 — Build: Frontend, Database, Storage & Backend API

### Frontend & UI:
- [x] Bangun Hero Section interaktif dengan typewriter effect, harga bergulir, dan spotlight kursor
- [x] Bangun 6 Kartu Layanan Solusi Terpadu
- [x] Bangun 4 Kartu Differentiator Standar Mutu TUANMUDA
- [x] Bangun 5 Kategori Paket Layanan & Harga (2 baris tab dengan glowing rotating line)
- [x] Bangun Layanan Ekstensi & Portofolio Case Study
- [x] Bangun 6 Alur Kerja Transparan
- [x] Bangun Marquee Testimoni Bintang 5
- [x] Bangun Notifikasi Social Proof berkala
- [x] Pasang Tombol Admin Tersembunyi di Footer (Transparan, ikon muncul saat kursor diarahkan atau di-tap)
- [x] Optimasi seluruh tampilan dan layout untuk layar perangkat mobile (HP)

### Database & Storage Migration:
- [x] Buat skema Prisma (`prisma/schema.prisma`) dengan model `User`, `SiteContent`, `Booking`, dan `Media`
- [x] Buat singleton Prisma client (`src/lib/db.ts`)
- [x] Buat adapter storage lokal & cloud (`src/lib/storage.ts`) untuk upload thumbnail & gambar
- [x] Buat endpoint `POST /api/upload` untuk penanganan upload file multipart
- [x] Buat endpoint `GET /api/content` dan `POST /api/content` untuk persistensi database
- [x] Buat endpoint `POST /api/content/reset` untuk pemulihan setelan awal
- [x] Buat endpoint `POST /api/auth/login` untuk autentikasi admin aman (password: `suksesbareng`)
- [x] Buat endpoint `POST /api/bookings` dan `GET /api/bookings` untuk perekaman prospek klien ke database
- [x] Hubungkan `ContentContext.tsx` dengan sinkronisasi database & offline cache fallback
- [x] Hubungkan `BookingModal.tsx` dengan perekaman lead database

---

## Fase 4 — Preview & Validasi

- [x] Jalankan `http://localhost:3000` tanpa runtime error
- [x] Jalankan `http://localhost:3000/admin` tanpa error
- [x] Uji simpan konten baru di panel admin & verifikasi perubahan live
- [x] Uji login dengan password `suksesbareng`
- [x] Uji form konsultasi & pastikan lead tersimpan
- [x] Jalankan `npm run lint` — 0 error
- [x] Jalankan `npm run build` — kompilasi sukses

---

## Fase 5 — Deploy Vercel (Staging / Production)

- [ ] Push repository ke GitHub (`git push origin main`)
- [ ] Hubungkan repo di dashboard Vercel
- [ ] Atur environment variables di Vercel (`DATABASE_URL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`)
- [ ] Jalankan deploy dan verifikasi URL `.vercel.app`

---

## Fase 6 — Domain Kustom & SSL

- [ ] Arahkan DNS domain (Cloudflare / Namecheap / Niagahoster) ke Vercel CNAME/A Record
- [ ] Verifikasi sertifikat SSL HTTPS aktif

---

## Fase 7 — Maintenance & Monitoring

- [ ] Pasang UptimeRobot atau health-check monitoring
- [ ] Aktifkan backup berkala database

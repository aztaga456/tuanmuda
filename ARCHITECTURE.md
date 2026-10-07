# ARCHITECTURE.md — TUANMUDA / NUSADIGITAL

## 1. Tentang Project

Website resmi, digital lead machine, dan interactive CMS untuk **TUANMUDA / NUSADIGITAL Creative Agency** (Studio Selong, Lombok Timur). Menyediakan landing page interaktif dengan motion canggih, etalase layanan digital (Website, Video Ads, Sosial Media, SEO, Meta Ads), sistem booking konsultasi, media storage, dan panel kontrol admin CMS untuk kustomisasi konten website secara dinamis.

Mengikuti standar **Paket A — Vercel Starter** dari [MONOREPO-SKILLS](https://github.com/askiya/MONOREPO-SKILLS/tree/main/paket/paket-A).

---

## 2. Tech Stack

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Frontend Framework** | Next.js 16+ (App Router) + React 19 + TypeScript | High performance, Server/Client components, SSR & SEO optimal dalam satu repo. |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS Tokens | Styling utility modern, glassmorphism, cyber neon accents, responsive mobile-first. |
| **Backend & API** | Next.js Route Handlers (`src/app/api/*`) | Serverless-ready, native API routes tanpa perlu server backend terpisah. |
| **Database** | PostgreSQL (Neon Database / Supabase) | Serverless PostgreSQL cloud, autoscaling, connection pooling, free-tier friendly. |
| **ORM** | Prisma ORM (`@prisma/client`) | Type-safe query builder, migrasi deklaratif, auto-generated TypeScript types. |
| **Storage / Media Assets** | Local Filesystem (`public/uploads`) + Cloud S3/R2 Ready | Upload thumbnail, logo, dan file portofolio secara fleksibel baik lokal maupun cloud. |
| **Authentication** | Session Token + Cryptographic Hash | Gatekeeper aman untuk panel admin dengan proteksi session storage & secure password. |
| **Deployment** | Vercel (Staging & Production) | Zero-config continuous deployment dari GitHub, CDN edge network global. |

---

## 3. Struktur Folder Monorepo / Project (Paket A Standard)

```
NUSADIGITAL/
├── prisma/
│   ├── schema.prisma              # Definisi model database Prisma (User, SiteContent, Booking, Media)
│   └── seed.ts                    # Script seeder data awal ke database
├── public/
│   ├── uploads/                   # Media storage lokal untuk file gambar yang diupload
│   └── favicon.ico
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── admin/
│   │   │   └── page.tsx           # Panel Admin CMS (Kustomisasi 11 Section, Media, Booking Leads)
│   │   ├── api/                   # Backend Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── login/route.ts # Endpoint verifikasi login admin
│   │   │   ├── bookings/route.ts  # Endpoint simpan & ambil data leads booking konsultasi
│   │   │   ├── content/
│   │   │   │   ├── route.ts       # Endpoint GET & POST sinkronisasi konten website
│   │   │   │   └── reset/route.ts # Endpoint reset konten ke nilai pabrik
│   │   │   └── upload/route.ts    # Endpoint upload file media ke storage
│   │   ├── layout.tsx             # Root layout & ContentProvider
│   │   ├── page.tsx               # Homepage utama website
│   │   └── globals.css            # Token desain, animasi neon, & micro-interactions
│   ├── components/                # Komponen UI modular
│   │   ├── BookingModal.tsx       # Modal formulir konsultasi
│   │   ├── ExtensionsSection.tsx  # Section layanan ekstensi
│   │   ├── FloatingWhatsApp.tsx   # Floating widget chat WA
│   │   ├── Footer.tsx             # Footer dengan tombol admin transparan
│   │   ├── Header.tsx             # Navbar sticky glassmorphism
│   │   ├── HeroSection.tsx        # Hero section interaktif
│   │   ├── Logo.tsx               # Komponen logo responsif
│   │   ├── PortfolioSection.tsx   # Galeri proyek & case study
│   │   ├── PricingSection.tsx     # 5 paket layanan & tab glowing
│   │   ├── ServicesBar.tsx        # Section solusi terpadu
│   │   ├── SocialProofPopup.tsx   # Notifikasi social proof
│   │   ├── TestimonialsSection.tsx# Marquee ulasan klien
│   │   ├── WhyUsSection.tsx       # 4 standar mutu
│   │   └── WorkflowSection.tsx    # 6 alur kerja transparan
│   ├── context/
│   │   └── ContentContext.tsx     # Reactive state management (DB sync + localStorage offline cache)
│   ├── data/
│   │   └── defaultSiteContent.ts  # Fallback dataset & TypeScript interfaces lengkap
│   ├── hooks/
│   │   └── useInView.ts           # IntersectionObserver untuk animasi scroll
│   └── lib/
│       ├── db.ts                  # Prisma Client singleton
│       └── storage.ts             # File upload helper (local & cloud storage adapter)
├── .env.example                   # Contoh konfigurasi environment variables
├── AGENTS.md                      # Pedoman & aturan perilaku AI Agent (Antigravity)
├── ARCHITECTURE.md                # Dokumen arsitektur teknis (file ini)
├── DESIGN.md                      # Panduan token desain visual, warna & tipografi
├── PRD.md                         # Product Requirements Document
├── SDLC.md                        # Siklus pengembangan, branch, commit & deploy
├── TASKS.md                       # Daftar task & checklist kelulusan fase
└── package.json
```

---

## 4. Database Schema (Prisma ORM)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Akun Admin CMS
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  role         String   @default("ADMIN")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// 2. Data Konten Website Dinamis
model SiteContent {
  id        String   @id @default("active_content")
  key       String   @unique @default("main")
  data      Json     // Menyimpan object SiteContent (Brand, Hero, Pricing, Portfolio, dll.)
  version   Int      @default(1)
  updatedAt DateTime @updatedAt
  createdAt DateTime @default(now())
}

// 3. Prospek / Leads Booking Konsultasi
model Booking {
  id           String   @id @default(cuid())
  name         String
  whatsapp     String
  businessName String?
  service      String
  budget       String?
  notes        String?
  status       String   @default("PENDING") // PENDING, CONTACTED, DEAL, COMPLETED
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// 4. Media Storage / Aset Gambar
model Media {
  id           String   @id @default(cuid())
  filename     String
  originalName String
  mimeType     String
  size         Int
  url          String
  path         String
  createdAt    DateTime @default(now())
}
```

---

## 5. Storage Strategy (File Upload & Assets)

1. **Local Mode (Default Dev & Small Deployments)**:
   - File diunggah melalui `POST /api/upload` (multipart/form-data).
   - Disimpan di direktori `public/uploads/{timestamp}-{safe-filename}`.
   - Disajikan langsung melalui static file server Next.js pada URL `/uploads/{filename}`.
   - Metadata dicatat di tabel `Media`.

2. **Cloud S3/R2 Mode (Production / Cloudflare R2 / AWS S3)**:
   - Adapter `src/lib/storage.ts` mendeteksi adanya variabel `STORAGE_S3_BUCKET`, `STORAGE_S3_ENDPOINT`, `STORAGE_S3_ACCESS_KEY`, `STORAGE_S3_SECRET_KEY`.
   - File otomatis di-stream ke Cloudflare R2 bucket tanpa menyita disk server, disajikan dengan $0 egress fee.

3. **Google Drive Mode (Cloud Drive Storage)**:
   - Adapter `src/lib/storage.ts` mendeteksi `STORAGE_DRIVER="gdrive"`, `GDRIVE_CLIENT_EMAIL`, `GDRIVE_PRIVATE_KEY`, `GDRIVE_FOLDER_ID`.
   - File di-upload ke folder Google Drive via Google Drive API v3 (Service Account) dan disajikan publik melalui URL langsung `https://lh3.googleusercontent.com/d/{fileId}`.

---

## 6. API Endpoints Specification

| Method | Endpoint | Akses | Deskripsi | Input | Output |
|---|---|---|---|---|---|
| `GET` | `/api/content` | Publik | Ambil konten website aktif | - | `{ success: true, data: SiteContent }` |
| `POST` | `/api/content` | Admin | Simpan perubahan konten dari CMS | `SiteContent` JSON | `{ success: true, message: string }` |
| `POST` | `/api/content/reset` | Admin | Reset konten ke setelan bawaan | - | `{ success: true, data: defaultSiteContent }` |
| `POST` | `/api/auth/login` | Publik | Verifikasi password login admin | `{ password: string }` | `{ success: true, token: string }` |
| `POST` | `/api/bookings` | Publik | Simpan pengajuan konsultasi client | `{ name, whatsapp, service, ... }` | `{ success: true, bookingId: string }` |
| `GET` | `/api/bookings` | Admin | Ambil daftar prospek booking masuk | `?status` | `{ success: true, data: Booking[] }` |
| `POST` | `/api/upload` | Admin | Upload gambar ke storage | `FormData (file)` | `{ success: true, url: string, filename: string }` |

---

## 7. Environment Variables (`.env.example`)

```env
# Database PostgreSQL (Neon / Supabase / Local)
DATABASE_URL="postgresql://user:password@ep-cool-project-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Admin Secret & Password
ADMIN_PASSWORD="suksesbareng"
NEXTAUTH_SECRET="super-secret-jwt-key-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"

# Optional Cloud Storage (Cloudflare R2 / S3)
STORAGE_DRIVER="local" # "local" atau "s3"
STORAGE_S3_ENDPOINT=""
STORAGE_S3_BUCKET=""
STORAGE_S3_ACCESS_KEY=""
STORAGE_S3_SECRET_KEY=""
STORAGE_S3_PUBLIC_URL=""
```

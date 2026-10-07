# SDLC.md — Software Development Life Cycle

**Project:** TUANMUDA / NUSADIGITAL Creative Agency  
**Metodologi:** Vibe Coding Terstruktur (Pedoman → Agent → Build → Preview → Deploy)

---

## 1. Alur Kerja (Workflow)

```
[ Ide / Kebutuhan ]
        │
        ▼
[ 1. Update Dokumen ] (PRD, ARCHITECTURE, TASKS)
        │
        ▼
[ 2. Instruksikan AI Agent (Antigravity) ]
        │
        ▼
[ 3. Build & Test di Localhost ] (npm run dev)
        │
        ▼
[ 4. Quality Gate ] (npm run lint & npm run build — 0 error)
        │
        ▼
[ 5. Git Commit & Push ]
        │
        ▼
[ 6. Auto-Deploy Vercel ] (Preview / Production)
```

---

## 2. Standar Git & Branching

- **Branch `main`**: Kode produksi yang selalu stabil dan terhubung ke auto-deploy Vercel.
- **Branch `feature/*`** (opsional untuk perubahan besar): Cabang pengerjaan fitur baru sebelum di-merge ke `main`.

### Format Commit:
Gunakan Conventional Commits ringkas:
- `feat: tambah endpoint upload media dan adapter storage`
- `fix: hilangkan duplikasi teks judul hero section`
- `refactor: migrasi state context ke database API`
- `docs: perbarui ARCHITECTURE.md dan TASKS.md`
- `style: perbaiki responsivitas footer di mobile`

---

## 3. Tahapan Pengujian Sebelum Deploy (Quality Gates)

Setiap perubahan wajib melewati 3 pemeriksaan:
1. **Localhost Verification**: Menjalankan `npm run dev` dan memverifikasi endpoint `http://localhost:3000` dan `http://localhost:3000/admin`.
2. **Linting**:
   ```bash
   npm run lint
   ```
   Harus menghasilkan 0 error.
3. **Production Build Validation**:
   ```bash
   npm run build
   ```
   Harus lolos kompilasi webpack/turbopack dan menghasilkan static/dynamic routes tanpa runtime exception.

---

## 4. Alur Deployment (Vercel Paket A)

1. **Staging / Preview**:
   - Push commit ke branch preview atau draft PR.
   - Vercel membuat link preview otomatis: `https://project-git-branch.vercel.app`.
2. **Production Release**:
   - Merge ke branch `main`.
   - Vercel membangun bundle produksi dan mendistribusikan ke Edge CDN.
   - Domain kustom (misal: `tuanmuda.com` atau `nusadigital.id`) terhubung dengan HTTPS SSL otomatis.

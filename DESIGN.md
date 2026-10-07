# DESIGN.md — Desain Sistem Visual & Interaksi

**Project:** TUANMUDA / NUSADIGITAL Creative Agency  
**Gaya Desain:** *Futuristic Cyber-Glassmorphism* & *Clean Modern High-Trust UI*

---

## 1. Palet Warna (Color Tokens)

Website memadukan 2 nuansa estetika utama:
1. **Hero Section & Footer**: Dark cyber glassmorphism mewah (`#07091E` s.d. `#18144D`).
2. **Konten Layanan & Harga**: Light high-conversion clean UI (`#F8FAFF` & `#F0F5FF`) yang ramah mata.

### Token Warna Utama:
| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `--navy-deep` | `#07091E` | Latar belakang hero gelap & footer |
| `--navy-mid` | `#0E1038` | Gradien sekunder hero |
| `--navy-light` | `#18144D` | Transisi bawah hero section |
| `--surface-light` | `#F8FAFF` | Latar belakang section Standar Mutu & Layanan Ekstensi |
| `--surface-blue` | `#F0F5FF` | Latar belakang section Paket Layanan & Harga |
| `--accent-sky` | `#38BDF8` | Aksen gradien teks, sorotan tombol, pemicu admin |
| `--accent-indigo`| `#6366F1` | Tombol utama, badge status, navigasi aktif |
| `--accent-pink` | `#EC4899` | Highlight teks tulisan tangan berjalan, aksen CTA |
| `--accent-emerald`|`#10B981` | Titik kelap-kelip status, sinyal diskon, konfirmasi sukses |
| `--accent-amber` | `#F59E0B` | Bintang rating testimoni, ikon badge ✦ |

---

## 2. Tipografi (Typography)

- **Headings (Judul)**: Geometric modern sans-serif (`font-extrabold`, `tracking-tight`, `leading-[1.18]`).
- **Body Text (Isi Narasi)**: Inter / Geist / System Sans (`text-slate-600` untuk mode terang, `text-slate-300` untuk mode gelap).
- **Hero Dynamic Typing**: Handwritten aesthetic font (`font-handwriting font-bold`) di dalam balok pink highlight.
- **Badge & Label**: Uppercase tracking wide (`tracking-wider`, `text-[10px]` s.d. `text-xs`, `font-bold`).
- **Monospace Numbers**: Font mono untuk angka harga, WhatsApp phone, dan kode kupon.

---

## 3. Komponen Desain & Efek Khusus

### 1. Glassmorphism Card
- Efek kaca transparan: `backdrop-blur-xl bg-white/[0.04]` dengan `border border-white/10`.
- Pada section terang: `bg-white/85 backdrop-blur-md border border-slate-100 shadow-sm hover:shadow-xl`.

### 2. Rotating Glowing Neon Border (Paket Harga)
- Kotak bungkus 5 tab layanan dilengkapi garis gradien berpijar yang berputar halus mengelilingi shape (`.glowing-tabs-wrapper`).
- Menarik fokus mata calon pembeli secara visual tanpa terasa berlebihan.

### 3. Motion & Micro-Interactions
- **Pull-In Effect**: Section masuk dengan animasi perbesaran lembut saat di-scroll ke viewport.
- **Slide From Left / Right**: Elemen standar mutu masuk bertahap dari kiri dan kanan.
- **Cursor Spotlight**: Cahaya bulat lembut putih transparan yang mengikuti gerak kursor mouse di hero section.
- **Scroll Ticker Harga**: Angka harga bergeser naik secara vertikal saat berganti layanan.
- **Pulsing Status Dots**: Titik hijau kelap-kelip untuk menunjukkan status aktif studio.

---

## 4. Standar Responsivitas Mobile

- **Mobile First**: Semua container memiliki padding horizontal `px-4 sm:px-6 lg:px-8`.
- **Text Scaling**: Judul hero diatur berjenjang dari `text-3xl` di layar ponsel 320px–390px, `text-4xl` di tablet, hingga `52px` di desktop.
- **Touch Manipulation**: Tombol tersembunyi admin di footer memiliki luas sentuh minimal `w-7 h-7` dengan status `active:opacity-100` untuk layar sentuh HP.
- **Scrollbar-Free**: Navigasi tab horizontal di mobile menggunakan `overflow-x-auto` halus tanpa scrollbar mengganggu (`no-scrollbar`).

export interface BrandContent {
  name: string;
  logoText1: string;
  logoText2: string;
  emblemText: string;
  subtitle: string;
  logoImage?: string;
  description: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  studioAddress: string;
  mapsUrl: string;
  operationalHours: string;
}

export interface MetricItem {
  value: string;
  label: string;
  desc: string;
}

export interface RotatingHeroService {
  service: string;
  price: string;
}

export interface HeroContent {
  badge: string;
  headline1: string;
  headlinePrefix2?: string;
  headlineGradient: string;
  rotatingServices: RotatingHeroService[];
  narrative: string;
  primaryCta: string;
  secondaryCta: string;
  metrics: MetricItem[];
}

export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  gradient: string;
}

export interface ServicesBarContent {
  badge: string;
  title: string;
  narrative: string;
  items: ServiceItem[];
}

export interface DifferentiatorItem {
  title: string;
  tagline: string;
  desc: string;
  gradient: string;
}

export interface WhyUsContent {
  badge: string;
  title: string;
  titleGradient: string;
  narrative: string;
  differentiators: DifferentiatorItem[];
  trustBanner: {
    title: string;
    desc: string;
    badge: string;
  };
}

export interface WebsitePlan {
  name: string;
  badge: string;
  popular: boolean;
  desc: string;
  priceLepas: string;
  subLepas: string;
  priceLangganan: string;
  subLangganan: string;
  features: string[];
}

export interface SosmedPlan {
  name: string;
  badge: string;
  popular: boolean;
  price: string;
  period: string;
  platforms: string;
  addPlatform: string;
  bonus: string;
  posts: string;
  reels: string;
  features: string[];
}

export interface VideoAdsPlan {
  name: string;
  badge: string;
  popular: boolean;
  price: string;
  subPrice: string;
  desc: string;
  highlights: string[];
  ctaText?: string;
}

export interface MetaAdsPlan {
  name: string;
  badge: string;
  popular: boolean;
  price: string;
  viewsEst: string;
  desc: string;
  highlights: string[];
}

export interface SeoPlan {
  name: string;
  badge: string;
  popular: boolean;
  price: string;
  benefit: string;
  highlights: string[];
}

export interface PricingContent {
  badge: string;
  title: string;
  narrative: string;
  websitePlans: WebsitePlan[];
  sosmedPlans: SosmedPlan[];
  videoAdsPlans: VideoAdsPlan[];
  metaAdsPlans: MetaAdsPlan[];
  seoPlans: SeoPlan[];
}

export interface ExtensionItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  image: string;
  desc: string;
  details: string[];
  gradient: string;
}

export interface ExtensionsContent {
  badge: string;
  title: string;
  narrative: string;
  items: ExtensionItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Web" | "Ads" | "Sosmed" | "Packaging" | "Web App";
  client: string;
  image: string;
  rating: number;
  metric: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  year: string;
}

export interface PortfolioContent {
  badge: string;
  title: string;
  narrative: string;
  items: PortfolioItem[];
}

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
  deliverable: string;
  gradient: string;
}

export interface WorkflowContent {
  badge: string;
  title: string;
  narrative: string;
  steps: WorkflowStep[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  rating: number;
  content: string;
  avatarBg: string;
  initial: string;
}

export interface TestimonialsContent {
  badge: string;
  title: string;
  narrative: string;
  items: TestimonialItem[];
}

export interface SocialProofItem {
  name: string;
  location: string;
  action: string;
  service: string;
  timeAgo: string;
  icon: string;
  gradient: string;
}

export interface SocialProofContent {
  enabled: boolean;
  items: SocialProofItem[];
}

export interface SiteContent {
  brand: BrandContent;
  hero: HeroContent;
  servicesBar: ServicesBarContent;
  whyUs: WhyUsContent;
  pricing: PricingContent;
  extensions: ExtensionsContent;
  portfolio: PortfolioContent;
  workflow: WorkflowContent;
  testimonials: TestimonialsContent;
  socialProof: SocialProofContent;
}

export const defaultSiteContent: SiteContent = {
  brand: {
    name: "TUANMUDA",
    logoText1: "TUAN",
    logoText2: "MUDA",
    emblemText: "TM",
    subtitle: "DIGITAL SOLUTION",
    logoImage: "",
    description: "Official studio kreatif & solusi digital di Selong, Lombok Timur. Membantu UMKM, brand lokal, dan instansi tampil profesional dan bertumbuh nyata di era digital.",
    whatsappNumber: "6281234567890",
    whatsappDisplay: "+62 812-3456-7890",
    email: "studio@tuanmuda.id",
    studioAddress: "Jl. Tuan Guru Umar No. 18, Selong, Lombok Timur, NTB 83612",
    mapsUrl: "https://maps.google.com/?q=Selong+Lombok+Timur",
    operationalHours: "Senin – Sabtu (08.30 – 17.30 WITA)",
  },

  hero: {
    badge: "✦ Solusi Digital & Kreatif Terpercaya",
    headline1: "Bisnis Anda",
    headlinePrefix2: "",
    headlineGradient: "Layak tampil Hebat",
    rotatingServices: [
      { service: "Bangun Web", price: "Mulai Rp. 200 Ribu" },
      { service: "Buat Video Ai", price: "Mulai Rp. 50 Ribu" },
      { service: "Buat Poster", price: "Mulai Rp. 15 Ribu" },
      { service: "Optimasi SEO", price: "Mulai Rp. 50 Ribu" },
      { service: "Jasa META Ads", price: "Mulai Rp. 35 Ribu" },
      { service: "Kelola Sosial Media", price: "Mulai Rp. 500 Ribu" },
    ],
    narrative: "Kami mendampingi UMKM, brand lokal, dan institusi di Lombok hingga nasional bertransformasi digital secara nyata. Website cepat berkonversi tinggi, iklan video reels memikat, dan strategi digital yang langsung memicu penjualan.",
    primaryCta: "Konsultasi Gratis Sekarang",
    secondaryCta: "Lihat Portofolio",
    metrics: [
      { value: "+240%", label: "Pertumbuhan Klien", desc: "Rata-rata kenaikan omset" },
      { value: "40+", label: "Brand & UMKM", desc: "Telah didampingi go-digital" },
      { value: "99.4%", label: "Kepuasan Klien", desc: "Rating bintang 5 purna jual" },
      { value: "1-3 Hari", label: "Pengerjaan Cepat", desc: "Sesuai timeline tertulis" },
    ],
  },

  servicesBar: {
    badge: "✦ Solusi Terpadu TUANMUDA",
    title: "Satu Tim, Semua Kebutuhan Digital Anda.",
    narrative: "Layanan end-to-end dengan standar agensi profesional namun tetap ramah di kantong pelaku usaha.",
    items: [
      {
        id: "website",
        title: "Website Development",
        description: "Dari landing page berkonversi tinggi sampai web + panel admin CMS. Beli lepas atau langganan.",
        badge: "Gratis Hosting & Domain",
        gradient: "from-sky-400 via-blue-500 to-indigo-600",
      },
      {
        id: "video-ads",
        title: "Video & Image Ads",
        description: "Iklan stop-scrolling format 9:16 reels/tiktok & banner grafis yang memicu closing penjualan.",
        badge: "Formula Hook & CTA",
        gradient: "from-pink-500 via-rose-500 to-purple-600",
      },
      {
        id: "sosmed",
        title: "Kelola Sosial Media",
        description: "Konten rutin, feeds & reels estetis, caption menjual, dan akun aktif. Anda cukup fokus jualan.",
        badge: "Kalender Konten Bulanan",
        gradient: "from-amber-400 via-orange-500 to-amber-600",
      },
      {
        id: "seo",
        title: "SEO & Google Bisnis",
        description: "Naik ke halaman 1 Google Lombok & nasional. Raih calon pelanggan yang aktif mencari jasa Anda.",
        badge: "Traffic Organik Jangka Panjang",
        gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      },
      {
        id: "meta-ads",
        title: "Meta Ads Terukur",
        description: "Iklan Facebook & Instagram bertarget akurat ke audiens potensial dengan budget hemat & ROI terukur.",
        badge: "Targeting Akurat & ROAS",
        gradient: "from-purple-500 via-indigo-600 to-pink-600",
      },
      {
        id: "workshop-ai",
        title: "Solusi AI & Web App",
        description: "Workshop AI praktis, foto produk AI tanpa studio mahal, desain packaging, serta sistem web app custom.",
        badge: "Inovasi Modern Bisnis",
        gradient: "from-fuchsia-500 via-violet-600 to-indigo-700",
      },
    ],
  },

  whyUs: {
    badge: "✦ 4 Standar Mutu TUANMUDA",
    title: "Standar Mutu Nyata untuk",
    titleGradient: "Pertumbuhan Bisnis Anda.",
    narrative: "Berbekal pengalaman mendampingi puluhan bisnis dan institusi dari Lombok hingga nasional, kami memahami kebutuhan Anda akan hasil yang nyata. Di TUANMUDA, setiap solusi dirancang menyeluruh dengan memadukan sistem berkecepatan tinggi, desain visual berkelas, dan strategi berorientasi penjualan—dieksekusi transparan oleh tim studio in-house bergaransi penuh hingga bisnis Anda bertumbuh optimal.",
    differentiators: [
      {
        title: "Berpengalaman",
        tagline: "Multi-Industri",
        desc: "Mendampingi puluhan bisnis kuliner, pariwisata, retail, hingga institusi pendidikan dengan strategi teruji.",
        gradient: "from-blue-500 via-indigo-600 to-violet-700",
      },
      {
        title: "Proses Cepat",
        tagline: "Timeline Tertulis",
        desc: "Alur kerja terstruktur dengan checklist jelas dan deadline pasti. Progres pengerjaan dipantau transparan.",
        gradient: "from-sky-400 via-blue-600 to-indigo-700",
      },
      {
        title: "Harga Terjangkau",
        tagline: "Diskon UMKM",
        desc: "Paket biaya transparan tanpa biaya siluman. Skema penyesuaian khusus agar bisnis berkembang lekas go-digital.",
        gradient: "from-emerald-400 via-teal-600 to-cyan-700",
      },
      {
        title: "Bergaransi Penuh",
        tagline: "Tenang Purna Jual",
        desc: "Garansi revisi & pemeliharaan teknis sistem. Bimbingan penggunaan mandiri sampai tim Anda benar-benar mahir.",
        gradient: "from-pink-500 via-rose-600 to-purple-700",
      },
    ],
    trustBanner: {
      title: "Studio Fisik Resmi di Selong, Lombok Timur",
      desc: "Bukan agensi fiktif atau freelancer anonim. Kunjungi studio kami untuk konsultasi langsung, cek demo sistem secara live, dan bangun kerja sama bisnis yang aman serta bergaransi resmi.",
      badge: "Siap Berdiskusi Tatap Muka",
    },
  },

  pricing: {
    badge: "💸 Investasi Terjangkau & Transparan",
    title: "Pilihan Paket Sesuai Kebutuhan & Skala Usaha.",
    narrative: "Semua paket dibuat transparan tanpa biaya tersembunyi. Dapatkan diskon tambahan 15-20% untuk pelaku UMKM lokal.",
    websitePlans: [
      {
        name: "Starter Landing Page",
        badge: "Paling Hemat",
        popular: false,
        desc: "Cocok untuk profil usaha, promosi produk tunggal, atau kampanye iklan cepat.",
        priceLepas: "Rp 300.000",
        subLepas: "Sekali beli • Domain bawaan / standar",
        priceLangganan: "Rp 200.000",
        subLangganan: "Free Custom Domain • Lalu 50rb / 6 bulan",
        features: [
          "Desain 1 Halaman Responsif Modern (Mobile & Desktop)",
          "Integrasi Tombol WhatsApp Direct Chat & Floating Button",
          "Setup Google Maps Lokasi Usaha & Kontak Lengkap",
          "Optimasi Kecepatan Loading Ringan & SEO Dasar",
          "Garansi Teknis & Revisi Minor Selama Aktif",
        ],
      },
      {
        name: "Web Bisnis + Panel Admin",
        badge: "Paling Laris 🔥",
        popular: true,
        desc: "Solusi lengkap dengan CMS mandiri. Bebas update produk, artikel, & foto kapan saja.",
        priceLepas: "Rp 400.000",
        subLepas: "Sekali beli • Web + Panel Admin CMS",
        priceLangganan: "Rp 300.000",
        subLangganan: "Free Custom Domain • Lalu 100rb / semester",
        features: [
          "Semua Fitur Paket Starter Landing Page",
          "Panel Admin Mandiri (CMS) Mudah Digunakan Non-Teknis",
          "Hingga 5 Halaman Konten (Home, Tentang, Produk, Galeri, Kontak)",
          "Form Pemesanan / Booking Online ke WhatsApp Admin",
          "Video Tutorial Panduan Pakai + Garansi Pemeliharaan",
        ],
      },
      {
        name: "Custom Web Extend",
        badge: "Kustom & Fleksibel",
        popular: false,
        desc: "Website custom dengan fitur khusus sesuai alur operasional dan kebutuhan spesifik brand Anda.",
        priceLepas: "Mulai Rp 450.000",
        subLepas: "Beli Lepas • Fitur Kustom Lengkap",
        priceLangganan: "Rp 400.000",
        subLangganan: "Langganan • Lalu 100rb tiap 6 bulan",
        features: [
          "Semua Fitur Paket Web Bisnis + Panel Admin",
          "Arsitektur Koding Kustom (Next.js / Web App Modern)",
          "Fitur Tambahan Sesuai Permintaan (Katalog, Filter, API)",
          "Prioritas Pendampingan Teknis & Backup Database",
          "Konsultasi Strategi UI/UX Eksklusif dengan Lead Developer",
        ],
      },
    ],
    sosmedPlans: [
      {
        name: "Starter UMKM",
        badge: "Starter Promosi",
        popular: false,
        price: "Rp 500.000",
        period: "/bulan",
        platforms: "Facebook & Instagram",
        addPlatform: "+50.000 / platform",
        bonus: "Bonus Kalender Konten Bulanan",
        posts: "12 Feed Grafis",
        reels: "4 Video Reels",
        features: [
          "12 Konten Feed Estetis Siap Posting",
          "4 Video Reels Format 9:16 dengan Sound Tren",
          "Copywriting Caption Menjual + Riset Hashtag",
          "Penyusunan Jadwal & Kalender Konten Bulanan",
          "Revisi Materi Sebelum Terbit",
        ],
      },
      {
        name: "Growth Bisnis",
        badge: "Paling Laris 🔥",
        popular: true,
        price: "Rp 800.000",
        period: "/bulan",
        platforms: "Facebook & Instagram",
        addPlatform: "+50.000 / platform",
        bonus: "Bonus Kalender Konten Bulanan",
        posts: "20 Feed Grafis",
        reels: "6 Video Reels",
        features: [
          "20 Konten Feed Estetis Siap Posting",
          "6 Video Reels Format 9:16 Interaktif",
          "Copywriting Storytelling & Call-to-Action Kuat",
          "Kalender Konten Terencana & Manajemen Posting",
          "Laporan Ringkas Kinerja Konten Tiap Bulan",
        ],
      },
      {
        name: "Brand Dominator",
        badge: "Eksklusif & Lengkap",
        popular: false,
        price: "Rp 2.000.000",
        period: "/bulan",
        platforms: "Facebook & Instagram",
        addPlatform: "+50.000 / platform",
        bonus: "Bonus Kalender Konten + Banner/Leaflet Cetak",
        posts: "30 Feed Grafis",
        reels: "8 Video Reels",
        features: [
          "30 Konten Feed Premium Desain Eksklusif",
          "8 Video Reels Konseptual Stop-Scrolling",
          "FREE Desain Banner Fisik / Leaflet Promosi Cetak",
          "Strategi Konten Menyeluruh & Riset Kompetitor",
          "Dedicated Social Media Specialist & Evaluasi Bulanan",
        ],
      },
    ],
    videoAdsPlans: [
      {
        name: "Paket 1 Video + 2 Image",
        badge: "Starter Promosi",
        popular: false,
        price: "Rp 100.000",
        subPrice: "Materi siap tayang / pasang iklan",
        desc: "Paket ringkas untuk memulai promosi berbayar atau posting organik dengan visual memikat.",
        highlights: [
          "1 Video Format 9:16 (Reels / TikTok / Shorts)",
          "2 Image Banner Grafis High-Resolution",
          "Hook 3 Detik Pertama yang Memikat Mata",
          "Bebas Request Copy Teks & Call to Action",
          "Revisi Ringan Hingga Siap Posting",
        ],
      },
      {
        name: "Paket 4 Video + 2 Image",
        badge: "Paling Hemat & Efektif 🔥",
        popular: true,
        price: "Rp 200.000",
        subPrice: "Ideal untuk A/B Split Testing",
        desc: "Paket lengkap untuk split-testing iklan di Meta Ads atau TikTok Ads guna menemukan materi dengan konversi tertinggi.",
        highlights: [
          "4 Video Iklan Format 9:16 Variatif",
          "2 Image Banner Display / Carousel Ads",
          "Formula Copywriting AIDA (Hook, Story, Offer)",
          "Cocok untuk Menguji Angle Konten & Penawaran",
          "Format File MP4 & PNG Siap Upload ke Ads Manager",
        ],
      },
      {
        name: "Paket Video Custom",
        badge: "Kustom & Fleksibel",
        popular: false,
        price: "Custom",
        subPrice: "Sesuai konsep & brief proyek",
        desc: "Solusi video promosi tailor-made untuk brand yang membutuhkan konsep storyboard unik, durasi panjang, talent model, atau shooting di lokasi.",
        highlights: [
          "Durasi & Jumlah Video Sesuai Kebutuhan",
          "Storyboard & Konsep Naskah Khusus",
          "Opsi Talent Model & Voice Over Profesional",
          "Color Grading & Sound Design Sinematik",
          "Konsultasi Konsep Langsung dengan Tim Kreatif",
        ],
        ctaText: "Konsultasi Paket Custom →",
      },
    ],
    metaAdsPlans: [
      {
        name: "Starter Ads Testing",
        badge: "Uji Pasar",
        popular: false,
        price: "Rp 30.000",
        viewsEst: "Estimasi Jangkauan 2.000 - 5.000 Orang",
        desc: "Pilihan tepat untuk mencoba efektivitas iklan Facebook & Instagram dengan budget sangat terjangkau.",
        highlights: [
          "Setting Kampanye Iklan Meta Ads Tertarget",
          "Target Audiens Spesifik (Usia, Lokasi, Minat)",
          "Gratis Pembuatan 1 Materi Iklan Visual Sederhana",
          "Setup Tombol Direct Chat ke WhatsApp Bisnis",
          "Laporan Hasil Iklan Setelah Periode Selesai",
        ],
      },
      {
        name: "Growth Scaling Ads",
        badge: "Paling Diminati 🔥",
        popular: true,
        price: "Rp 75.000",
        viewsEst: "Estimasi Jangkauan 7.000 - 18.000 Orang",
        desc: "Mendongkrak leads dan chat WhatsApp secara masif untuk produk atau jasa yang siap closing.",
        highlights: [
          "Optimasi Algoritma Meta Ads untuk Conversions / Leads",
          "Riset Mendalam Audiens Kompetitor & Geografis NTB",
          "Gratis 2 Variasi Materi Iklan untuk Split-Testing",
          "Retargeting Orang yang Pernah Interaksi dengan Akun",
          "Monitoring Harian & Laporan Performa Iklan Lengkap",
        ],
      },
      {
        name: "Full-Funnel Authority Ads",
        badge: "Maksimalkan Penjualan",
        popular: false,
        price: "Rp 150.000",
        viewsEst: "Estimasi Jangkauan 20.000 - 50.000+ Orang",
        desc: "Strategi funneling bertahap (Awareness, Consideration, hingga Closing) untuk omset jangka panjang.",
        highlights: [
          "Penyusunan Funnel Iklan Lengkap (Cold, Warm, Hot Audience)",
          "Gratis 3 Materi Iklan Video & Banner Berdaya Pikat Tinggi",
          "Setup Custom Audience & Lookalike Audience",
          "A/B Testing Headline, Creative Visual, & Jam Tayang",
          "Evaluasi Mendalam & Rekomendasi Scale-Up Anggaran",
        ],
      },
    ],
    seoPlans: [
      {
        name: "Local SEO & Google Maps Booster",
        badge: "Kebutuhan Bisnis Lokal",
        popular: false,
        price: "Rp 100.000",
        benefit: "Membantu toko, cafe, klinik, atau kantor Anda mudah ditemukan saat orang sekitar mencari di Google Maps & Penelusuran.",
        highlights: [
          "Optimasi Google Business Profile (Google Maps Resmi)",
          "Setting Kategori Bisnis, Jam Buka, & Foto Lokasi",
          "Riset Kata Kunci Lokal (cth: 'Cafe Selong', 'Kue Lombok')",
          "Panduan Mendapatkan Ulasan Bintang 5 Pelanggan",
          "Verifikasi Lokasi & Alamat Resmi Usaha",
        ],
      },
      {
        name: "On-Page Website SEO Booster",
        badge: "Rekomendasi Website Bisnis 🔥",
        popular: true,
        price: "Rp 250.000",
        benefit: "Website Anda mudah ditemukan calon pembeli di Google Search secara organik tanpa ketergantungan biaya iklan harian.",
        highlights: [
          "Riset 10+ Kata Kunci Potensial Calon Pembeli",
          "Optimasi Meta Title, Meta Description, & Headings",
          "Optimasi Kecepatan Load & Mobile-Friendly Audit",
          "Submit Sitemap XML ke Google Search Console",
          "Indexasi Cepat Halaman di Mesin Pencari",
        ],
      },
      {
        name: "Full-Stack SEO Authority",
        badge: "Rekomendasi Dominasi Pasar",
        popular: false,
        price: "Rp 500.000",
        benefit: "Membangun aliran trafik gratis jangka panjang yang konsisten mendatangkan prospek dan pembeli setiap hari.",
        highlights: [
          "Semua Fitur Paket Local & On-Page SEO",
          "Pembuatan 2 Artikel SEO Pilar Ramah Algoritma",
          "Optimasi Struktur Internal Linking & Schema Markup",
          "Strategi Citations & Backlink Lokal Terpercaya",
          "Laporan Peringkat Keyword & Analisis Posisi Pesaing",
        ],
      },
    ],
  },

  extensions: {
    badge: "✦ Layanan Ekstensi Unggulan",
    title: "Lebih Dari Sekadar Website.",
    narrative: "TUANMUDA melengkapi ekosistem bisnis Anda dengan kecerdasan buatan, desain produk fisik, dan aplikasi terintegrasi.",
    items: [
      {
        id: "workshop-ai",
        title: "Workshop AI Basic untuk Bisnis",
        category: "Edukasi & Pelatihan",
        badge: "Umum & Privat 1-on-1",
        image: "/ext-workshop-ai.jpg",
        desc: "Kuasai ChatGPT, Midjourney, Canva AI, dan otomasi prompt praktis dari nol untuk mempercepat pekerjaan harian dan melipatgandakan produktivitas operasional usaha Anda.",
        details: [
          "Belajar langsung praktik (hands-on) dari nol tanpa dasar IT",
          "Ratusan template prompt bisnis siap pakai harian",
          "Sertifikat resmi & grup mentoring tanya-jawab pasca-kelas",
          "Tersedia skema in-house training khusus tim perusahaan",
        ],
        gradient: "from-blue-600 via-indigo-600 to-violet-700",
      },
      {
        id: "foto-produk-ai",
        title: "Pelatihan Foto Produk dengan AI",
        category: "Produksi Konten Cepat",
        badge: "Tanpa Studio Mahal",
        image: "/ext-photo-ai.jpg",
        desc: "Ubah foto kamera HP biasa menjadi visual katalog estetik berkelas brand internasional menggunakan generative AI. Hemat jutaan rupiah biaya fotografer studio.",
        details: [
          "Membuat latar belakang studio fotorealistis dalam hitungan detik",
          "Model AI manusia untuk produk fashion, F&B, dan retail",
          "Export resolusi tinggi siap cetak & posting feeds/reels",
          "Panduan prompt visual konsisten per kategori produk",
        ],
        gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
      },
      {
        id: "packaging-kemasan",
        title: "Desain Packaging & Kemasan Produk",
        category: "Branding Fisik",
        badge: "Siap Cetak & Dieline",
        image: "/ext-packaging.jpg",
        desc: "Kemasan produk unik dan memikat mata di etalase toko yang mendongkrak nilai jual (perceived value) serta loyalitas pembeli terhadap brand Anda.",
        details: [
          "Format pouch, standing box, botol, label stiker, & paperbag",
          "File vector presisi (AI/PDF) dengan garis potong (dieline) siap cetak",
          "Visual mockup 3D realistis untuk display promosi online",
          "Konsultasi pemilihan bahan kemasan & rekomendasi vendor cetak",
        ],
        gradient: "from-amber-500 via-orange-500 to-rose-500",
      },
      {
        id: "custom-webapp",
        title: "Web App & Sistem Kustom Sederhana",
        category: "Software & Digitalisasi",
        badge: "Sesuai Kebutuhan Nyata",
        image: "/ext-webapp.jpg",
        desc: "Aplikasi web fungsional yang benar-benar mempermudah rutinitas: portal raport sekolah, absensi & tugas guru, POS kasir toko, hingga dashboard inventaris stok.",
        details: [
          "Akses mudah dan ringan langsung dari smartphone & laptop",
          "Database cloud aman, backup otomatis & update data realtime",
          "Desain antarmuka simpel, sangat ramah pengguna non-teknis",
          "Dukungan teknis berkala & garansi pemeliharaan sistem",
        ],
        gradient: "from-teal-600 via-emerald-600 to-cyan-600",
      },
    ],
  },

  portfolio: {
    badge: "Bukti Nyata Kinerja Tim",
    title: "Portofolio & Studi Kasus Unggulan",
    narrative: "Setiap karya didesain dengan strategi bisnis agar memberikan dampak riil terhadap omset dan kredibilitas.",
    items: [
      {
        id: "rinjani-resort",
        title: "Rinjani Eco Resort & Tour",
        category: "Web",
        client: "PT Rinjani Vista Lombok",
        image: "/port-resort.jpg",
        rating: 5,
        metric: "+340% Booking Direct",
        description: "Website resort & pemesanan paket wisata terintegrasi multi-bahasa dengan sistem booking instan.",
        challenge: "Tergantung pada komisi tinggi OTA (Online Travel Agent) dan web lama yang lambat diakses di smartphone turis asing.",
        solution: "Redesign dengan Next.js modern, visual fotografi memikat, integrasi payment gateway internasional, dan loading < 1.2 detik.",
        results: ["Booking direct naik 340% dalam 3 bulan", "Menghemat puluhan juta komisi OTA", "Peringkat 1 Google untuk 'Luxury Resort Senaru Lombok'"],
        year: "2024",
      },
      {
        id: "aura-coffee",
        title: "Sasak Specialty Coffee Roastery",
        category: "Web",
        client: "Aura Coffee Lombok",
        image: "/port-coffee.jpg",
        rating: 5,
        metric: "Omset Tumbuh 220%",
        description: "Website e-commerce beans kopi lokal Sembalun dengan sistem langganan bulanan pecinta kopi.",
        challenge: "Penjualan biji kopi lokal terbatas pada outlet fisik cafe di Selong dan pasar offline terbatas.",
        solution: "Platform e-commerce D2C dengan katalog roast profile, checkout WhatsApp instan, serta integrasi kurir lokal & nasional.",
        results: ["Pengiriman rutin ke 18 kota di Indonesia", "Repeat order pelanggan langganan mencapai 62%", "Brand awareness naik drastis"],
        year: "2024",
      },
      {
        id: "nectaria-packaging",
        title: "Madu Trigona & Kosmetik Herbal",
        category: "Packaging",
        client: "Nectaria Botanicals NTB",
        image: "/port-packaging.jpg",
        rating: 5,
        metric: "Perceived Value +180%",
        description: "Rebranding packaging kemasan botol kaca & dus mewah untuk produk madu hutan premium NTB.",
        challenge: "Kemasan lama memakai botol plastik biasa sehingga sulit menembus pasar oleh-oleh premium dan hotel berbintang.",
        solution: "Desain packaging minimalis dengan sentuhan gold foil, label higienis bersertifikasi, dan visual modern siap ekspor.",
        results: ["Diterima di 12 hotel bintang 4 & 5 di Lombok", "Harga jual produk bisa dinaikkan 75% tanpa komplain pelanggan", "Juara UMKM Inovatif NTB 2024"],
        year: "2024",
      },
      {
        id: "siswa-cendes",
        title: "Portal Raport & Absensi Guru",
        category: "Web App",
        client: "Sekolah Cendes Selong",
        image: "/port-webapp.jpg",
        rating: 5,
        metric: "Pangkas Waktu 70%",
        description: "Aplikasi web sederhana untuk manajemen nilai Kurikulum Merdeka, absensi digital, dan e-raport.",
        challenge: "Guru menghabiskan waktu berminggu-minggu dengan puluhan file spreadsheet Excel yang rawan error dan hilang.",
        solution: "Web app responsif yang bisa dibuka di HP dan laptop guru, kalkulasi otomatis nilai formatif/sumatif, dan cetak PDF satu klik.",
        results: ["Dipakai oleh 85 guru & 1.200+ siswa", "Waktu pengisian raport berkurang dari 14 hari menjadi 3 hari", "Nol data hilang"],
        year: "2024",
      },
      {
        id: "meta-ads-fashion",
        title: "Campaign Meta Ads Hijab Muslimah",
        category: "Ads",
        client: "Aruna Modest Fashion",
        image: "/port-coffee.jpg",
        rating: 5,
        metric: "ROAS 5.2x",
        description: "Optimasi kampanye iklan Facebook & Instagram bertarget untuk koleksi hari raya lebaran.",
        challenge: "Biaya iklan sebelumnya boncos karena targeting terlalu luas dan materi video tidak memicu hook 3 detik.",
        solution: "Penyusunan video creative 9:16 dengan format review jujur, split testing 6 varian visual, dan retargeting pembeli lama.",
        results: ["Total closing 2.800+ paket baju muslimah", "ROAS stabil di 5.2x selama sebulan penuh", "Cost per click (CPC) turun 45%"],
        year: "2024",
      },
      {
        id: "kuliner-sosmed",
        title: "Transformasi Feeds & Reels Kuliner",
        category: "Sosmed",
        client: "Resto Ayam Taliwang Selong",
        image: "/port-resort.jpg",
        rating: 5,
        metric: "+450% Kunjungan Outlet",
        description: "Produksi konten visual makanan estetik & reels video viral yang menggugah selera warga lokal & wisatawan.",
        challenge: "Akun Instagram jarang update dan foto makanan terlihat gelap, sepi interaksi dari calon pembeli.",
        solution: "Fotografi makanan berkonsep segar, penataan feed grid selaras, dan reel food-review yang konsisten tayang 3x seminggu.",
        results: ["Followers organik naik 8.500+ dalam 2 bulan", "Antrean pengunjung fisik weekend meningkat signifikan", "Akun aktif & interaktif"],
        year: "2024",
      },
    ],
  },

  workflow: {
    badge: "⚡ Alur Kerja Transparan",
    title: "6 Langkah Mudah Dari Ide Sampai Jadi.",
    narrative: "Tidak ada kebingungan atau proyek mangkrak. Setiap tahapan memiliki panduan waktu dan hasil terukur.",
    steps: [
      {
        step: "01",
        title: "Konsultasi Kebutuhan",
        desc: "Diskusi mendalam untuk membedah target pasar, fitur, dan strategi terbaik (online via WhatsApp / Google Meet atau tatap muka di Studio Selong).",
        deliverable: "Scope kerja & rekomendasi solusi",
        gradient: "from-blue-600 to-indigo-600",
      },
      {
        step: "02",
        title: "DP & Kickoff",
        desc: "Persetujuan proposal resmi, pembayaran DP transparan (50%), dan pembuatan timeline pengerjaan tertulis.",
        deliverable: "Surat perjanjian kerja & invoice DP",
        gradient: "from-amber-500 to-orange-600",
      },
      {
        step: "03",
        title: "Proses Pengerjaan",
        desc: "Tim desainer & engineer kami mulai mengeksekusi visual, copy, koding, dan integrasi dengan standar mutu tinggi.",
        deliverable: "Staging preview & update berkala",
        gradient: "from-violet-600 to-purple-600",
      },
      {
        step: "04",
        title: "Review & Presentasi",
        desc: "Kami mempresentasikan hasil kerja via link live staging. Anda mengecek dan mengajukan revisi sesuai kuota paket.",
        deliverable: "Penyempurnaan detail revisi",
        gradient: "from-cyan-600 to-teal-600",
      },
      {
        step: "05",
        title: "Pelunasan",
        desc: "Penyelesaian sisa invoice setelah hasil pengerjaan disetujui 100% dan siap diluncurkan ke publik.",
        deliverable: "Invoice lunas resmi",
        gradient: "from-emerald-600 to-teal-700",
      },
      {
        step: "06",
        title: "Serah Terima & Garansi",
        desc: "Penyerahan akses website/hosting, file master mentahan, video panduan cara pakai, serta aktivasi garansi perbaikan bug.",
        deliverable: "Berita acara & kartu garansi aktif",
        gradient: "from-rose-500 to-pink-600",
      },
    ],
  },

  testimonials: {
    badge: "✦ Suara Klien Kami",
    title: "Kisah Nyata Dari Klien Yang Bertumbuh Bersama Kami.",
    narrative: "Keberhasilan mitra adalah kebanggaan terbesar studio kami. Simak bagaimana solusi digital TUANMUDA memberikan hasil riil.",
    items: [
      {
        name: "H. Syamsul Arifin",
        role: "Owner",
        company: "Rinjani Vista Resort & Tour, Senaru",
        rating: 5,
        content: "Sebelumnya web kami sering error dan tampilan jadul. Setelah di-rebuild oleh tim TUANMUDA, website kelihatan sangat mewah dan cepat. Tamu mancanegara langsung percaya untuk booking direct. Omset reservasi kami melonjak drastis!",
        avatarBg: "bg-blue-600",
        initial: "S",
      },
      {
        name: "Dewi Anggraini",
        role: "Founder",
        company: "Aruna Modest Fashion Selong",
        rating: 5,
        content: "Paket Meta Ads dan video reels TUANMUDA bener-bener ngefek. Penjualan gamis lebaran kemarin closing sampai ribuan pcs, ROAS stabil di atas 5x. Komunikasi timnya juga sangat ramah dan transparan.",
        avatarBg: "bg-pink-600",
        initial: "D",
      },
      {
        name: "Lalu Fauzi, S.Pd",
        role: "Kepala IT & Kurikulum",
        company: "Sekolah Cendes Selong, NTB",
        rating: 5,
        content: "Sistem web raport & absensi guru yang dibuatkan sangat mempermudah 85 guru kami. Guru-guru yang awalnya gaptek pun bisa pakai dengan mudah karena interfacenya simpel dan ada video panduan langsung dari mas-mas TUANMUDA.",
        avatarBg: "bg-emerald-600",
        initial: "F",
      },
      {
        name: "M. Rizal Hadi",
        role: "Pengelola Cafe & Roastery",
        company: "Sasak Specialty Coffee, Lombok Timur",
        rating: 5,
        content: "Sangat senang ada studio digital fisik yang beneran ada di Selong! Kami bisa tatap muka langsung, diskusi konsep branding biji kopi sampai tuntas. Sekarang kemasan & website beans kami sudah kirim ke berbagai kota di Indonesia.",
        avatarBg: "bg-amber-600",
        initial: "R",
      },
      {
        name: "dr. Baiq Nadira",
        role: "Managing Director",
        company: "DermaGlow Aesthetic Clinic, Praya",
        rating: 5,
        content: "Website klinik kami sekarang terintegrasi langsung dengan booking WhatsApp & dokter jaga. Pasien baru dari luar kota mudah menemukan lokasi di Google Maps. Desainnya sangat bersih, higienis, dan terpercaya.",
        avatarBg: "bg-purple-600",
        initial: "N",
      },
      {
        name: "Hendra Saputra",
        role: "Direktur Operasional",
        company: "CV Rinjani Agro Mandiri, Lombok Timur",
        rating: 5,
        content: "Jasa Optimasi SEO Booster mereka juara. Kata kunci komoditas hasil bumi kami sekarang muncul di posisi teratas Google. Kami dapat beberapa buyer distributor besar dari Jawa tanpa keluar biaya iklan setiap hari.",
        avatarBg: "bg-teal-600",
        initial: "H",
      },
    ],
  },

  socialProof: {
    enabled: true,
    items: [
      {
        name: "Pak Hendra W.",
        location: "Selong, Lombok Timur",
        action: "Telah mengirim permohonan konsultasi gratis",
        service: "Website Development",
        timeAgo: "2 menit yang lalu",
        icon: "💬",
        gradient: "from-blue-500 to-indigo-600",
      },
      {
        name: "Ibu Ratna S.",
        location: "Mataram",
        action: "Telah memesan jasa Optimasi SEO Booster",
        service: "Optimasi SEO",
        timeAgo: "5 menit yang lalu",
        icon: "🔍",
        gradient: "from-emerald-500 to-teal-600",
      },
      {
        name: "Yayasan Cendekia",
        location: "Lombok Timur",
        action: "Telah memesan Web Sekolah & Portal Guru",
        service: "Web App & Sistem",
        timeAgo: "12 menit yang lalu",
        icon: "🏫",
        gradient: "from-violet-500 to-purple-600",
      },
      {
        name: "Kedai Kopi Rinjani",
        location: "Sembalun",
        action: "Telah memesan 4 Video & 2 Image Ads",
        service: "Video & Image Ads",
        timeAgo: "18 menit yang lalu",
        icon: "🎬",
        gradient: "from-pink-500 to-rose-600",
      },
      {
        name: "Aruna Hijab Style",
        location: "Praya, Lombok Tengah",
        action: "Telah memesan Jasa Kelola Sosial Media (30 Feed)",
        service: "Kelola Sosial Media",
        timeAgo: "26 menit yang lalu",
        icon: "📱",
        gradient: "from-amber-500 to-orange-600",
      },
      {
        name: "dr. Farhan K.",
        location: "Selong, NTB",
        action: "Telah booking konsultasi website klinik & jadwal",
        service: "Website",
        timeAgo: "34 menit yang lalu",
        icon: "📅",
        gradient: "from-cyan-500 to-blue-600",
      },
      {
        name: "Madu Trigona Lestari",
        location: "Narmada, Lombok Barat",
        action: "Telah memesan Desain Packaging & Kemasan Produk",
        service: "Branding Fisik",
        timeAgo: "45 menit yang lalu",
        icon: "📦",
        gradient: "from-orange-500 to-amber-600",
      },
      {
        name: "CV Mulia Sejahtera",
        location: "Pancor, Lombok Timur",
        action: "Telah memesan Jasa Meta Ads Terukur (FB & IG)",
        service: "Jasa Meta Ads",
        timeAgo: "58 menit yang lalu",
        icon: "🎯",
        gradient: "from-indigo-500 to-violet-600",
      },
      {
        name: "Bpk. M. Zaini",
        location: "Lombok",
        action: "Telah memesan Pelatihan Foto Produk dengan AI",
        service: "Workshop AI",
        timeAgo: "1 jam yang lalu",
        icon: "📸",
        gradient: "from-purple-500 to-pink-600",
      },
    ],
  },
};

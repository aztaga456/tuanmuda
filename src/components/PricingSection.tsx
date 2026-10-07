"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";

interface PricingSectionProps {
  onSelectPlan: (planName: string, serviceType: string) => void;
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const { content } = useContent();
  const pricingData = content?.pricing;

  const { ref, isInView } = useInView({ threshold: 0.1, rootMargin: "0px 0px -50px 0px", triggerOnce: false });
  // Website model toggle: "lepas" (Beli Lepas / Sekali Beli) vs "langganan" (Langganan Hemat)
  const [webModel, setWebModel] = useState<"lepas" | "langganan">("lepas");

  // Active pricing category tab: 5 distinct services
  const [activeCategory, setActiveCategory] = useState<
    "website" | "sosmed" | "video_ads" | "meta_ads" | "seo"
  >("website");

  // Trigger state to re-run zoom-in motion on entire table on every click
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const handleSelectCategory = (catId: "website" | "sosmed" | "video_ads" | "meta_ads" | "seo") => {
    setActiveCategory(catId);
    setAnimationTrigger((prev) => prev + 1);
  };

  const handleToggleWebModel = (model: "lepas" | "langganan") => {
    setWebModel(model);
    setAnimationTrigger((prev) => prev + 1);
  };

  // Tab rows definition: 3 on top, 2 below (Sesuai Permintaan User: 2 Baris, 3 di Atas, 2 di Bawah)
  const tabsRow1 = [
    { id: "website", label: "Website & Landing Page", icon: "🌐" },
    { id: "sosmed", label: "Kelola Sosial Media", icon: "📱" },
    { id: "video_ads", label: "Video & Image Ads", icon: "🎬" },
  ];

  const tabsRow2 = [
    { id: "meta_ads", label: "Jasa Meta Ads", icon: "🎯" },
    { id: "seo", label: "Optimasi SEO", icon: "🔍" },
  ];

  // 1. DATA PAKET WEBSITE & LANDING PAGE
  const websitePlans = [
    {
      name: "Landing Page",
      badge: "Cocok untuk Promosi & Event",
      popular: false,
      priceLepas: "Rp 300.000",
      subLepas: "Sekali beli • Domain standar (non-custom)",
      priceLangganan: "Rp 200.000",
      subLangganan: "Awal + Rp 50.000 / 6 bulan (Free Custom Domain!)",
      desc: "Halaman fokus konversi tinggi untuk jualan produk, promo musiman, atau pendaftaran.",
      features: [
        "1 Halaman Panjang (Single Page Konversi)",
        "Desain Kustom Responsif Mobile & Cepat",
        "Formulir / Tombol Direct WhatsApp",
        "Setup SEO On-Page Dasar",
        "Jika Beli Sekali: Menggunakan Domain Standar",
        "Jika Langganan: FREE Custom Domain (.com / .id)",
        "Garansi Revisi & Panduan Penggunaan",
      ],
    },
    {
      name: "Web + Panel Admin",
      badge: "Paling Laris 🔥",
      popular: true,
      priceLepas: "Rp 400.000",
      subLepas: "Sekali beli • Milik Anda sepenuhnya",
      priceLangganan: "Rp 300.000",
      subLangganan: "Awal + Rp 100.000 / semester (tiap 6 bln)",
      desc: "Website dinamis dengan dashboard admin. Edit artikel, produk, dan isi web sendiri tanpa koding.",
      features: [
        "Dashboard Panel Admin (CMS) Intuitif",
        "Kelola Produk / Artikel Mandiri Kapan Saja",
        "3 - 5 Halaman Lengkap (Home, Layanan, Kontak)",
        "Multi-User & Hak Akses Akun",
        "Keamanan SSL & Backup Terjadwal",
        "Integrasi Tombol WhatsApp & Inquiry",
        "Garansi Teknis + Bimbingan Penggunaan Tim",
      ],
    },
    {
      name: "Custom Web Extend",
      badge: "Fitur Tambahan Lengkap",
      popular: false,
      priceLepas: "Mulai Rp 450.000",
      subLepas: "Sekali beli • Kustom sesuai permintaan",
      priceLangganan: "Rp 400.000",
      subLangganan: "Awal + Rp 100.000 / 6 bulan",
      desc: "Web + CMS/panel admin dengan banyak fitur tambahan sesuai permintaan dan alur proses bisnis klien.",
      features: [
        "Web + Panel Admin Custom Klien",
        "Banyak Fitur Tambahan (Booking, Raport, Katalog, dll.)",
        "Struktur Database & Skalabilitas Tinggi",
        "Integrasi Pihak Ketiga (API, Maps, Gateway)",
        "Kustomisasi Desain UI/UX Khusus",
        "Keamanan SSL & Proteksi Data",
        "Garansi Bug & Pemeliharaan Purna Jual",
      ],
    },
  ];

  // 2. DATA PAKET KELOLA SOSIAL MEDIA PER BULAN (Facebook & Instagram, Tambah Platform Lain +50K)
  const sosmedPlans = [
    {
      name: "Paket 12 Feeds",
      badge: "Mulai Bangun Akun",
      popular: false,
      price: "Rp 500.000",
      period: "/ bulan",
      posts: "12 Feed Desain",
      reels: "4 Video Reels",
      platforms: "Facebook & Instagram",
      addPlatform: "+Rp 50.000 / platform",
      bonus: "Bonus Kalender Konten",
      desc: "Solusi hemat untuk menjaga akun Facebook & Instagram bisnis Anda tetap aktif, profesional, dan terawat setiap minggu.",
      features: [
        "Platform Default: Facebook & Instagram",
        "12 Desain Feed Estetis & Menjual",
        "4 Video Reels Pendek Stop-Scrolling",
        "Bonus: Kalender Konten Terencana",
        "Copywriting Menjual & Riset Hashtag",
        "Tambah Platform Lain: Cukup +Rp 50K",
      ],
    },
    {
      name: "Paket 20 Feeds",
      badge: "Paling Populer UMKM 🔥",
      popular: true,
      price: "Rp 800.000",
      period: "/ bulan",
      posts: "20 Feed Desain",
      reels: "6 Video Reels",
      platforms: "Facebook & Instagram",
      addPlatform: "+Rp 50.000 / platform",
      bonus: "Bonus Kalender Konten",
      desc: "Strategi konten konsisten untuk Facebook & Instagram guna meningkatkan engagement, jangkauan audiens, dan closing penjualan.",
      features: [
        "Platform Default: Facebook & Instagram",
        "20 Desain Feed & Carousel Edukasi",
        "6 Video Reels Menarik Berpotensi Viral",
        "Bonus: Kalender Konten Bulanan",
        "Riset Tren & Formula Copywriting AIDA",
        "Tambah Platform Lain: Cukup +Rp 50K",
      ],
    },
    {
      name: "Paket 30 Feeds",
      badge: "Dominasi Brand Total",
      popular: false,
      price: "Rp 2.000.000",
      period: "/ bulan",
      posts: "30 Feed Harian",
      reels: "8 Video Reels",
      platforms: "Facebook & Instagram",
      addPlatform: "+Rp 50.000 / platform",
      bonus: "FREE Banner / Leaflet Promosi",
      desc: "Manajemen akun intensif harian di Facebook & Instagram untuk mendominasi pasar digital dengan materi promosi lengkap.",
      features: [
        "Platform Default: Facebook & Instagram",
        "30 Desain Feed (Posting Setiap Hari)",
        "8 Video Reels Konseptual Kualitas Tinggi",
        "FREE Desain Banner / Leaflet Promosi Cetak",
        "Bonus: Kalender Konten Lengkap",
        "Tambah Platform Lain: Cukup +Rp 50K",
      ],
    },
  ];

  // 3. DATA PAKET VIDEO DAN IMAGE ADS (3 Tabel: Termasuk Custom)
  const videoImageAdsPlans = [
    {
      name: "Paket 1 Video + 2 Image",
      badge: "Starter Promosi",
      popular: false,
      price: "Rp 100.000",
      subPrice: "Materi siap tayang / pasang iklan",
      desc: "Paket ringkas untuk memulai promosi berbayar atau posting organik dengan visual memikat.",
      highlights: [
        "1 Video Format 9:16 (Reels / TikTok / Shorts)",
        "2 Desain Image / Banner Promosi High CTR",
        "Hook 3 Detik Pertama Stop-Scrolling",
        "Copywriting Penawaran Menjual",
        "Format Siap Iklan / Siap Upload",
      ],
      ctaText: "Pilih Paket Ini →",
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
        "2 Desain Banner Promosi High CTR",
        "Ideal untuk A/B Split Testing Iklan",
        "Subtitle Dinamis & Audio Bebas Royalti",
        "Ekspor Full HD Siap Campaign",
      ],
      ctaText: "Pilih Paket Ini →",
    },
    {
      name: "Paket Video Custom",
      badge: "Kustom & Fleksibel",
      popular: false,
      price: "Custom",
      subPrice: "Sesuai konsep & brief proyek",
      desc: "Solusi video promosi tailor-made untuk brand yang membutuhkan konsep storyboard unik, durasi panjang, talent model, atau shooting di lokasi.",
      highlights: [
        "Konsep Storyboard & Naskah Khusus",
        "Durasi Bebas Sesuai Kebutuhan Platform",
        "Opsi Voiceover Profesional & Talent Model",
        "Shooting Produk / Dokumentasi Lokasi",
        "Revisi Fleksibel & Master Mentahan",
      ],
      ctaText: "Konsultasi Video Custom →",
    },
  ];

  // 4. DATA PAKET JASA META ADS (Mulai 30rb + 2 Rekomendasi)
  const metaAdsPlans = [
    {
      name: "Starter Meta Ads",
      badge: "Uji Coba Cepat",
      popular: false,
      price: "Rp 30.000",
      viewsEst: "± 2.000 – 5.000 Views / Impresi",
      desc: "Paket hemat untuk menguji respon pasar atau mempromosikan penawaran kilat ke audiens lokal terdekat.",
      highlights: [
        "Estimasi Jangkauan: 2.000 – 5.000 Views / Impresi",
        "GRATIS 1 Ads Image Promosi Menarik",
        "GRATIS Copywriting Iklan Siap Konversi",
        "Setting Target Audiens & Lokasi Spesifik (Kota/Radius)",
        "Monitoring Campaign Dasar",
      ],
    },
    {
      name: "Growth Traffic & Leads",
      badge: "Rekomendasi UMKM 🔥",
      popular: true,
      price: "Rp 75.000",
      viewsEst: "± 8.000 – 18.000 Views + Traffic",
      desc: "Mengarahkan calon pembeli potensial langsung ke chat WhatsApp atau halaman website bisnis Anda.",
      highlights: [
        "Estimasi Jangkauan: 8.000 – 18.000 Views / Impresi",
        "GRATIS 2 Variasi Banner Iklan (A/B Test)",
        "Copywriting Menjual Formula AIDA",
        "Targeting Minat (Interests), Usia, & Demografi Akurat",
        "Optimasi Klik WhatsApp / Kunjungan Web",
        "Laporan Hasil & Insight Performa Iklan",
      ],
    },
    {
      name: "Scale-Up Conversion & Sales",
      badge: "Rekomendasi Bisnis Aktif",
      popular: false,
      price: "Rp 150.000",
      viewsEst: "± 25.000 – 50.000+ Views Luas",
      desc: "Kampanye agresif untuk mendongkrak omset penjualan dengan materi video dan targeting mendalam.",
      highlights: [
        "Estimasi Jangkauan: 25.000 – 50.000+ Views Luas",
        "GRATIS 1 Video Ads + 2 Banner Grafis",
        "Setup Custom Audience & Retargeting Potensial",
        "Targeting Presisi (Perilaku Belanja & Daya Beli)",
        "Optimasi Konversi Penjualan & ROAS Maksimal",
        "Laporan Evaluasi & Saran Skalabilitas Budget",
      ],
    },
  ];

  // 5. DATA PAKET OPTIMASI SEO (Mulai 100rb + 3 Rekomendasi & Manfaat)
  const seoPlans = [
    {
      name: "Local SEO & Google Bisnis",
      badge: "Starter Lokal",
      popular: false,
      price: "Rp 100.000",
      benefit: "Toko atau usaha Anda langsung muncul di Google Maps saat calon pembeli mencari jasa/produk terdekat di area sekitar.",
      highlights: [
        "Setup & Verifikasi Profil Google Bisnis Resmi",
        "Optimasi Kata Kunci Nama Usaha & Kategori Utama",
        "Geotagging Foto Produk/Toko untuk Nilai SEO Lokal",
        "Tombol Direct Telepon, Rute Maps, & Chat WhatsApp",
        "Panduan Praktis Mendapatkan Ulasan Bintang 5",
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
  ];

  const activeWebsitePlans = pricingData?.websitePlans?.length ? pricingData.websitePlans : websitePlans;
  const activeSosmedPlans = pricingData?.sosmedPlans?.length ? pricingData.sosmedPlans : sosmedPlans;
  const activeVideoAdsPlans = pricingData?.videoAdsPlans?.length ? pricingData.videoAdsPlans : videoImageAdsPlans;
  const activeMetaAdsPlans = pricingData?.metaAdsPlans?.length ? pricingData.metaAdsPlans : metaAdsPlans;
  const activeSeoPlans = pricingData?.seoPlans?.length ? pricingData.seoPlans : seoPlans;

  return (
    <section id="paket-harga" className="py-20 lg:py-28 bg-[#F0F5FF]/80 relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${
          isInView ? "animate-pull-in" : "opacity-0"
        }`}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-xs font-semibold text-blue-800 mb-3">
            <span>💸</span> {pricingData?.badge ? pricingData.badge.replace(/^[💸✨★✦\s]+/, "") : "Investasi Terjangkau & Transparan"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {pricingData?.title || "Pilihan Paket Sesuai Kebutuhan & Skala Usaha."}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5">
            {pricingData?.narrative ||
              "Semua paket dibuat transparan tanpa biaya tersembunyi. Dapatkan diskon tambahan 15-20% untuk pelaku UMKM lokal."}
          </p>

          {/* Main Category Tabs: 2 Baris (3 di Atas, 2 di Bawah) dengan Line Glow Memutar Mengelilingi Kotak Shape */}
          <div className="flex justify-center mt-8 px-2 max-w-full">
            <div className="glowing-tabs-wrapper">
              <div className="glowing-tabs-inner">
                {/* Baris 1: 3 Item di Atas */}
                <div className="flex flex-wrap sm:flex-nowrap justify-center gap-1.5 sm:gap-2">
                  {tabsRow1.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectCategory(tab.id as any)}
                      className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
                        activeCategory === tab.id
                          ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/30 scale-[1.02]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Baris 2: 2 Item di Bawah */}
                <div className="flex flex-wrap sm:flex-nowrap justify-center gap-1.5 sm:gap-2">
                  {tabsRow2.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectCategory(tab.id as any)}
                      className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
                        activeCategory === tab.id
                          ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/30 scale-[1.02]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. WEBSITE & LANDING PAGE SECTION                            */}
        {/* ============================================================ */}
        {activeCategory === "website" && (
          <div key={activeCategory} className="space-y-8 animate-fadeIn">
            {/* Model Toggle: Beli Lepas vs Langganan */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-slate-600">Model Kepemilikan:</span>
              <div className="bg-slate-200/80 p-1 rounded-xl inline-flex">
                <button
                  onClick={() => handleToggleWebModel("lepas")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    webModel === "lepas"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Beli Lepas (Bayar 1x)
                </button>
                <button
                  onClick={() => handleToggleWebModel("langganan")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    webModel === "langganan"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Langganan (Hemat Awal + Free Custom Domain)
                </button>
              </div>
            </div>

            {/* 3 Website Pricing Cards (Seluruh Tabel Animasi Zoom-In) */}
            <div
              key={`website-table-${webModel}-${animationTrigger}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2 animate-zoom-in-table"
            >
              {activeWebsitePlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    plan.popular
                      ? "static-glow-card shadow-2xl scale-105 z-10"
                      : "bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md z-20">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {!plan.popular && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {plan.badge}
                      </span>
                    )}

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{plan.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 min-h-[36px]">{plan.desc}</p>

                    {/* Price display with Motion Zoom-in Animation */}
                    <div
                      key={`${activeCategory}-${webModel}-${plan.name}-price`}
                      className="mt-5 pb-5 border-b border-slate-100 animate-zoom-in"
                    >
                      <div className="text-3xl font-extrabold text-slate-900">
                        {webModel === "lepas" ? plan.priceLepas : plan.priceLangganan}
                      </div>
                      <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                        {webModel === "lepas" ? plan.subLepas : plan.subLangganan}
                      </div>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3 mt-6">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Fitur Termasuk:
                      </div>
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() =>
                        onSelectPlan(
                          `${plan.name} (${webModel === "lepas" ? "Beli Lepas" : "Langganan"})`,
                          "Website"
                        )
                      }
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                        plan.popular
                          ? "btn-gradient-cta text-white shadow-lg"
                          : "bg-slate-900 hover:bg-indigo-600 text-white shadow-sm"
                      }`}
                    >
                      Pilih Paket Ini →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Information Banner Fasilitas Website (Sesuai Desain Kotak Ringkas & Bersih) */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 border border-indigo-200/80 rounded-2xl p-4 max-w-3xl mx-auto text-center shadow-xs">
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
                <span>🌐</span>
                <span>Fasilitas Termasuk: <strong>Semua Paket Website Siap Pakai & Bergaransi</strong></span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                🌐 Custom Domain (.com/.id) • 📱 Tampilan Responsif Mobile & Cepat • ⚡ Direct WhatsApp • 🛡️ Garansi Teknis & Bimbingan Purna Jual
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. KELOLA SOSIAL MEDIA PER BULAN SECTION                     */}
        {/* ============================================================ */}
        {activeCategory === "sosmed" && (
          <div key={activeCategory} className="space-y-8 animate-fadeIn">
            {/* Platform Information Banner (Sesuai Permintaan User: FB & IG, Tambah Platform Lain +50K) */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 border border-indigo-200/80 rounded-2xl p-4 max-w-3xl mx-auto text-center shadow-xs">
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
                <span>📱</span>
                <span>Platform Termasuk: <strong>Facebook & Instagram</strong></span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                Ingin menambah platform lain (TikTok, LinkedIn, dll)? <strong>Cukup tambah +Rp 50.000 / platform</strong> dari harga paket pilihan Anda!
              </p>
            </div>

            <div
              key={`sosmed-table-${animationTrigger}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2 animate-zoom-in-table"
            >
              {activeSosmedPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    plan.popular
                      ? "static-glow-card shadow-2xl scale-105 z-10"
                      : "bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md z-20">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {!plan.popular && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        {plan.badge}
                      </span>
                    )}

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{plan.name}</h3>

                    {/* Price with Motion Zoom-in Animation */}
                    <div
                      key={`${activeCategory}-${plan.name}-price`}
                      className="mt-5 pb-5 border-b border-slate-100 animate-zoom-in"
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-500 font-semibold">{plan.period}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-indigo-700 mt-1 flex items-center gap-1">
                        <span>✓</span> Platform: {plan.platforms}
                      </div>
                      <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                        + Tambah platform lain: {plan.addPlatform}
                      </div>
                      <div className="text-xs font-bold text-amber-700 mt-1.5 flex items-center gap-1.5">
                        <span>✨</span>
                        <span>{plan.bonus}</span>
                      </div>
                    </div>

                    {/* Deliverables summary */}
                    <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 rounded-xl text-center">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{plan.posts}</div>
                        <div className="text-[10px] text-slate-500">Materi Desain</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{plan.reels}</div>
                        <div className="text-[10px] text-slate-500">Video Reels</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mt-4">
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <span className="text-amber-500 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => onSelectPlan(plan.name, "Kelola Sosial Media")}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                        plan.popular
                          ? "btn-gradient-cta text-white shadow-lg"
                          : "bg-slate-900 hover:bg-amber-600 text-white shadow-sm"
                      }`}
                    >
                      Pilih Paket Sosmed →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Request Consultation Box */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200/70 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
                  <span>🎨</span> Butuh Paket Custom / Request Khusus Lebih Dari Ini?
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                  Ada kebutuhan tambahan editan video, jumlah reels lebih banyak, atau carousel edukasi khusus? Konsultasikan langsung dengan tim kreatif kami untuk mendapatkan skema harga dan timeline terbaik.
                </p>
              </div>
              <a
                href="https://wa.me/6281234567890?text=Halo%20TUANMUDA,%20saya%20ingin%20konsultasi%20paket%20custom%20kelola%20sosial%20media"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-md transition-all text-center"
              >
                Konsultasi Paket Custom →
              </a>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. VIDEO DAN IMAGE ADS SECTION (3 Tabel: Termasuk Custom)    */}
        {/* ============================================================ */}
        {activeCategory === "video_ads" && (
          <div key={activeCategory} className="space-y-8 animate-fadeIn">
            {/* Deskripsi Singkat Video & Image Ads (Sesuai Permintaan User) */}
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-4 max-w-3xl mx-auto text-center shadow-xs">
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
                <span>🎬</span>
                <span>Video & Image Ads: <strong>Formula Hook & Visual Stop-Scrolling Siap Tayang</strong></span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                Format vertikal 9:16 untuk Reels, TikTok Ads, dan banner feed berdaya pikat tinggi yang dirancang khusus untuk memicu <strong>closing penjualan instan</strong>.
              </p>
            </div>

            <div
              key={`video-ads-table-${animationTrigger}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2 animate-zoom-in-table"
            >
              {activeVideoAdsPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    plan.popular
                      ? "static-glow-card shadow-2xl scale-105 z-10"
                      : "bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md z-20">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    {!plan.popular && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {plan.badge}
                      </span>
                    )}

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{plan.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 min-h-[36px] leading-relaxed">{plan.desc}</p>

                    {/* Price display with Motion Zoom-in Animation */}
                    <div
                      key={`${activeCategory}-${plan.name}-price`}
                      className="mt-5 pb-5 border-b border-slate-100 animate-zoom-in"
                    >
                      <div className="text-3xl font-extrabold text-slate-900">{plan.price}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {plan.subPrice || "Materi siap tayang / siap pasang iklan"}
                      </div>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3 mt-6">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Termasuk Dalam Paket:
                      </div>
                      {plan.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => onSelectPlan(plan.name, "Video & Image Ads")}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                        plan.popular
                          ? "btn-gradient-cta text-white shadow-lg"
                          : "bg-slate-900 hover:bg-indigo-600 text-white shadow-sm"
                      }`}
                    >
                      {plan.ctaText || "Pilih Paket Iklan Ini →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. JASA META ADS SECTION (3 Paket: Starter 30rb + 2 Lanjutan) */}
        {/* ============================================================ */}
        {activeCategory === "meta_ads" && (
          <div key={activeCategory} className="space-y-8 animate-fadeIn">
            {/* Platform / Service Info Banner Meta Ads (Sesuai Desain Kotak Ringkas & Bersih) */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-200/80 rounded-2xl p-4 max-w-3xl mx-auto text-center shadow-xs">
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
                <span>🎯</span>
                <span>Meta Ads Profesional: <strong>Iklan Facebook & Instagram Tepat Sasaran & Terukur</strong></span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                Semua paket sudah termasuk setting target lokasi, minat demografi, dan <strong>gratis materi ads berkualitas</strong> untuk mendatangkan pelanggan baru!
              </p>
            </div>

            <div
              key={`meta-ads-table-${animationTrigger}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2 animate-zoom-in-table"
            >
              {activeMetaAdsPlans.map((item) => (
                <div
                  key={item.name}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    item.popular
                      ? "static-glow-card shadow-2xl scale-105 z-10"
                      : "bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md z-20">
                      {item.badge}
                    </div>
                  )}

                  <div>
                    {!item.popular && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {item.badge}
                      </span>
                    )}

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{item.name}</h3>

                    {/* Price & Views Info with Motion Zoom-in Animation */}
                    <div
                      key={`${activeCategory}-${item.name}-price`}
                      className="mt-5 pb-5 border-b border-slate-100 animate-zoom-in"
                    >
                      <div className="text-3xl font-extrabold text-slate-900">{item.price}</div>
                      <div className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                        <span>👁️</span>
                        <span>{item.viewsEst}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-4 leading-relaxed min-h-[36px]">{item.desc}</p>

                    <div className="space-y-2.5 mt-5">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Fasilitas Paket:
                      </div>
                      {item.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => onSelectPlan(item.name, "Jasa Meta Ads")}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                        item.popular
                          ? "btn-gradient-cta text-white shadow-lg"
                          : "bg-slate-900 hover:bg-indigo-600 text-white shadow-sm"
                      }`}
                    >
                      Jalankan Iklan Meta →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. JASA OPTIMASI SEO (3 Rekomendasi & Manfaat Mulai 100rb)     */}
        {/* ============================================================ */}
        {activeCategory === "seo" && (
          <div key={activeCategory} className="space-y-8 animate-fadeIn">
            {/* Information Banner Optimasi SEO (Sesuai Desain Kotak Ringkas & Bersih) */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-2xl p-4 max-w-3xl mx-auto text-center shadow-xs">
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
                <span>🔍</span>
                <span>Investasi Jangka Panjang: <strong>Halaman 1 Google Tanpa Terus Menerus Bayar Iklan</strong></span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                Optimasi mesin pencari memastikan calon pelanggan yang mencari produk/jasa Anda dapat <strong>langsung menemukan bisnis Anda di Google Search & Maps</strong>.
              </p>
            </div>

            <div
              key={`seo-table-${animationTrigger}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2 animate-zoom-in-table"
            >
              {activeSeoPlans.map((item) => (
                <div
                  key={item.name}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    item.popular
                      ? "static-glow-card shadow-2xl scale-105 z-10"
                      : "bg-white border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md z-20">
                      {item.badge}
                    </div>
                  )}

                  <div>
                    {!item.popular && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                        {item.badge}
                      </span>
                    )}

                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{item.name}</h3>

                    {/* Price with Motion Zoom-in Animation */}
                    <div
                      key={`${activeCategory}-${item.name}-price`}
                      className="mt-5 pb-5 border-b border-slate-100 animate-zoom-in"
                    >
                      <div className="text-3xl font-extrabold text-slate-900">{item.price}</div>
                    </div>

                    {/* Manfaat Utama */}
                    <div className="my-4 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/60">
                      <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <span>🎯</span> Manfaat Langsung:
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">{item.benefit}</p>
                    </div>

                    <div className="space-y-2.5 mt-5">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Fitur & Pengerjaan:
                      </div>
                      {item.highlights.map((h) => (
                        <div key={h} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => onSelectPlan(item.name, "Optimasi SEO")}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                        item.popular
                          ? "btn-gradient-cta text-white shadow-lg"
                          : "bg-slate-900 hover:bg-emerald-600 text-white shadow-sm"
                      }`}
                    >
                      Pilih Optimasi SEO →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

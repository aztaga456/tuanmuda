"use client";

import { useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";
import { getSafeImageUrl } from "@/lib/image-helper";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface PortfolioItem {
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

export default function PortfolioSection() {
  const { content } = useContent();
  const portData = content?.portfolio;
  const brandName = content?.brand?.name || "TUANMUDA";
  const waNumber = content?.brand?.whatsappNumber;

  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const portfolioItems: PortfolioItem[] = [
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
      image: "/port-coffee.jpg", // high quality fallback visual
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
      image: "/port-resort.jpg", // high quality visual
      rating: 5,
      metric: "1.4 Juta Views Reels",
      description: "Manajemen sosial media komprehensif: 16 feeds tematik, 8 reels kuliner memikat, dan interaksi followers.",
      challenge: "Akun Instagram mati suri dan sepi interaksi, pengunjung luar kota tidak tahu lokasi resto terpercaya di Selong.",
      solution: "Produksi reels sinematik proses bakar bumbu asli, visual feeds konsisten, dan optimasi Google Maps Bisnis.",
      results: ["Followers organik naik 18.000 dalam 4 bulan", "Kunjungan fisik wisatawan naik 65%", "Ulasan bintang 5 Google Maps bertambah 240+"],
      year: "2024",
    },
  ];

  const activeItems = portData?.items?.length ? portData.items : portfolioItems;
  const categories = ["Semua", "Web", "Ads", "Sosmed", "Packaging", "Web App"];

  const filteredItems =
    activeFilter === "Semua"
      ? activeItems
      : activeItems.filter((item) => item.category === activeFilter);

  return (
    <section id="portofolio" className="py-20 lg:py-28 bg-[#F8FAFF] relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${
          isInView ? "animate-slide-in-left" : "opacity-0"
        }`}
      >
        {/* Header matching Featured Ads in UI.jpg */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {portData?.badge || "Bukti Nyata Kinerja Tim"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {portData?.title || "Portofolio & Studi Kasus Unggulan"}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {portData?.narrative ||
                "Setiap karya didesain dengan strategi bisnis agar memberikan dampak riil terhadap omset dan kredibilitas."}
            </p>
          </div>

          <a
            href="#faq"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 shrink-0"
          >
            <span>Konsultasikan Kebutuhan Serupa</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Filter Chips matching UI.jpg style */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Column Grid matching UI.jpg Featured Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProject(item)}
              className="glass-card-light glass-card-hover rounded-2xl overflow-hidden border border-slate-200/80 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Image container with badges matching UI.jpg card */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {item.image?.startsWith("data:") || item.image?.startsWith("http") ? (
                    <img
                      src={getSafeImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                      src={item.image || "/port-resort.jpg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  )}

                  {/* Category Pill Tag matching UI.jpg New tag */}
                  <div className="absolute top-3 left-3 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
                    {item.category}
                  </div>

                  {/* Bookmark / Quick Action Icon matching UI.jpg */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>

                  {/* Metric overlay badge */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center justify-between text-white text-[11px]">
                    <span className="text-slate-300">Hasil Kunci:</span>
                    <span className="font-bold text-sky-300">{item.metric}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="text-[11px] font-semibold text-indigo-600">{item.client}</div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer matching UI.jpg stars and button */}
              <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="text-slate-500 ml-1 text-[10px]">5.0</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                  Studi Kasus →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {selectedProject.category}
              </span>
              <span className="text-xs text-slate-500">Tahun {selectedProject.year}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">{selectedProject.title}</h3>
            <p className="text-sm font-semibold text-indigo-600 mt-1">{selectedProject.client}</p>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden my-5 border border-slate-200 shadow-inner">
              {selectedProject.image?.startsWith("data:") || selectedProject.image?.startsWith("http") ? (
                <img
                  src={getSafeImageUrl(selectedProject.image)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Image
                  src={selectedProject.image || "/port-resort.jpg"}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100">
                <div className="font-bold text-indigo-900 text-xs uppercase tracking-wider mb-1">
                  Metrik Utama
                </div>
                <div className="text-lg font-extrabold text-indigo-700">{selectedProject.metric}</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-1">Tantangan Klien:</div>
                <p className="text-slate-600">{selectedProject.challenge}</p>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-1">Solusi Strategis TUANMUDA:</div>
                <p className="text-slate-600">{selectedProject.solution}</p>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-2">Hasil Nyata yang Dicapai:</div>
                <div className="space-y-1.5">
                  {selectedProject.results.map((res) => (
                    <div key={res} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(
                  `Halo ${brandName}, saya tertarik dengan studi kasus project ${selectedProject.title} (${selectedProject.client}). Bisa diskusi untuk solusi serupa pada bisnis saya?`,
                  waNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-cta flex-1 py-3.5 rounded-xl font-bold text-white text-center text-sm shadow-md"
              >
                Mau Hasil Serupa untuk Bisnis Anda?
              </a>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

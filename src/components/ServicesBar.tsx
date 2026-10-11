"use client";

import React from "react";
import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";

interface ServicesBarProps {
  onSelectService: (serviceName: string) => void;
}

export default function ServicesBar({ onSelectService }: ServicesBarProps) {
  const { content } = useContent();
  const { ref, isInView } = useInView({ threshold: 0.1, rootMargin: "0px 0px -60px 0px", triggerOnce: false });

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "website":
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "video-ads":
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case "sosmed":
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        );
      case "ads-seo":
      case "meta-ads":
      case "seo":
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          </svg>
        );
      case "marketplace":
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        );
      case "bimbel-kreator":
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5"
            />
          </svg>
        );
      case "workshop-ai":
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
    }
  };

  const defaultServices = [
    {
      id: "website",
      title: "Website Development",
      description: "Landing page konversi tinggi hingga web kustom lengkap dengan panel admin CMS mandiri.",
      badge: "Gratis Hosting & Domain",
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/25",
    },
    {
      id: "video-ads",
      title: "Video & Image Ads",
      description: "Iklan stop-scrolling format 9:16 reels/tiktok & banner grafis yang memicu closing penjualan.",
      badge: "Formula Hook & CTA",
      gradient: "from-pink-500 via-rose-500 to-purple-600",
      shadowColor: "shadow-pink-500/25",
    },
    {
      id: "sosmed",
      title: "Kelola Sosial Media",
      description: "Konten rutin, feeds & reels estetis, caption menjual, dan interaksi akun aktif tanpa repot.",
      badge: "Kalender Konten Rutin",
      gradient: "from-amber-400 via-orange-500 to-amber-600",
      shadowColor: "shadow-amber-500/25",
    },
    {
      id: "ads-seo",
      title: "Meta Ads & Optimasi SEO",
      description: "Iklan tertarget FB & Instagram ber-ROAS tinggi dipadu optimasi SEO & Google Bisnis untuk traffic konsisten.",
      badge: "Targeting Akurat & Google #1",
      gradient: "from-purple-500 via-indigo-600 to-teal-500",
      shadowColor: "shadow-indigo-500/25",
    },
    {
      id: "marketplace",
      title: "Kelola & Optimasi Marketplace",
      description: "Pembuatan toko profesional Shopee & Tokopedia, dekorasi etalase, upload produk SEO, dan optimasi penjualan.",
      badge: "Shopee & Tokopedia",
      gradient: "from-orange-500 via-rose-500 to-amber-600",
      shadowColor: "shadow-orange-500/25",
    },
    {
      id: "bimbel-kreator",
      title: "Bimbel Kreator & Affiliate",
      description: "Pelatihan intensif pembuatan konten video viral, personal branding, dan strategi affiliate komisi tinggi.",
      badge: "Mentoring & Cuan Digital",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      id: "workshop-ai",
      title: "Solusi AI & Web App",
      description: "Workshop AI praktis, foto produk AI tanpa studio mahal, kemasan produk, serta sistem web app custom.",
      badge: "Inovasi Modern Bisnis",
      gradient: "from-fuchsia-500 via-violet-600 to-indigo-700",
      shadowColor: "shadow-violet-500/25",
    },
  ];

  const rawItems = content?.servicesBar?.items;
  // Jika database atau cache masih menyimpan 6 item lama (ada meta-ads & seo terpisah), gunakan 7 item terupdate
  const hasOldSchema =
    rawItems &&
    rawItems.length === 6 &&
    rawItems.some((i: any) => i.id === "seo" || i.id === "meta-ads");
  const servicesData = !rawItems || rawItems.length === 0 || hasOldSchema ? defaultServices : rawItems;

  // Visual layout 3 baris: 2 atas, 3 tengah, 2 bawah
  const row1 = servicesData.slice(0, 2);
  const row2 = servicesData.slice(2, 5);
  const row3 = servicesData.slice(5, 7);
  const overflow = servicesData.slice(7);

  const renderCard = (item: any) => (
    <div
      key={item.id}
      onClick={() => onSelectService(item.title)}
      className="group glass-card-light glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/90 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
    >
      {/* Top right subtle accent glow */}
      <div
        className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${
          item.gradient || "from-blue-500 to-indigo-600"
        } opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}
      />

      <div>
        {/* Header: Icon on Left, Title & Badge on Right */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-3">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${
              item.gradient || "from-blue-500 to-indigo-600"
            } flex items-center justify-center shadow-md ${
              item.shadowColor || "shadow-indigo-500/25"
            } shrink-0 border border-white/60 transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300`}
          >
            {item.iconSvg || getServiceIcon(item.id)}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 block mb-0.5">
              {item.badge}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Description underneath */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
          {item.description}
        </p>
      </div>

      {/* Action CTA Link */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1.5 transition-colors">
          <span>Pelajari Detail</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
        <span className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
          Pilih
        </span>
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      id="layanan"
      className={`relative pt-8 sm:pt-12 lg:pt-16 pb-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${
        isInView ? "animate-pull-in" : "opacity-0"
      }`}
    >
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-xs font-semibold text-indigo-700 shadow-sm mb-2">
          <span>✦</span> {content?.servicesBar?.badge ? content.servicesBar.badge.replace(/^[✦✨★\s]+/, "") : "Solusi Terpadu lomboXtudio"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {content?.servicesBar?.title || "Satu Tim, Semua Kebutuhan Digital Anda."}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          {content?.servicesBar?.narrative ||
            "Layanan menyeluruh dengan eksekusi cepat, desain berkelas, dan strategi penjualan nyata."}
        </p>
      </div>

      {/* Visual Layout: 3 Baris Format (2, 3, 2) */}
      <div className="space-y-5 sm:space-y-6">
        {/* Baris 1: 2 Layanan Utama (2 Kolom Lebar) */}
        {row1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {row1.map(renderCard)}
          </div>
        )}

        {/* Baris 2: 3 Layanan Promosi & Penjualan (3 Kolom) */}
        {row2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {row2.map(renderCard)}
          </div>
        )}

        {/* Baris 3: 2 Layanan Edukasi & AI Modern (2 Kolom Lebar) */}
        {row3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {row3.map(renderCard)}
          </div>
        )}

        {/* Overflow fallback jika ada item tambahan dari CMS */}
        {overflow.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {overflow.map(renderCard)}
          </div>
        )}
      </div>
    </section>
  );
}

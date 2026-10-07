"use client";

import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";

interface ServicesBarProps {
  onSelectService: (serviceName: string) => void;
}

export default function ServicesBar({ onSelectService }: ServicesBarProps) {
  const { content } = useContent();
  const { ref, isInView } = useInView({ threshold: 0.1, rootMargin: "0px 0px -60px 0px", triggerOnce: false });
  const services = [
    {
      id: "website",
      title: "Website Development",
      description:
        "Dari landing page berkonversi tinggi sampai web + panel admin CMS. Beli lepas atau langganan.",
      badge: "Gratis Hosting & Domain",
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/25",
      iconSvg: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "video-ads",
      title: "Video & Image Ads",
      description:
        "Iklan stop-scrolling format 9:16 reels/tiktok & banner grafis yang memicu closing penjualan.",
      badge: "Formula Hook & CTA",
      gradient: "from-pink-500 via-rose-500 to-purple-600",
      shadowColor: "shadow-pink-500/25",
      iconSvg: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "sosmed",
      title: "Kelola Sosial Media",
      description:
        "Konten rutin, feeds & reels estetis, caption menjual, dan akun aktif. Anda cukup fokus jualan.",
      badge: "Kalender Konten Bulanan",
      gradient: "from-amber-400 via-orange-500 to-amber-600",
      shadowColor: "shadow-amber-500/25",
      iconSvg: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      ),
    },
    {
      id: "seo",
      title: "SEO & Google Bisnis",
      description:
        "Naik ke halaman 1 Google Lombok & nasional. Raih calon pelanggan yang aktif mencari jasa Anda.",
      badge: "Traffic Organik Jangka Panjang",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      shadowColor: "shadow-emerald-500/25",
      iconSvg: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      ),
    },
    {
      id: "meta-ads",
      title: "Meta Ads Terukur",
      description:
        "Iklan Facebook & Instagram bertarget akurat ke audiens potensial dengan budget hemat & ROI terukur.",
      badge: "Targeting Akurat & ROAS",
      gradient: "from-purple-500 via-indigo-600 to-pink-600",
      shadowColor: "shadow-purple-500/25",
      iconSvg: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "workshop-ai",
      title: "Solusi AI & Web App",
      description:
        "Workshop AI praktis, foto produk AI tanpa studio mahal, desain packaging, serta sistem web app custom.",
      badge: "Inovasi Modern Bisnis",
      gradient: "from-fuchsia-500 via-violet-600 to-indigo-700",
      shadowColor: "shadow-violet-500/25",
      iconSvg: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  const servicesData = content?.servicesBar?.items?.length ? content.servicesBar.items : services;

  return (
    <section
      ref={ref}
      id="layanan"
      className={`relative pt-8 sm:pt-12 lg:pt-16 pb-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${
        isInView ? "animate-pull-in" : "opacity-0"
      }`}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-xs font-semibold text-indigo-700 shadow-sm mb-2">
          <span>✦</span> {content?.servicesBar?.badge ? content.servicesBar.badge.replace(/^[✦✨★\s]+/, "") : "Solusi Terpadu TUANMUDA"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {content?.servicesBar?.title || "Satu Tim, Semua Kebutuhan Digital Anda."}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          {content?.servicesBar?.narrative ||
            "Layanan end-to-end dengan standar agensi profesional namun tetap ramah di kantong pelaku usaha."}
        </p>
      </div>

      {/* 2 Rows Landscape Grid: 3 atas 3 bawah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {servicesData.map((item: any) => (
          <div
            key={item.id}
            onClick={() => onSelectService(item.title)}
            className="group glass-card-light glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/90 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Top right subtle accent glow */}
            <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${item.gradient} opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />

            <div>
              {/* Header: Icon on Left, Title & Badge on Right */}
              <div className="flex items-center gap-3.5 sm:gap-4 mb-3">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${item.gradient || "from-blue-500 to-indigo-600"} flex items-center justify-center shadow-md ${item.shadowColor || "shadow-indigo-500/25"} shrink-0 border border-white/60 transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300`}
                >
                  {item.iconSvg || <span className="text-xl sm:text-2xl text-white">⚡</span>}
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
        ))}
      </div>
    </section>
  );
}

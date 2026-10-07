"use client";

import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";

interface WhyUsSectionProps {
  onOpenBooking: () => void;
  onFilterService?: (category: string) => void;
}

export default function WhyUsSection({ onOpenBooking }: WhyUsSectionProps) {
  const { content } = useContent();
  const whyUsData = content?.whyUs;
  const { ref: showcaseRef, isInView: showcaseInView } = useInView({ threshold: 0.12, rootMargin: "0px 0px -50px 0px", triggerOnce: false });
  const { ref: cardsRef, isInView: cardsInView } = useInView({ threshold: 0.12, rootMargin: "0px 0px -50px 0px", triggerOnce: false });
  const differentiators = [
    {
      title: "Berpengalaman",
      tagline: "Multi-Industri",
      desc: "Mendampingi puluhan bisnis kuliner, pariwisata, retail, hingga institusi pendidikan dengan strategi teruji.",
      gradient: "from-blue-500 via-indigo-600 to-violet-700",
      shadowColor: "shadow-indigo-500/25",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
    {
      title: "Proses Cepat",
      tagline: "Timeline Tertulis",
      desc: "Alur kerja terstruktur dengan checklist jelas dan deadline pasti. Progres pengerjaan dipantau transparan.",
      gradient: "from-sky-400 via-blue-500 to-cyan-600",
      shadowColor: "shadow-sky-500/25",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Harga Terjangkau",
      tagline: "Diskon UMKM",
      desc: "Paket biaya transparan tanpa biaya siluman. Skema penyesuaian khusus agar bisnis berkembang lekas go-digital.",
      gradient: "from-emerald-400 via-teal-500 to-emerald-600",
      shadowColor: "shadow-emerald-500/25",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Bergaransi Penuh",
      tagline: "Tenang Purna Jual",
      desc: "Garansi revisi & pemeliharaan teknis sistem. Bimbingan penggunaan mandiri sampai tim Anda benar-benar mahir.",
      gradient: "from-purple-500 via-fuchsia-500 to-pink-600",
      shadowColor: "shadow-purple-500/25",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="mengapa-kami" className="py-20 lg:py-28 bg-[#F8FAFF] relative overflow-hidden">
      {/* Top Edge Soft Fade Overlay to blend seamlessly with previous section */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#F8FAFF] via-[#F8FAFF]/90 to-transparent pointer-events-none z-10" />
      {/* Bottom Edge Soft Fade Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#F8FAFF] via-[#F8FAFF]/90 to-transparent pointer-events-none z-10" />

      {/* Seamless Fading Mask Container for Blurred Color Splash */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 140px, black calc(100% - 120px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 140px, black calc(100% - 120px), transparent 100%)",
        }}
      >
        {/* Single subtle color splash on the right edge: compact, single tone, does not enter too far */}
        <div className="absolute top-24 sm:top-32 -right-14 sm:-right-16 w-64 h-64 sm:w-72 sm:h-72 bg-purple-400/25 rounded-full blur-[60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Top Showcase: 2 columns on desktop (Kiri: Narasi 2 paragraf menjual, Kanan: Gambar komposisi lebih ramping) */}
        <div ref={showcaseRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-14">
          
          {/* Kiri: Headline & Narasi Menjual (Masuk Dari Kiri ke Kanan) */}
          <div className={`space-y-5 order-2 lg:order-1 transition-opacity duration-300 ${
            showcaseInView ? "animate-slide-in-left" : "opacity-0"
          }`}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-xs font-bold text-indigo-700 shadow-xs">
              <span className="text-amber-500">✦</span> {whyUsData?.badge ? whyUsData.badge.replace(/^[✦✨★\s]+/, "") : "4 Standar Mutu TUANMUDA"}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {whyUsData?.title || "Standar Mutu Nyata untuk"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {whyUsData?.titleGradient || "Pertumbuhan Bisnis Anda."}
              </span>
            </h2>

            {/* Paragraf Ringkas & Menjual */}
            <p className="text-slate-600 text-sm sm:text-base leading-[1.85] sm:leading-[1.9] pt-1">
              {whyUsData?.narrative || (
                <>
                  Berbekal pengalaman mendampingi puluhan bisnis dan institusi dari Lombok hingga nasional, kami memahami kebutuhan Anda akan hasil yang nyata. Di <strong className="font-semibold text-slate-900">TUANMUDA</strong>, setiap solusi dirancang menyeluruh dengan memadukan sistem berkecepatan tinggi, desain visual berkelas, dan strategi berorientasi penjualan—dieksekusi transparan oleh tim studio in-house bergaransi penuh hingga bisnis Anda bertumbuh optimal.
                </>
              )}
            </p>
          </div>

          {/* Kanan: Gambar Komposisi Lebih Ramping & Rapi (Masuk Dari Kanan ke Kiri) */}
          <div className={`relative flex items-center justify-center order-1 lg:order-2 py-4 lg:py-0 transition-opacity duration-300 ${
            showcaseInView ? "animate-slide-in-right" : "opacity-0"
          }`}>
            {/* Subtle soft radial ambient glow behind transparent devices */}
            <div className="absolute w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-tr from-blue-400/20 via-purple-400/15 to-sky-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Transparent Composition Stage (Dibuat Lebih Kecil & Ramping: max-w-[340px] sm:max-w-[360px]) */}
            <div className="relative w-full max-w-[330px] sm:max-w-[360px] aspect-[4/3.2] flex items-center justify-center">
              
              {/* Central Transparent Laptop & Mobile Image */}
              <div className="relative w-full h-full">
                <Image
                  src="/hero-laptop-original.png"
                  alt="Solusi Digital Laptop & Mobile TUANMUDA"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-contain drop-shadow-[0_16px_30px_rgba(30,27,75,0.16)]"
                  priority
                />
              </div>

              {/* 1. Grafik Panah Meningkat (Mewakili Berpengalaman Multi-Industri) - Kiri Atas */}
              <div className="absolute -top-2.5 sm:-top-4 -left-2 sm:-left-4 z-20 animate-float-1 pointer-events-none">
                <div className="glass-card-light px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl border border-white/90 flex items-center gap-2 backdrop-blur-md">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 shrink-0">
                    <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900">+280% Growth</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-medium text-slate-500 block leading-none mt-0.5">
                      Grafik Penjualan Naik ↗
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Icon 3D Cepat (Mewakili Proses Cepat) - Kanan Atas */}
              <div className="absolute -top-2.5 sm:-top-4 -right-2 sm:-right-4 z-20 animate-float-2 pointer-events-none">
                <div className="glass-card-light px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl border border-white/90 flex items-center gap-2 backdrop-blur-md">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/30 shrink-0">
                    <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 block leading-tight">Proses Cepat</span>
                    <span className="text-[8px] sm:text-[9px] font-medium text-slate-500 block leading-none mt-0.5">
                      Timeline Terukur ⚡
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Icon 3D Rupiah (Mewakili Harga Terjangkau) - Kiri Bawah */}
              <div className="absolute bottom-2 sm:bottom-3 -left-2 sm:-left-4 z-20 animate-float-3 pointer-events-none">
                <div className="glass-card-light px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl border border-white/90 flex items-center gap-2 backdrop-blur-md">
                  <div className="relative w-7 sm:w-8 h-7 sm:h-8 shrink-0">
                    <Image
                      src="/icon-3d-rupiah.png"
                      alt="Icon 3D Rupiah Transparan"
                      fill
                      sizes="32px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 block leading-tight">Biaya Terjangkau</span>
                    <span className="text-[8px] sm:text-[9px] font-medium text-slate-500 block leading-none mt-0.5">
                      Ramah Pelaku UMKM Rp
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Icon 3D Garansi (Mewakili Bergaransi Penuh) - Kanan Bawah */}
              <div className="absolute bottom-1 sm:bottom-2 -right-1 sm:-right-2 z-20 animate-float-4 pointer-events-none">
                <div className="glass-card-light px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl border border-white/90 flex items-center gap-2 backdrop-blur-md">
                  <div className="relative w-7 sm:w-8 h-7 sm:h-8 shrink-0">
                    <Image
                      src="/icon-3d-handshake.png"
                      alt="Icon 3D Garansi Kerjasama"
                      fill
                      sizes="32px"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900">Garansi Penuh</span>
                      <span className="text-emerald-500 font-bold text-[11px]">✓</span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-medium text-slate-500 block leading-none mt-0.5">
                      Pendampingan Tuntas
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4 Standar Mutu Cards: Muncul Seperti Popup saat discroll ke tabel */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14 lg:mb-16">
          {(whyUsData?.differentiators?.length ? whyUsData.differentiators : differentiators).map((item: any, idx) => (
            <div
              key={item.title || idx}
              style={{ animationDelay: `${idx * 110}ms` }}
              className={`glass-card-light glass-card-hover rounded-2xl p-4 sm:p-5 border border-white/90 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all h-full ${
                cardsInView ? "animate-pop-up" : "opacity-0"
              }`}
            >
              <div>
                {/* Header: 3D Icon on Left, Title on Right */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className={`w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-gradient-to-tr ${item.gradient || "from-blue-500 via-indigo-600 to-violet-700"} flex items-center justify-center shadow-md ${item.shadowColor || "shadow-indigo-500/25"} shrink-0 border border-white/60 transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300`}
                  >
                    {item.icon || <span className="text-white text-base">🛡️</span>}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                      {item.tagline}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Description below */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Trust & Legitimacy Validation Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-400/20">
          {/* Decorative background glow */}
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 sm:gap-6 z-10">
            {/* Modern 3D Studio Workspace Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-lg text-white">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                  Official Creative Studio & Workspace
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-semibold text-white">
                  {whyUsData?.trustBanner?.badge || "Kantor Fisik Resmi"}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                {whyUsData?.trustBanner?.title || "Didukung Studio Fisik & Tim In-House Profesional"}
              </h3>

              <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl leading-relaxed">
                {whyUsData?.trustBanner?.desc ||
                  "Bukan perantara lepas atau agensi fiktif. Kami memiliki studio resmi dengan infrastruktur lengkap serta tim developer, desainer, dan digital marketer in-house yang siap berdiskusi langsung dan mengawal pertumbuhan bisnis Anda secara transparan."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10 w-full md:w-auto">
            <button
              onClick={onOpenBooking}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-lg hover:bg-sky-50 hover:shadow-xl transition-all cursor-pointer text-center"
            >
              Jadwalkan Konsultasi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

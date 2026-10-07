"use client";

import { useInView } from "@/hooks/useInView";

interface CtaBannerProps {
  onOpenBooking: () => void;
}

export default function CtaBanner({ onOpenBooking }: CtaBannerProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section className="pt-8 sm:pt-14 pb-20 sm:pb-28 bg-[#090B24] relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-pink-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`rounded-3xl border border-white/15 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900/80 p-8 sm:p-14 lg:p-16 backdrop-blur-xl shadow-2xl text-center max-w-4xl mx-auto space-y-6 transition-opacity duration-300 ${
            isInView ? "animate-pop-up" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-white/20 text-xs font-semibold text-sky-200">
            <span>✦</span> Langkah Awal Menuju Pertumbuhan Nyata
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Siap Bikin Bisnis Anda Terlihat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-300 to-pink-400">
              Profesional & Terpercaya?
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Konsultasi 100% gratis tanpa komitmen apapun. Ceritakan kebutuhan Anda, dan tim ahli kami di Selong akan menyiapkan rekomendasi solusi serta simulasi hasil terbaik.
          </p>

          <div className="flex items-center justify-center pt-4">
            <button
              onClick={onOpenBooking}
              className="btn-gradient-cta w-full sm:w-auto px-10 py-4 rounded-full text-base sm:text-lg font-bold text-white shadow-xl cursor-pointer flex items-center justify-center gap-2 group hover:scale-105 transition-all"
            >
              <span>Booking Konsultasi Sekarang</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-4">
            <span>✓ Respon Cepat &lt; 15 Menit</span>
            <span>•</span>
            <span>✓ Tatap Muka atau Online</span>
            <span>•</span>
            <span>✓ Tanpa Biaya Tersembunyi</span>
          </div>
        </div>
      </div>
    </section>
  );
}


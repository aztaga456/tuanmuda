"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useContent } from "@/context/ContentContext";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const { content } = useContent();
  const brand = content?.brand;

  return (
    <footer className="bg-[#07091E] text-slate-400 text-xs sm:text-sm border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-white/10">
          {/* Kolom Kiri: Logo & Deskripsi Brand */}
          <div className="lg:col-span-6 space-y-4">
            <div className="pt-1">
              <Logo variant="white" />
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              <strong className="text-white">{brand?.name || "lomboXtudio"} Creative Agency</strong> —{" "}
              {brand?.description ||
                "Official studio kreatif & solusi digital di Selong, Lombok Timur. Membantu UMKM, brand lokal, dan instansi tampil profesional dan bertumbuh nyata di era digital."}
            </p>
          </div>

          {/* Kolom Kanan: Lokasi Studio, Jam Operasional & Kontak Studio */}
          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 max-w-md w-full">
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 text-base mt-0.5 shrink-0">📍</span>
                <div>
                  <div className="font-bold text-white mb-0.5">Official Studio:</div>
                  <div className="text-slate-300 leading-snug">
                    {brand?.studioAddress || "Jl. Tuan Guru Umar No. 18, Selong, Lombok Timur, NTB 83612"}
                  </div>
                  <a
                    href={brand?.mapsUrl || "https://maps.google.com/?q=Selong+Lombok+Timur"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold text-xs mt-1 transition-colors"
                  >
                    <span>Buka Petunjuk Arah di Google Maps</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-indigo-400 text-base shrink-0">🕒</span>
                <div>
                  <span className="font-bold text-white">Jam Operasional:</span>{" "}
                  <span className="text-slate-300">
                    {brand?.operationalHours || "Senin – Sabtu (08.30 – 17.30 WITA)"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-base shrink-0">💬</span>
                <div>
                  <span className="font-bold text-white">WhatsApp Studio:</span>{" "}
                  <a
                    href={getWhatsAppUrl(
                      `Halo ${brand?.name || "lomboXtudio"}, saya ingin menghubungi Studio via WhatsApp.`,
                      brand?.whatsappNumber
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:text-sky-200 hover:underline font-mono font-bold"
                  >
                    {brand?.whatsappDisplay || "+62 812-3456-7890"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Transparent Hidden Admin Login Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 gap-y-1">
            <span>
              &copy; {new Date().getFullYear()} {brand?.name || "lomboXtudio"} Creative Agency. Seluruh hak cipta dilindungi undang-undang.
            </span>

            {/* Tombol Admin Transparan (Icon kecil nampak jika diarahkan / hover, atau di-tap di mobile) */}
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-7 h-7 -my-1 rounded opacity-0 hover:opacity-100 focus:opacity-100 active:opacity-100 transition-all duration-300 text-slate-500 hover:text-cyan-400 active:text-cyan-400 hover:scale-110 active:scale-110 cursor-pointer touch-manipulation"
              title="Panel Admin"
              aria-label="Panel Admin"
            >
              <svg
                className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

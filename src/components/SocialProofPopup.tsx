"use client";

import { useState, useEffect } from "react";

interface SocialProofItem {
  name: string;
  location: string;
  action: string;
  service: string;
  timeAgo: string;
  icon: string;
  gradient: string;
}

const proofData: SocialProofItem[] = [
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
];

import { useContent } from "@/context/ContentContext";

interface SocialProofPopupProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export default function SocialProofPopup({ onOpenBooking }: SocialProofPopupProps) {
  const { content } = useContent();
  const proofItems = content?.socialProof?.items?.length ? content.socialProof.items : proofData;
  const isEnabled = content?.socialProof ? content.socialProof.enabled : true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification (3.5 seconds)
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!isVisible || isDismissed) return;

    // Toast visible for 5.5 seconds, then hide
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return () => clearTimeout(hideTimer);
  }, [isVisible, currentIndex, isDismissed]);

  useEffect(() => {
    if (isVisible || isDismissed || proofItems.length === 0) return;

    // Pause for 5 seconds while hidden, then show next item
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % proofItems.length);
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(nextTimer);
  }, [isVisible, isDismissed, proofItems.length]);

  if (isDismissed || !isEnabled || proofItems.length === 0) return null;

  const currentItem = proofItems[currentIndex % proofItems.length];

  return (
    <div
      className={`fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[320px] sm:max-w-[350px] transition-all duration-300 pointer-events-auto ${
        isVisible ? "animate-toast-in pointer-events-auto" : "animate-toast-out pointer-events-none"
      }`}
    >
      <div
        onClick={() => {
          if (onOpenBooking) {
            onOpenBooking(currentItem.service);
          }
        }}
        className="group relative bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-indigo-300/80 rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.25)] flex items-start gap-3 cursor-pointer transition-all hover:scale-[1.02]"
      >
        {/* Left Glowing Icon / Avatar */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr ${currentItem.gradient} flex items-center justify-center text-white text-lg shrink-0 shadow-md border border-white/60`}
        >
          {currentItem.icon}
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="text-xs font-bold text-slate-900 truncate">
              {currentItem.name}
            </span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[10px] font-medium text-slate-500 truncate">
              {currentItem.location}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-snug mt-1 line-clamp-2">
            {currentItem.action}
          </p>

          <div className="flex items-center gap-2 mt-1.5 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentItem.timeAgo}
            </span>
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100">
              ✓ Terverifikasi
            </span>
          </div>
        </div>

        {/* Close / Dismiss button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            // Hide for 30 seconds if dismissed
            setTimeout(() => setIsDismissed(false), 30000);
            setIsDismissed(true);
          }}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 text-xs transition-colors"
          aria-label="Tutup notifikasi"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

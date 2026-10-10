"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

function SparkleStar({
  className = "",
  size = 18,
  glowColor = "rgba(252,211,77,0.8)",
}: {
  className?: string;
  size?: number;
  glowColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ filter: `drop-shadow(0 0 7px ${glowColor})` }}
    >
      <path d="M12 1 C12 7, 16 11, 23 12 C16 13, 12 17, 12 23 C12 17, 8 13, 1 12 C8 11, 12 7, 12 1 Z" />
    </svg>
  );
}

interface HeroSectionProps {
  onOpenBooking: () => void;
}

// Rotating services with synchronized pricing (Line 3 & Scrolling Price)
const defaultServicesData = [
  { service: "Bangun Web", price: "Mulai Rp. 200 Ribu" },
  { service: "Buat Video Ai", price: "Mulai Rp. 50 Ribu" },
  { service: "Buat Poster", price: "Mulai Rp. 15 Ribu" },
  { service: "Optimasi SEO", price: "Mulai Rp. 50 Ribu" },
  { service: "Jasa META Ads", price: "Mulai Rp. 35 Ribu" },
  { service: "Kelola Sosial Media", price: "Mulai Rp. 500 Ribu" },
];

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const { content } = useContent();
  const hero = content?.hero;
  const activeServicesData = hero?.rotatingServices?.length ? hero.rotatingServices : defaultServicesData;

  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const [serviceIndex, setServiceIndex] = useState(0);
  const [currentText, setCurrentText] = useState(activeServicesData[0]?.service || "Bangun Web");
  const [isDeleting, setIsDeleting] = useState(false);

  // Vertical scrolling price transition
  const [activePrice, setActivePrice] = useState(activeServicesData[0]?.price || "Mulai Rp. 200 Ribu");
  const [oldPrice, setOldPrice] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    const safeIdx = serviceIndex % activeServicesData.length;
    const safePrevIdx = prevIndexRef.current % activeServicesData.length;
    if (safePrevIdx !== safeIdx) {
      const prevPrice = activeServicesData[safePrevIdx]?.price || "";
      const nextPrice = activeServicesData[safeIdx]?.price || "";
      prevIndexRef.current = safeIdx;

      setOldPrice(prevPrice);
      setActivePrice(nextPrice);
      setIsScrolling(true);

      const timer = setTimeout(() => {
        setOldPrice(null);
        setIsScrolling(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [serviceIndex, activeServicesData]);

  useEffect(() => {
    const safeIdx = serviceIndex % activeServicesData.length;
    const fullText = activeServicesData[safeIdx]?.service || "";
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, 70);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setServiceIndex((prev) => (prev + 1) % activeServicesData.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, serviceIndex, activeServicesData]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setParallax({
      x: (x - centerX) / centerX,
      y: (y - centerY) / centerY,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
  };

  const [heroHeight, setHeroHeight] = useState(850);

  useEffect(() => {
    const updateHeroHeight = () => {
      if (sectionRef.current) {
        setHeroHeight(sectionRef.current.offsetHeight);
      }
    };
    updateHeroHeight();
    window.addEventListener("resize", updateHeroHeight);
    return () => window.removeEventListener("resize", updateHeroHeight);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          if (sectionRef.current && Math.abs(sectionRef.current.offsetHeight - heroHeight) > 20) {
            setHeroHeight(sectionRef.current.offsetHeight);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroHeight]);

  // Scroll threshold: exit motion begins ONLY when scroll reaches > 35% of the hero section
  // If user scrolls a little (0% to 35%), exitProgress = 0 (no motion effect yet)
  const startThreshold = heroHeight * 0.35;
  const endThreshold = heroHeight * 0.85;

  const exitProgress = Math.min(
    1,
    Math.max(0, (scrollY - startThreshold) / (endThreshold - startThreshold))
  );

  // Parallax exit values (smoothly applied only above 35% scroll)
  const scrollLaptopX = exitProgress * 250;
  const scrollLaptopOpacity = Math.max(0, 1 - exitProgress * 1.1);

  const scrollIconsScale = Math.max(0, 1 - exitProgress);
  const scrollIconsOpacity = Math.max(0, 1 - exitProgress * 1.15);

  const scrollGlowOpacity = Math.max(0, 1 - exitProgress * 1.25);
  const scrollGlowScale = Math.max(0.65, 1 - exitProgress * 0.35);

  // Reusable CTA Buttons
  const ctaButtons = (
    <>
      <button
        onClick={onOpenBooking}
        className="btn-gradient-cta w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-bold text-white shadow-xl cursor-pointer flex items-center justify-center gap-2 group"
      >
        <span>{hero?.primaryCta || "Konsultasi Gratis"}</span>
        <svg
          className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>

      <a
        href="#paket-harga"
        className="btn-glassmorph w-full sm:w-auto px-7 py-3.5 rounded-full text-base font-bold text-center cursor-pointer flex items-center justify-center gap-2 group"
      >
        <span>{hero?.secondaryCta || "Cek Kebutuhan Anda"}</span>
        <svg
          className="w-4 h-4 text-pink-400 group-hover:text-pink-300 group-hover:translate-x-1 transition-all duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </>
  );

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-32 pb-0 lg:pt-40 overflow-hidden bg-gradient-to-b from-[#08091E] via-[#0E1038] to-[#18144D] text-white"
    >
      {/* 1. Subtle Pure White Glowing Spotlight for Cursor Position */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03) 45%, transparent 75%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(160px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.15), transparent 70%)`,
        }}
      />

      {/* Ambient background glows (kept dark and subtle) */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative sparkle elements (✦) */}
      <div className="absolute top-28 left-[15%] text-sky-300 text-lg opacity-80 animate-twinkle pointer-events-none">
        ✦
      </div>
      <div
        className="absolute top-40 right-[35%] text-purple-300 text-2xl opacity-75 animate-twinkle pointer-events-none"
        style={{ animationDelay: "1.2s" }}
      >
        ✦
      </div>
      <div
        className="absolute top-[60%] left-[8%] text-pink-300 text-sm opacity-60 animate-twinkle pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        ✦
      </div>
      <div
        className="absolute top-24 right-[12%] text-amber-200 text-base opacity-70 animate-twinkle pointer-events-none"
        style={{ animationDelay: "0.8s" }}
      >
        ✦
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-white/20 shadow-inner">
              <span className="text-amber-300 text-xs">✦</span>
              <span className="text-xs font-semibold tracking-wide text-sky-200">
                {hero?.badge ? hero.badge.replace(/^[✦✨★\s]+/, "") : "Solusi Digital & Kreatif Terpercaya"}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.18] text-white">
              <span className="block">{hero?.headline1 || "Bisnis Anda"}</span>
              <span className="block mt-1 sm:mt-1.5">
                {hero?.headlinePrefix2 ? (
                  <span className="mr-2">{hero.headlinePrefix2}</span>
                ) : null}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-300 to-pink-400">
                  {hero?.headlineGradient || "Layak tampil Hebat"}
                </span>
              </span>
              <span className="block mt-2.5 sm:mt-3.5">
                <span className="pink-block-highlight px-3.5 sm:px-5 py-1 sm:py-1.5 shadow-2xl min-h-[46px] sm:min-h-[54px] lg:min-h-[62px]">
                  <span className="font-handwriting font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] text-white tracking-wide drop-shadow-sm select-none">
                    {currentText || "\u00A0"}
                  </span>
                  <span className="inline-block w-[3px] h-5 sm:h-7 lg:h-8 ml-1.5 bg-white rounded-full animate-cursor-blink align-middle" />
                </span>
              </span>
            </h1>

            {/* Harga Layanan (Efek Scrolling Naik & Berganti Tulisan, dengan Titik Kelap-Kelip, Tanpa Box) */}
            <div className="pt-2 pb-1 flex items-center justify-center lg:justify-start">
              {/* Titik Kelap-Kelip Hijau (Pulsing Dot) */}
              <span className="flex h-2.5 w-2.5 relative mr-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              </span>

              {/* Scrolling Text Slot Window */}
              <div className="h-10 sm:h-11 lg:h-12 overflow-hidden relative flex items-center min-w-[200px] sm:min-w-[240px]">
                {oldPrice && (
                  <div className="absolute inset-x-0 flex items-center justify-center lg:justify-start animate-scroll-out pointer-events-none">
                    <span className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 drop-shadow-[0_2px_12px_rgba(52,211,153,0.35)] whitespace-nowrap select-none">
                      {oldPrice}
                    </span>
                  </div>
                )}
                <div
                  className={`flex items-center justify-center lg:justify-start ${
                    isScrolling ? "animate-scroll-in" : ""
                  }`}
                >
                  <span className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 drop-shadow-[0_2px_12px_rgba(52,211,153,0.35)] whitespace-nowrap select-none">
                    {activePrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <div className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <span>⚡</span> Proses Cepat
              </div>
              <div className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <span>🛡️</span> Bergaransi Penuh
              </div>
              <div className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <span>💸</span> Harga UMKM-Friendly
              </div>
            </div>

            {/* Desktop CTA Buttons: Visible on desktop (lg:), hidden on mobile */}
            <div className="hidden lg:flex flex-row items-center justify-start gap-4 pt-4">
              {ctaButtons}
            </div>
          </div>

          {/* Right Column: Scaled down compact stage + Untouched Laptop Image + Reference 3D Icons & Clustered Social Badges */}
          <div className="lg:col-span-6 relative flex flex-col justify-center items-center select-none">
            {/* Ambient backlight halo */}
            <div
              className="hero-enter-glow absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-sky-400/20 rounded-full blur-3xl transform scale-95 pointer-events-none transition-opacity duration-100"
              style={{ opacity: scrollGlowOpacity }}
            />
            <div
              className="hero-enter-glow absolute -bottom-6 w-3/4 h-16 bg-indigo-950/80 rounded-full blur-2xl pointer-events-none transition-opacity duration-100"
              style={{ opacity: scrollGlowOpacity }}
            />

            {/* Scaled-down Compact Stage Container */}
            <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square flex items-center justify-center">

              {/* ============================================================
                  LAYER 0 (z-0): GLOWING NEON RING PERSIS DI BELAKANG LAPTOP SEBAGAI GLOWNYA
                  - Kemunculan Awal: Fade in (hero-enter-glow)
                  - Scroll Parallax: Fade out & scale down mengikuti scrolling
                  ============================================================ */}
              <div className="hero-enter-glow absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div
                  className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
                  style={{
                    opacity: scrollGlowOpacity,
                    transform: `scale(${scrollGlowScale}) translate3d(${parallax.x * -6}px, ${parallax.y * -5}px, 0)`,
                  }}
                >
                  <div className="relative w-[118%] h-[118%] max-w-[560px] max-h-[560px] aspect-square flex items-center justify-center">
                    <div className="relative w-full h-full animate-spin-ring filter drop-shadow-[0_0_40px_rgba(168,85,247,0.85)] opacity-95">
                      <Image
                        src="/glowing-ring-neon.png"
                        alt="Glowing Neon Ring Laptop Backlight"
                        fill
                        priority
                        sizes="(max-width: 640px) 440px, 560px"
                        className="object-contain"
                      />
                    </div>

                    {/* Soft ambient backlight core glow right behind the laptop */}
                    <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-purple-600/35 via-pink-500/30 to-cyan-500/25 blur-3xl -z-10 animate-pulse-glow" />
                  </div>
                </div>
              </div>

              {/* ============================================================
                  LAYER 1 (z-10): Original Laptop & Phone Image (UNTOUCHED "apa adanya")
                  - Kemunculan Awal: Datang dari kanan (hero-enter-laptop)
                  - Scroll Parallax: Hilang ke kanan & fade out mengikuti scrolling
                  ============================================================ */}
              <div className="hero-enter-laptop relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                <div
                  className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out pointer-events-auto"
                  style={{
                    transform: `translate3d(${parallax.x * -8 + scrollLaptopX}px, ${parallax.y * -6}px, 0)`,
                    opacity: scrollLaptopOpacity,
                  }}
                >
                  <div className="relative w-full h-full group">
                    <Image
                      src="/hero-laptop-original.png"
                      alt="lomboXtudio Creative Agency - Solusi Laptop & Smartphone Marketing"
                      fill
                      sizes="(max-width: 1024px) 100vw, 480px"
                      priority
                      className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================
                  LAYERS 2, 3, 4 (z-20): ELEMENT / ICON MELAYANG & TWINKLING STARS
                  - Kemunculan Awal: Muncul seketika dengan zoom in spring (hero-enter-icons)
                  - Scroll Parallax: Zoom out & fade out mengecil kebalikan dari munculnya
                  ============================================================ */}
              <div className="hero-enter-icons absolute inset-0 pointer-events-none z-20">
                <div
                  className="relative w-full h-full transition-transform duration-100 ease-out"
                  style={{
                    transform: `scale(${scrollIconsScale})`,
                    transformOrigin: "center center",
                    opacity: scrollIconsOpacity,
                  }}
                >

                  {/* 1. 3D Image / Picture Gallery Icon - Smaller, on left side of laptop */}
                  <div
                    className="absolute top-20 sm:top-24 -left-3 sm:-left-1 z-20 transition-transform duration-300 ease-out animate-float-1 group cursor-pointer pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * 16}px, ${parallax.y * 14 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <div className="relative w-12 sm:w-14 h-12 sm:h-14 transition-transform duration-300 group-hover:scale-115">
                      <Image
                        src="/icon-3d-image.png"
                        alt="3D Image Gallery Visual Icon"
                        fill
                        sizes="(max-width: 640px) 48px, 56px"
                        className="object-contain drop-shadow-[0_8px_18px_rgba(56,189,248,0.55)]"
                      />
                    </div>
                  </div>

                  {/* 2. 3D Video Call / Camera (Blue rounded square with camera) - Di atas pojok layar laptop agak ke kanan */}
                  <div
                    className="absolute -top-4 sm:-top-2 left-[20%] sm:left-[24%] z-20 transition-transform duration-300 ease-out animate-float-4 group cursor-pointer pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * 14}px, ${parallax.y * 12 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <div className="relative w-11 sm:w-13 h-11 sm:h-13 transition-transform duration-300 group-hover:scale-115">
                      <Image
                        src="/icon-3d-videocall.png"
                        alt="3D Video Call Meeting Icon"
                        fill
                        sizes="(max-width: 640px) 44px, 52px"
                        className="object-contain drop-shadow-[0_8px_16px_rgba(37,99,235,0.55)]"
                      />
                    </div>
                  </div>

                  {/* 3. 3D Rupiah Money Icon (Green Banknote with Rp & golden coins) - Digeser ke atas dekat layar laptop */}
                  <div
                    className="absolute bottom-16 sm:bottom-20 -left-2 sm:left-1 z-20 transition-transform duration-300 ease-out animate-float-2 group cursor-pointer pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * 18}px, ${parallax.y * -12 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <div className="relative w-18 sm:w-22 h-18 sm:h-22 transition-transform duration-300 group-hover:scale-115">
                      <Image
                        src="/icon-3d-rupiah.png"
                        alt="3D Rupiah Money & ROI Icon"
                        fill
                        sizes="(max-width: 640px) 72px, 88px"
                        className="object-contain drop-shadow-[0_12px_24px_rgba(160,185,129,0.55)]"
                      />
                    </div>
                  </div>

                  {/* 4. 3D Handshake with Chat Bubbles - Di depan layar laptop dekat keyboard, sebelah HP */}
                  <div
                    className="absolute top-[42%] sm:top-[44%] right-[26%] sm:right-[30%] z-30 transition-transform duration-300 ease-out animate-float-3 group cursor-pointer pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * -10}px, ${parallax.y * 10 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <div className="relative w-13 sm:w-16 h-13 sm:h-16 transition-transform duration-300 group-hover:scale-115">
                      <Image
                        src="/icon-3d-handshake.png"
                        alt="3D Handshake Consultation Icon"
                        fill
                        sizes="(max-width: 640px) 52px, 64px"
                        className="object-contain drop-shadow-[0_10px_22px_rgba(236,72,153,0.55)]"
                      />
                    </div>
                  </div>

                  {/* 5. 3D Map Pin Location - TARUH DEPAN LAPTOP (di depan palm rest / keyboard base) */}
                  <div
                    className="absolute bottom-0 sm:bottom-2 left-[28%] sm:left-[32%] z-30 transition-transform duration-300 ease-out animate-float-slow group cursor-pointer pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * -6}px, ${parallax.y * -8 + scrollY * -0.01}px, 0)`,
                    }}
                  >
                    <div className="relative w-16 sm:w-20 h-16 sm:h-20 transition-transform duration-300 group-hover:scale-115">
                      <Image
                        src="/icon-3d-location.png"
                        alt="3D Studio Location Pin Depan Laptop"
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-contain drop-shadow-[0_12px_24px_rgba(239,68,68,0.65)]"
                      />
                    </div>
                  </div>

                  {/* Instagram Bubble - Clustered near upper-right of smartphone */}
                  <div
                    className="absolute top-4 sm:top-8 right-6 sm:right-10 z-20 transition-transform duration-300 ease-out animate-float-1 pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * -16}px, ${parallax.y * -14 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] shadow-[0_8px_20px_rgba(225,48,108,0.6)] border border-white/30 backdrop-blur-md flex items-center justify-center hover:scale-115 transition-transform duration-200 cursor-pointer">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  </div>

                  {/* TikTok Bubble - Compact size, between phone and laptop */}
                  <div
                    className="absolute top-24 sm:top-28 right-22 sm:right-28 z-20 transition-transform duration-300 ease-out animate-float-2 pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * -12}px, ${parallax.y * 14 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-black/85 shadow-[0_8px_18px_rgba(0,242,234,0.5)] border border-cyan-400/40 backdrop-blur-md flex items-center justify-center hover:scale-115 transition-transform duration-200 cursor-pointer">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.12-.12.23-.25.33-.38V11.8a8.28 8.28 0 0 0 5.4 2.05v-3.45a4.83 4.83 0 0 1-2.9-1.71c.64-.64 1.13-1.42 1.4-2.28l1.5.28z" />
                      </svg>
                    </div>
                  </div>

                  {/* YouTube Bubble - Near right edge of phone */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -right-1 sm:right-2 z-20 transition-transform duration-300 ease-out animate-float-4 pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * -14}px, ${parallax.y * 12 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#CC0000] to-[#FF0000] shadow-[0_8px_20px_rgba(255,0,0,0.55)] border border-white/30 backdrop-blur-md flex items-center justify-center hover:scale-115 transition-transform duration-200 cursor-pointer">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                  </div>

                  {/* Facebook Bubble - Di sekitar sudut kanan palm rest laptop di bawah smartphone */}
                  <div
                    className="absolute bottom-8 sm:bottom-12 right-[18%] sm:right-[22%] z-30 transition-transform duration-300 ease-out animate-float-2 pointer-events-auto"
                    style={{
                      transform: `translate3d(${parallax.x * -8}px, ${parallax.y * -10 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#1877F2] to-[#0A66C2] shadow-[0_8px_20px_rgba(24,119,242,0.6)] border border-white/30 backdrop-blur-md flex items-center justify-center hover:scale-115 transition-transform duration-200 cursor-pointer">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                  </div>

                  {/* ============================================================
                      COLORFUL TWINKLING MOTION STARS (✦)
                      ============================================================ */}

                  {/* Bintang 1: Kuning Emas - Dekat Icon 3D Image (Kiri Atas) */}
                  <div
                    className="absolute top-10 -left-6 sm:-left-4 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "0s",
                      transform: `translate3d(${parallax.x * 22}px, ${parallax.y * 18 + scrollY * -0.04}px, 0)`,
                    }}
                  >
                    <SparkleStar size={18} className="text-amber-300" glowColor="rgba(252, 211, 77, 0.9)" />
                  </div>

                  {/* Bintang 2: Neon Cyan - Di bawah Icon 3D Image */}
                  <div
                    className="absolute top-36 -left-4 sm:-left-2 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "1.2s",
                      transform: `translate3d(${parallax.x * 16}px, ${parallax.y * 14 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <SparkleStar size={14} className="text-cyan-300" glowColor="rgba(6, 182, 212, 0.9)" />
                  </div>

                  {/* Bintang 3: Ungu Violet - Di atas Icon 3D Video Call */}
                  <div
                    className="absolute -top-7 left-[16%] sm:left-[20%] z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "0.7s",
                      transform: `translate3d(${parallax.x * 18}px, ${parallax.y * 15 + scrollY * -0.04}px, 0)`,
                    }}
                  >
                    <SparkleStar size={16} className="text-purple-300" glowColor="rgba(192, 132, 252, 0.9)" />
                  </div>

                  {/* Bintang 4: Hot Pink - Di atas layar laptop */}
                  <div
                    className="absolute -top-3 left-[32%] sm:left-[36%] z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "1.8s",
                      transform: `translate3d(${parallax.x * 12}px, ${parallax.y * 10 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <SparkleStar size={13} className="text-pink-400" glowColor="rgba(244, 114, 182, 0.9)" />
                  </div>

                  {/* Bintang 5: Hijau Emerald - Di atas Icon 3D Rupiah */}
                  <div
                    className="absolute bottom-28 -left-6 sm:-left-4 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "2.3s",
                      transform: `translate3d(${parallax.x * 20}px, ${parallax.y * -14 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <SparkleStar size={16} className="text-emerald-300" glowColor="rgba(52, 211, 153, 0.9)" />
                  </div>

                  {/* Bintang 6: Warm Amber - Di bawah Icon 3D Rupiah */}
                  <div
                    className="absolute bottom-8 -left-5 sm:-left-3 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "1.4s",
                      transform: `translate3d(${parallax.x * 14}px, ${parallax.y * -10 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <SparkleStar size={13} className="text-amber-200" glowColor="rgba(253, 224, 71, 0.9)" />
                  </div>

                  {/* Bintang 7: Putih Kristal - Di antara Handshake & Layar */}
                  <div
                    className="absolute top-[34%] right-[22%] sm:right-[26%] z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "1.9s",
                      transform: `translate3d(${parallax.x * -12}px, ${parallax.y * 8 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <SparkleStar size={12} className="text-white" glowColor="rgba(255, 255, 255, 0.95)" />
                  </div>

                  {/* Bintang 8: Biru Langit - Dekat Icon Maps di depan laptop */}
                  <div
                    className="absolute bottom-6 left-[18%] sm:left-[22%] z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "0.5s",
                      transform: `translate3d(${parallax.x * -8}px, ${parallax.y * -6 + scrollY * -0.01}px, 0)`,
                    }}
                  >
                    <SparkleStar size={15} className="text-sky-300" glowColor="rgba(56, 189, 248, 0.9)" />
                  </div>

                  {/* Bintang 9: Magenta Pink - Di atas Icon Instagram */}
                  <div
                    className="absolute -top-1 right-12 sm:right-16 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "0.9s",
                      transform: `translate3d(${parallax.x * -18}px, ${parallax.y * -16 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <SparkleStar size={18} className="text-pink-400" glowColor="rgba(244, 114, 182, 0.95)" />
                  </div>

                  {/* Bintang 10: Neon Cyan - Di sebelah kanan HP */}
                  <div
                    className="absolute top-18 -right-3 sm:right-1 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "2.1s",
                      transform: `translate3d(${parallax.x * -16}px, ${parallax.y * 14 + scrollY * -0.03}px, 0)`,
                    }}
                  >
                    <SparkleStar size={15} className="text-cyan-300" glowColor="rgba(6, 182, 212, 0.9)" />
                  </div>

                  {/* Bintang 11: Merah Crimson - Di bawah Icon YouTube */}
                  <div
                    className="absolute top-[60%] -right-4 sm:-right-2 z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "1.5s",
                      transform: `translate3d(${parallax.x * -12}px, ${parallax.y * 10 + scrollY * -0.02}px, 0)`,
                    }}
                  >
                    <SparkleStar size={14} className="text-rose-400" glowColor="rgba(251, 113, 133, 0.9)" />
                  </div>

                  {/* Bintang 12: Kuning Emas - Di samping Icon Facebook */}
                  <div
                    className="absolute bottom-4 right-[10%] sm:right-[14%] z-35 pointer-events-none animate-twinkle"
                    style={{
                      animationDelay: "0.3s",
                      transform: `translate3d(${parallax.x * -6}px, ${parallax.y * -8 + scrollY * -0.01}px, 0)`,
                    }}
                  >
                    <SparkleStar size={16} className="text-amber-300" glowColor="rgba(252, 211, 77, 0.9)" />
                  </div>

                </div>
              </div>

            </div>

            {/* Mobile CTA Buttons: Placed below the image on mobile screens, hidden on desktop (lg:) */}
            <div className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xs sm:max-w-md mx-auto mt-8 sm:mt-10 z-30 select-auto">
              {ctaButtons}
            </div>
          </div>
        </div>

      </div>

      {/* Wave Transition to Next Section (Matching Reference Wave Shape) */}
      <div className="relative w-full overflow-hidden leading-none mt-10 sm:mt-14 lg:mt-16 -mb-[1px]">
        <svg
          className="relative block w-full h-16 sm:h-24 md:h-28 lg:h-36 text-[#F8FAFF]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d="M 0,42 C 280,95 570,20 720,20 C 870,20 1300,115 1440,94 L 1440,120 L 0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}

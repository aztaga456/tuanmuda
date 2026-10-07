"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";

interface NavbarProps {
  onOpenBooking: (service?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Layanan", href: "#layanan" },
    { label: "Mengapa Kami", href: "#mengapa-kami" },
    { label: "Paket & Harga", href: "#paket-harga" },
    { label: "Portofolio", href: "#portofolio" },
    { label: "Promo UMKM", href: "#promo-umkm" },
    { label: "Proses Kerja", href: "#proses-kerja" },
  ];

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-0 py-2.5 sm:py-3.5 bg-[#08091e]/70 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          : "top-3 sm:top-5 py-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* 1. LOGO TUANMUDA */}
        <a href="#" className="pointer-events-auto flex items-center group shrink-0">
          <Logo variant="white" />
        </a>

        {/* 2. MENU LINKS DI DALAM SHAPE MINIMALIS (Hanya Bagian Ini Saja) */}
        <nav
          className={`pointer-events-auto hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
            scrolled ? "glass-nav-pill-scrolled" : "glass-nav-pill"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="glass-nav-link px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-200 rounded-full whitespace-nowrap cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* 3. TOMBOL KONSULTASI DI LUAR SHAPE (Pojok Kanan) */}
        <div className="pointer-events-auto hidden md:flex items-center shrink-0">
          <button
            onClick={() => onOpenBooking()}
            className="btn-gradient-cta px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold text-white cursor-pointer shadow-lg inline-flex items-center gap-2 hover:shadow-purple-500/30 transition-all duration-200 hover:scale-105"
          >
            <span>Konsultasi Gratis</span>
            <svg
              className="w-4 h-4"
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
        </div>

        {/* Mobile Action & Menu Button (Di Luar Shape) */}
        <div className="pointer-events-auto flex lg:hidden items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenBooking()}
            className="btn-gradient-cta px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-md"
          >
            Konsultasi
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white/10 border border-white/15 text-slate-200 hover:text-white hover:bg-white/20 backdrop-blur-md focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Card */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden max-w-sm mx-auto mt-2 p-4 rounded-2xl bg-[#0a0c26]/95 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-1 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-base font-semibold text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-600 rounded-xl transition-all duration-200 hover:shadow-[0_4px_16px_rgba(236,72,153,0.35)]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn-gradient-cta w-full py-3 rounded-full text-center text-sm font-bold text-white shadow-lg cursor-pointer"
            >
              Booking Konsultasi Gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

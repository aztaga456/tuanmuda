"use client";

import { useState } from "react";

interface UmkmPromoBannerProps {
  onOpenBooking: (serviceType?: string) => void;
}

export default function UmkmPromoBanner({ onOpenBooking }: UmkmPromoBannerProps) {
  // Service selection for discount calculation simulation
  const [selectedService, setSelectedService] = useState<number>(0);

  const estimateItems = [
    { name: "Website Landing Page", normalPrice: 300000, discountPct: 15 },
    { name: "Web + Panel Admin (Paling Laris)", normalPrice: 400000, discountPct: 15 },
    { name: "Custom Web Extend", normalPrice: 450000, discountPct: 15 },
    { name: "Kelola Sosmed - Paket 12 Feeds", normalPrice: 500000, discountPct: 20 },
    { name: "Kelola Sosmed - Paket 20 Feeds (Populer)", normalPrice: 800000, discountPct: 20 },
    { name: "Kelola Sosmed - Paket 30 Feeds", normalPrice: 2000000, discountPct: 20 },
    { name: "Video & Image Ads (1 Video + 2 Image)", normalPrice: 100000, discountPct: 15 },
    { name: "Video & Image Ads (4 Video + 2 Image)", normalPrice: 200000, discountPct: 15 },
    { name: "Jasa Meta Ads - Paket Starter", normalPrice: 30000, discountPct: 15 },
    { name: "Jasa Meta Ads - Scale Up Pro", normalPrice: 150000, discountPct: 20 },
    { name: "Optimasi SEO - Bisnis & Maps", normalPrice: 250000, discountPct: 20 },
  ];

  const current = estimateItems[selectedService];
  const discountAmount = Math.round((current.normalPrice * current.discountPct) / 100);
  const finalPrice = current.normalPrice - discountAmount;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="promo-umkm" className="py-16 sm:py-20 bg-[#F0F5FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blue Gradient Banner matching UI.jpg banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          {/* Background blurred orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Promo Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-sky-100 text-xs font-bold border border-white/20">
                <span>✦</span> Program Khusus Pemberdayaan Usaha
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                UMKM Naik Kelas? <br />
                Kami Bantu dengan{" "}
                <span className="text-amber-300 underline decoration-amber-400/60 decoration-wavy">
                  Harga Spesial.
                </span>
              </h2>

              <p className="text-sky-100 text-sm sm:text-base leading-relaxed max-w-xl">
                Sebagai komitmen studio lokal di Lombok Timur, kami memberikan potongan harga resmi 15% - 20% bagi pemilik usaha mikro dan kecil untuk semua paket website, konten promosi, dan sosial media.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-amber-300 font-bold text-sm">Syarat Mudah</div>
                  <div className="text-xs text-sky-100 mt-1">Cukup foto tempat usaha atau akun medsos bisnis</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-amber-300 font-bold text-sm">Diskon 15-20%</div>
                  <div className="text-xs text-sky-100 mt-1">Langsung dipotongkan di invoice resmi</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <div className="text-amber-300 font-bold text-sm">Garansi Tetap Penuh</div>
                  <div className="text-xs text-sky-100 mt-1">Kualitas dan garansi perbaikan tetap sama</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onOpenBooking(current.name)}
                  className="px-8 py-3.5 rounded-full bg-white text-indigo-700 font-extrabold text-sm sm:text-base shadow-xl hover:bg-sky-50 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Klaim Diskon UMKM Sekarang</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Discount Simulator Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Simulasi Hemat Biaya UMKM
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Diskon {current.discountPct}%
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Pilih Layanan yang Anda Butuhkan:
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-indigo-500 font-medium text-slate-800"
                  >
                    {estimateItems.map((item, idx) => (
                      <option key={item.name} value={idx}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculation breakdown */}
                <div className="mt-5 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Harga Normal:</span>
                    <span className="line-through">{formatRupiah(current.normalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <span>Diskon Khusus UMKM ({current.discountPct}%):</span>
                    <span>- {formatRupiah(discountAmount)}</span>
                  </div>
                  <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Estimasi Investasi:</div>
                      <div className="text-2xl font-extrabold text-indigo-700">
                        {formatRupiah(finalPrice)}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-indigo-100 text-indigo-800 font-bold">
                      Hemat {formatRupiah(discountAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => onOpenBooking(current.name)}
                    className="btn-gradient-cta w-full py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md text-center"
                  >
                    Ambil Kuota Diskon {current.name} →
                  </button>
                  <div className="text-[10px] text-center text-slate-400 mt-2">
                    *Tersedia untuk 10 slot UMKM pertama setiap bulannya
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

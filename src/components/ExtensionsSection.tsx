"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";
import { getSafeImageUrl } from "@/lib/image-helper";

interface ExtensionItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  image: string;
  desc: string;
  details: string[];
  gradient?: string;
  shadowColor?: string;
}

interface ExtensionsSectionProps {
  onSelectExtension?: (title: string) => void;
}

export default function ExtensionsSection({}: ExtensionsSectionProps) {
  const { content } = useContent();
  const extData = content?.extensions;

  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [activeModal, setActiveModal] = useState<ExtensionItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);

  const items: ExtensionItem[] = [
    {
      id: "workshop-ai",
      title: "Workshop AI Basic untuk Bisnis",
      category: "Edukasi & Pelatihan",
      badge: "Umum & Privat 1-on-1",
      image: "/ext-workshop-ai.jpg",
      desc: "Kuasai ChatGPT, Midjourney, Canva AI, dan otomasi prompt praktis dari nol untuk mempercepat pekerjaan harian dan melipatgandakan produktivitas operasional usaha Anda.",
      details: [
        "Belajar langsung praktik (hands-on) dari nol tanpa dasar IT",
        "Ratusan template prompt bisnis siap pakai harian",
        "Sertifikat resmi & grup mentoring tanya-jawab pasca-kelas",
        "Tersedia skema in-house training khusus tim perusahaan",
      ],
      gradient: "from-blue-600 via-indigo-600 to-violet-700",
      shadowColor: "shadow-indigo-500/25",
    },
    {
      id: "foto-produk-ai",
      title: "Pelatihan Foto Produk dengan AI",
      category: "Produksi Konten Cepat",
      badge: "Tanpa Studio Mahal",
      image: "/ext-photo-ai.jpg",
      desc: "Ubah foto kamera HP biasa menjadi visual katalog estetik berkelas brand internasional menggunakan generative AI. Hemat jutaan rupiah biaya fotografer studio.",
      details: [
        "Membuat latar belakang studio fotorealistis dalam hitungan detik",
        "Model AI manusia untuk produk fashion, F&B, dan retail",
        "Export resolusi tinggi siap cetak & posting feeds/reels",
        "Panduan prompt visual konsisten per kategori produk",
      ],
      gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
      shadowColor: "shadow-pink-500/25",
    },
    {
      id: "packaging-kemasan",
      title: "Desain Packaging & Kemasan Produk",
      category: "Branding Fisik",
      badge: "Siap Cetak & Dieline",
      image: "/ext-packaging.jpg",
      desc: "Kemasan produk unik dan memikat mata di etalase toko yang mendongkrak nilai jual (perceived value) serta loyalitas pembeli terhadap brand Anda.",
      details: [
        "Format pouch, standing box, botol, label stiker, & paperbag",
        "File vector presisi (AI/PDF) dengan garis potong (dieline) siap cetak",
        "Visual mockup 3D realistis untuk display promosi online",
        "Konsultasi pemilihan bahan kemasan & rekomendasi vendor cetak",
      ],
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      shadowColor: "shadow-amber-500/25",
    },
    {
      id: "custom-webapp",
      title: "Web App & Sistem Kustom Sederhana",
      category: "Software & Digitalisasi",
      badge: "Sesuai Kebutuhan Nyata",
      image: "/ext-webapp.jpg",
      desc: "Aplikasi web fungsional yang benar-benar mempermudah rutinitas: portal raport sekolah, absensi & tugas guru, POS kasir toko, hingga dashboard inventaris stok.",
      details: [
        "Akses mudah dan ringan langsung dari smartphone & laptop",
        "Database cloud aman, backup otomatis & update data realtime",
        "Desain antarmuka simpel, sangat ramah pengguna non-teknis",
        "Dukungan teknis berkala & garansi pemeliharaan sistem",
      ],
      gradient: "from-teal-600 via-emerald-600 to-cyan-600",
      shadowColor: "shadow-emerald-500/25",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Top & Bottom Seamless Edge Overlays */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10" />

      {/* Seamless Fading Mask Container for Blurred Color Splashes */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 150px, black calc(100% - 120px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 150px, black calc(100% - 120px), transparent 100%)",
        }}
      >
        <div className="absolute top-14 sm:top-20 -right-16 sm:-right-20 w-[460px] h-[460px] bg-gradient-to-bl from-purple-400/25 via-pink-400/20 to-indigo-300/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-8 -left-16 sm:-left-20 w-[440px] h-[440px] bg-gradient-to-tr from-sky-400/25 via-cyan-300/20 to-indigo-300/15 rounded-full blur-[90px]" />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 transition-opacity duration-300 ${
          isInView ? "animate-slide-in-left" : "opacity-0"
        }`}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/70 border border-purple-200 text-xs font-semibold text-purple-800 mb-3">
            <span>✦</span> {extData?.badge || "Layanan Ekstensi Unggulan"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {extData?.title || "Lebih Dari Sekadar Website."}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5">
            {extData?.narrative ||
              "TUANMUDA melengkapi ekosistem bisnis Anda dengan kecerdasan buatan, desain produk fisik, dan aplikasi terintegrasi."}
          </p>
        </div>

        {/* 4 Minimalist Portrait Shapes in a Single Row (Gambar Thumbnail Portrait di Atas Judul) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {(extData?.items?.length ? extData.items : items).map((item: any) => (
            <div
              key={item.id}
              onClick={() => setActiveModal(item)}
              className="group glass-card-light glass-card-hover rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 hover:border-indigo-300/90 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Subtle top glow */}
              <div
                className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${item.gradient || "from-blue-600 to-indigo-600"} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`}
              />

              <div>
                {/* Portrait Thumbnail Container di Atas Judul */}
                <div className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 bg-slate-100 shadow-inner">
                  {item.image?.startsWith("data:") || item.image?.startsWith("http") ? (
                    <img
                      src={getSafeImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                      src={item.image || "/ext-workshop-ai.jpg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-106 transition-transform duration-500"
                    />
                  )}
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Pill Tag on Image */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-bold tracking-wide border border-white/20 shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Badge Label on Bottom Left of Image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[10px] font-semibold text-slate-200 line-clamp-1">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Tulisan Judul di Bawah Gambar Thumbnail */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2 px-1 min-h-[42px] flex items-center">
                  {item.title}
                </h3>
              </div>

              {/* Action Button: Detail */}
              <div className="w-full pt-3 mt-3 border-t border-slate-100 px-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal(item);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white border border-slate-200/80 group-hover:border-indigo-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <span>Lihat Detail</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Detail Popup Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top corner gradient ambient glow */}
            <div
              className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${activeModal.gradient} opacity-20 rounded-full blur-3xl pointer-events-none`}
            />

            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer z-20 backdrop-blur-sm"
              aria-label="Tutup Detail"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header Thumbnail Banner */}
            <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-5 bg-slate-100 shadow-md">
              {activeModal.image?.startsWith("data:") || activeModal.image?.startsWith("http") ? (
                <img
                  src={getSafeImageUrl(activeModal.image)}
                  alt={activeModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Image
                  src={activeModal.image || "/ext-workshop-ai.jpg"}
                  alt={activeModal.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/80 text-white backdrop-blur-xs">
                    {activeModal.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/20">
                    {activeModal.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-sm">
                  {activeModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeModal.desc}
            </p>

            {/* Key Deliverables / What You Get */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Materi & Benefit Program:
              </h4>
              <div className="space-y-2.5">
                {activeModal.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button: WhatsApp Direct Link (Directs to WhatsApp, NOT form) */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo TUANMUDA, saya ingin menanyakan info detail & konsultasi mengenai program: ${activeModal.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer text-center"
              >
                {/* Official WhatsApp Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Tanyakan Program Ini</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


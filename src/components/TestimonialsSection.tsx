"use client";

import { useContent } from "@/context/ContentContext";

export default function TestimonialsSection() {
  const { content } = useContent();
  const testiData = content?.testimonials;

  const testimonials = [
    {
      name: "H. Syamsul Arifin",
      role: "Owner",
      company: "Rinjani Vista Resort & Tour, Senaru",
      rating: 5,
      content:
        "Sebelumnya web kami sering error dan tampilan jadul. Setelah di-rebuild oleh tim TUANMUDA, website kelihatan sangat mewah dan cepat. Tamu mancanegara langsung percaya untuk booking direct. Omset reservasi kami melonjak drastis!",
      avatarBg: "bg-blue-600",
      initial: "S",
    },
    {
      name: "Dewi Anggraini",
      role: "Founder",
      company: "Aruna Modest Fashion Selong",
      rating: 5,
      content:
        "Paket Meta Ads dan video reels TUANMUDA bener-bener ngefek. Penjualan gamis lebaran kemarin closing sampai ribuan pcs, ROAS stabil di atas 5x. Komunikasi timnya juga sangat ramah dan transparan.",
      avatarBg: "bg-pink-600",
      initial: "D",
    },
    {
      name: "Lalu Fauzi, S.Pd",
      role: "Kepala IT & Kurikulum",
      company: "Sekolah Cendes Selong, NTB",
      rating: 5,
      content:
        "Sistem web raport & absensi guru yang dibuatkan sangat mempermudah 85 guru kami. Guru-guru yang awalnya gaptek pun bisa pakai dengan mudah karena interfacenya simpel dan ada video panduan langsung dari mas-mas TUANMUDA.",
      avatarBg: "bg-emerald-600",
      initial: "F",
    },
    {
      name: "M. Rizal Hadi",
      role: "Pengelola Cafe & Roastery",
      company: "Sasak Specialty Coffee, Lombok Timur",
      rating: 5,
      content:
        "Sangat senang ada studio digital fisik yang beneran ada di Selong! Kami bisa tatap muka langsung, diskusi konsep branding biji kopi sampai tuntas. Sekarang kemasan & website beans kami sudah kirim ke berbagai kota di Indonesia.",
      avatarBg: "bg-amber-600",
      initial: "R",
    },
    {
      name: "dr. Baiq Nadira",
      role: "Managing Director",
      company: "DermaGlow Aesthetic Clinic, Praya",
      rating: 5,
      content:
        "Website klinik kami sekarang terintegrasi langsung dengan booking WhatsApp & dokter jaga. Pasien baru dari luar kota mudah menemukan lokasi di Google Maps. Desainnya sangat bersih, higienis, dan terpercaya.",
      avatarBg: "bg-purple-600",
      initial: "N",
    },
    {
      name: "Hendra Saputra",
      role: "Direktur Operasional",
      company: "CV Rinjani Agro Mandiri, Lombok Timur",
      rating: 5,
      content:
        "Rebranding packaging madu hutan dan ekspor web profile kami dipuji buyer nasional. Tim TUANMUDA sangat detail mulai dari pemilihan bahan cetak dieline hingga foto produk 3D katalog. Sangat recommended!",
      avatarBg: "bg-teal-600",
      initial: "H",
    },
  ];

  const activeTestimonials = testiData?.items?.length ? testiData.items : testimonials;

  // Duplikat array agar tercipta scrolling continue (seamless infinite marquee)
  const scrollingTestimonials = [...activeTestimonials, ...activeTestimonials];

  return (
    <section className="pt-20 lg:pt-28 pb-0 bg-[#F8FAFF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-xs font-semibold text-amber-800 mb-3">
            <span>★</span> {testiData?.badge || "Ulasan Kepuasan Klien"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {testiData?.title || "Kata Mereka yang Sudah Tumbuh Bersama Kami."}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            {testiData?.narrative ||
              "Kepercayaan klien adalah aset terbesar kami. Simak cerita sukses brand dan instansi di Lombok & sekitarnya."}
          </p>
        </div>
      </div>

      {/* Continuous Marquee Scrolling Track (Tampil 4 kartu di desktop, scrolling continue) */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Soft Fade Gradients */}
        <div className="absolute left-0 inset-y-0 w-8 sm:w-20 md:w-28 bg-gradient-to-r from-[#F8FAFF] via-[#F8FAFF]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 sm:w-20 md:w-28 bg-gradient-to-l from-[#F8FAFF] via-[#F8FAFF]/90 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee-continuous flex items-stretch gap-5 sm:gap-6 pl-4">
          {scrollingTestimonials.map((t, idx) => (
            <div
              key={`${t.name}-${idx}`}
              className="w-[285px] sm:w-[295px] md:w-[305px] lg:w-[315px] shrink-0 glass-card-light rounded-3xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-indigo-300/80 transition-all duration-300 select-none"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3 text-sm">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic line-clamp-5">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0`}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave Transition to Dark CTA Section (Matching Hero Wave Shape) */}
      <div className="relative w-full overflow-hidden leading-none mt-14 sm:mt-18 lg:mt-20 -mb-[1px]">
        <svg
          className="relative block w-full h-16 sm:h-24 md:h-28 lg:h-36 text-[#090B24]"
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


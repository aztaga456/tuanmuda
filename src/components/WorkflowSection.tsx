"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useContent } from "@/context/ContentContext";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function WorkflowSection() {
  const { content } = useContent();
  const workflowData = content?.workflow;
  const brandName = content?.brand?.name || "TUANMUDA";
  const waNumber = content?.brand?.whatsappNumber;

  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: "01",
      title: "Konsultasi Kebutuhan",
      desc: "Diskusi mendalam untuk membedah target pasar, fitur, dan strategi terbaik (online via WhatsApp / Google Meet atau tatap muka di Studio Selong).",
      deliverable: "Scope kerja & rekomendasi solusi",
      gradient: "from-blue-600 to-indigo-600",
      headerLight: "bg-blue-50/90 border-blue-100",
      pillLight: "bg-blue-600 text-white",
      titleColor: "text-blue-950",
    },
    {
      step: "02",
      title: "DP & Kickoff",
      desc: "Persetujuan proposal resmi, pembayaran DP transparan (50%), dan pembuatan timeline pengerjaan tertulis.",
      deliverable: "Surat perjanjian kerja & invoice DP",
      gradient: "from-amber-500 to-orange-600",
      headerLight: "bg-amber-50/90 border-amber-100",
      pillLight: "bg-amber-600 text-white",
      titleColor: "text-amber-950",
    },
    {
      step: "03",
      title: "Proses Pengerjaan",
      desc: "Tim desainer & engineer kami mulai mengeksekusi visual, copy, koding, dan integrasi dengan standar mutu tinggi.",
      deliverable: "Staging preview & update berkala",
      gradient: "from-violet-600 to-purple-600",
      headerLight: "bg-purple-50/90 border-purple-100",
      pillLight: "bg-purple-600 text-white",
      titleColor: "text-purple-950",
    },
    {
      step: "04",
      title: "Review & Presentasi",
      desc: "Kami mempresentasikan hasil kerja via link live staging. Anda mengecek dan mengajukan revisi sesuai kuota paket.",
      deliverable: "Penyempurnaan detail revisi",
      gradient: "from-cyan-600 to-teal-600",
      headerLight: "bg-cyan-50/90 border-cyan-100",
      pillLight: "bg-cyan-600 text-white",
      titleColor: "text-cyan-950",
    },
    {
      step: "05",
      title: "Pelunasan",
      desc: "Penyelesaian sisa invoice setelah hasil pengerjaan disetujui 100% dan siap diluncurkan ke publik.",
      deliverable: "Invoice lunas resmi",
      gradient: "from-emerald-600 to-teal-700",
      headerLight: "bg-emerald-50/90 border-emerald-100",
      pillLight: "bg-emerald-600 text-white",
      titleColor: "text-emerald-950",
    },
    {
      step: "06",
      title: "Serah Terima & Garansi",
      desc: "Penyerahan akses website/hosting, file master mentahan, video panduan cara pakai, serta aktivasi garansi perbaikan bug.",
      deliverable: "Berita acara & kartu garansi aktif",
      gradient: "from-rose-500 to-pink-600",
      headerLight: "bg-rose-50/90 border-rose-100",
      pillLight: "bg-rose-600 text-white",
      titleColor: "text-rose-950",
    },
  ];

  const activeSteps = workflowData?.steps?.length ? workflowData.steps : steps;

  return (
    <section id="proses-kerja" className="py-20 lg:py-28 bg-white relative overflow-hidden">
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
        <div className="absolute top-14 sm:top-20 -left-16 sm:-left-20 w-[440px] h-[440px] bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-sky-300/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-8 -right-16 sm:-right-20 w-[460px] h-[460px] bg-gradient-to-tl from-pink-400/25 via-rose-300/20 to-purple-400/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-3">
            <span>⚡</span> {workflowData?.badge || "Alur Kerja Transparan"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {workflowData?.title || "6 Langkah Mudah Dari Ide Sampai Jadi."}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            {workflowData?.narrative ||
              "Tidak ada kebingungan atau proyek mangkrak. Setiap tahapan memiliki panduan waktu dan hasil terukur."}
          </p>
        </div>

        {/* Desktop Interactive Timeline Step Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {activeSteps.map((item: any, index) => {
            const isSelected = activeStep === index;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(index)}
                style={{ animationDelay: `${index * 80}ms` }}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isInView ? "animate-slide-in-bottom" : "opacity-0"
                } ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/15 scale-102 ring-2 ring-indigo-500/20"
                    : "bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md"
                }`}
              >
                {/* Bagian Judul: Warna Berbeda (Distinct Colored Header Shape) */}
                <div
                  className={`p-3.5 sm:p-4 border-b transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${item.gradient} text-white border-white/10 shadow-inner`
                      : `${item.headerLight} border-b text-slate-900`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-white/20 text-white backdrop-blur-xs font-black"
                          : `${item.pillLight} font-black shadow-2xs`
                      }`}
                    >
                      {item.step}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        isSelected ? "text-white/80" : "text-slate-500 font-semibold"
                      }`}
                    >
                      Tahap {index + 1}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-extrabold leading-snug line-clamp-2 min-h-[38px] flex items-center ${
                      isSelected ? "text-white" : item.titleColor
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Bagian Konten & Output (Body) */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <p
                    className={`text-[11px] leading-relaxed line-clamp-3 ${
                      isSelected ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {item.desc}
                  </p>

                  <div
                    className={`pt-3 mt-3 border-t text-[10px] ${
                      isSelected ? "border-slate-800 text-sky-200" : "border-slate-100 text-slate-500"
                    }`}
                  >
                    <span className="font-semibold block mb-0.5 text-slate-400">Output:</span>
                    <span className={`font-bold ${isSelected ? "text-sky-300" : "text-slate-800"}`}>
                      {item.deliverable}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Spotlight */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-sky-50/80 border border-indigo-100 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              <span>Detail Tahap Aktif:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-200/60 font-black">
                {activeSteps[activeStep % activeSteps.length]?.step} — {activeSteps[activeStep % activeSteps.length]?.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeSteps[activeStep % activeSteps.length]?.desc}
            </p>
            <div className="text-xs text-indigo-900 font-semibold pt-1">
              ✓ Dokumen & Output: <span className="underline">{activeSteps[activeStep % activeSteps.length]?.deliverable}</span>
            </div>
          </div>

          <a
            href={getWhatsAppUrl(
              `Halo ${brandName}, saya ingin konsultasi tahapan pengerjaan project baru (${activeSteps[activeStep % activeSteps.length]?.step} - ${activeSteps[activeStep % activeSteps.length]?.title}). Mohon panduan alurnya.`,
              waNumber
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-blue-pill px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shrink-0 shadow-md text-center"
          >
            Konsultasi Sekarang →
          </a>
        </div>
      </div>
    </section>
  );
}


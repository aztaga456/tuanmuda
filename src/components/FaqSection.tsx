"use client";

import { useState } from "react";
import { useContent } from "@/context/ContentContext";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function FaqSection() {
  const { content } = useContent();
  const brandName = content?.brand?.name || "lomboXtudio";
  const waNumber = content?.brand?.whatsappNumber;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Berapa lama waktu pengerjaan sebuah project website atau iklan?",
      a: "Untuk Landing Page cepat dan materi Video Ads, pengerjaan dapat selesai mulai dari 3 hingga 5 hari kerja setelah data brief lengkap dan DP diterima. Untuk Website Company Profile standar memakan waktu 7–14 hari kerja, sedangkan Web App Custom atau sistem kompleks biasanya membutuhkan waktu 2–4 minggu dengan jadwal sprint teratur.",
    },
    {
      q: "Apa saja cakupan garansi setelah serah terima project?",
      a: "Setiap paket website kami sertakan Garansi Bebas Bug & Error selama 30 hingga 90 hari purna jual. Jika terjadi kendala teknis atau tampilan berantakan di browser tertentu, tim teknis kami akan memperbaikinya tanpa biaya tambahan. Anda juga mendapatkan panduan video pengoperasian mandiri.",
    },
    {
      q: "Apakah boleh mulai dengan paket langganan lalu membeli putus di kemudian hari?",
      a: "Sangat boleh! Skema Langganan dirancang agar bisnis pemula atau UMKM tidak terbebani modal awal yang besar. Kapan pun usaha Anda berkembang dan ingin membeli lisensi lepas (beli putus), Anda cukup membayar selisih biaya konversi yang dihitung secara adil.",
    },
    {
      q: "Bagaimana syarat dan alur mendapatkan Diskon Khusus UMKM 15–20%?",
      a: "Caranya sangat mudah. Saat melakukan booking konsultasi, centang opsi 'Saya Pelaku UMKM'. Cukup lampirkan bukti foto tempat/gerai usaha, akun media sosial bisnis, atau nomor NIB jika ada. Tim kami akan langsung memvalidasi dan memotong biaya di proposal/invoice resmi Anda.",
    },
    {
      q: "Apa saja metode pembayaran yang diterima di lomboXtudio?",
      a: "Kami menerima Transfer Bank (BCA, Mandiri, BRI, BNI), QRIS instan untuk semua e-wallet (GoPay, OVO, Dana, ShopeePay), serta Virtual Account otomatis melalui payment gateway resmi berizin.",
    },
    {
      q: "Apakah kami bisa berkonsultasi tatap muka langsung di Studio Selong?",
      a: "Tentu saja! Official Studio kami berlokasi di Selong, Lombok Timur, NTB. Anda sangat dipersilakan datang langsung untuk bertukar pikiran, membedah strategi bisnis, atau melihat demo sistem secara langsung. Anda juga bisa memilih konsultasi online via Google Meet jika berada di luar kota.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white relative overflow-hidden">
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
        <div className="absolute top-14 sm:top-20 -right-16 sm:-right-20 w-[420px] h-[420px] bg-gradient-to-bl from-pink-400/20 via-purple-400/20 to-sky-300/15 rounded-full blur-[95px]" />
        <div className="absolute bottom-8 -left-16 sm:-left-20 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 via-sky-300/15 to-indigo-300/15 rounded-full blur-[85px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-3">
            <span>❓</span> Tanya Jawab Umum
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Jawaban transparan untuk membantu Anda memulai langkah digital bersama lomboXtudio.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 bg-white"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-indigo-50 text-indigo-600" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-sm font-bold text-indigo-950">Masih punya pertanyaan khusus tentang bisnis Anda?</div>
            <div className="text-xs text-indigo-700 mt-0.5">Tim konsultan kami di Selong siap menjawab kapan saja.</div>
          </div>
          <a
            href={getWhatsAppUrl(
              `Halo ${brandName}, saya punya pertanyaan khusus seputar layanan & solusi digital untuk bisnis saya.`,
              waNumber
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient-cta px-6 py-2.5 rounded-full text-xs font-bold text-white shrink-0 shadow-md"
          >
            Chat WhatsApp Kami
          </a>
        </div>
      </div>
    </section>
  );
}

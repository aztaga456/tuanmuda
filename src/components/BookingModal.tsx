"use client";

import { useState, useEffect } from "react";
import { useContent } from "@/context/ContentContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialService = "Website - Landing Page",
}: BookingModalProps) {
  const { content } = useContent();
  const waNumber = content?.brand?.whatsappNumber || "6281234567890";

  const [service, setService] = useState(initialService);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [meetingType, setMeetingType] = useState<"studio" | "online">("studio");
  const [isUmkm, setIsUmkm] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simpan lead ke Database via /api/bookings
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          businessName,
          service,
          budget: isUmkm ? "Diskon UMKM (15-20%)" : "Standar",
          notes: `[Format: ${meetingType === "studio" ? "Studio Selong" : "Online"}] [UMKM: ${isUmkm ? "Ya" : "Tidak"}] ${notes ? `Catatan: ${notes}` : ""}`,
        }),
      });
    } catch (err) {
      console.warn("Penyimpanan booking ke database lewati fallback:", err);
    } finally {
      setIsSubmitting(false);
    }

    // Prepare WhatsApp message
    const text = `*FORM BOOKING KONSULTASI lomboXtudio*
---------------------------------------
👤 *Nama:* ${name}
🏢 *Nama Bisnis:* ${businessName}
📱 *WhatsApp:* ${whatsapp}
🎯 *Layanan:* ${service}
📍 *Format Konsultasi:* ${
      meetingType === "studio"
        ? "Tatap Muka di Studio Selong, Lombok Timur"
        : "Online (Google Meet / Video Call)"
    }
🏷️ *Status UMKM:* ${isUmkm ? "Ya (Klaim Diskon UMKM 15-20%)" : "Bukan UMKM"}
📝 *Catatan / Kebutuhan:* ${notes || "-"}
---------------------------------------
Halo tim lomboXtudio, saya ingin mendiskusikan kebutuhan project di atas. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;

    setSubmitted(true);

    // Open WhatsApp in new tab after slight delay
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer text-sm"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Studio Booking System
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Booking Konsultasi Gratis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Diskusikan rencana bisnis Anda. Tim kami akan menyiapkan estimasi timeline dan anggaran terbaik.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs sm:text-sm">
              {/* Service Selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Pilih Layanan</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-indigo-500 font-medium text-slate-800"
                >
                  {service && (
                    <option value={service} className="font-bold text-indigo-700">
                      ✓ {service} (Paket Terpilih)
                    </option>
                  )}
                  <optgroup label="Website & Landing Page">
                    <option value="Website - Landing Page">Website Landing Page (Mulai Rp 300.000 / Rp 200.000)</option>
                    <option value="Website - Web + Panel Admin">Web + Panel Admin (Mulai Rp 400.000 / Rp 300.000)</option>
                    <option value="Website - Custom Web Extend">Custom Web Extend (Mulai Rp 450.000)</option>
                  </optgroup>
                  <optgroup label="Kelola Sosial Media (Facebook & Instagram)">
                    <option value="Kelola Sosmed - Paket 12 Feeds">Kelola Sosmed - Paket 12 Feeds (Rp 500.000/bln)</option>
                    <option value="Kelola Sosmed - Paket 20 Feeds">Kelola Sosmed - Paket 20 Feeds (Rp 800.000/bln)</option>
                    <option value="Kelola Sosmed - Paket 30 Feeds">Kelola Sosmed - Paket 30 Feeds (Rp 2.000.000/bln)</option>
                    <option value="Kelola Sosmed - Paket Custom">Kelola Sosmed - Paket Custom (Konsultasi)</option>
                  </optgroup>
                  <optgroup label="Video & Image Ads">
                    <option value="Video & Image Ads - Paket 1 Video + 2 Image">Video & Image Ads - 1 Video + 2 Image (Rp 100.000)</option>
                    <option value="Video & Image Ads - Paket 4 Video + 2 Image">Video & Image Ads - 4 Video + 2 Image (Rp 200.000)</option>
                    <option value="Video & Image Ads - Paket Video Custom">Video & Image Ads - Paket Video Custom</option>
                  </optgroup>
                  <optgroup label="Jasa Meta Ads (Facebook & Instagram)">
                    <option value="Jasa Meta Ads - Paket Starter">Jasa Meta Ads - Paket Starter (Rp 30.000)</option>
                    <option value="Jasa Meta Ads - Paket Scale Up Pro">Jasa Meta Ads - Paket Scale Up Pro (Rp 150.000)</option>
                    <option value="Jasa Meta Ads - Paket Dominasi Bisnis">Jasa Meta Ads - Paket Dominasi Bisnis (Rp 350.000)</option>
                  </optgroup>
                  <optgroup label="Optimasi SEO">
                    <option value="Optimasi SEO - SEO Starter Google">Optimasi SEO - Paket Starter Google (Rp 100.000)</option>
                    <option value="Optimasi SEO - SEO Bisnis & Maps">Optimasi SEO - Paket Bisnis & Maps (Rp 250.000)</option>
                    <option value="Optimasi SEO - SEO Dominasi Pasar">Optimasi SEO - Paket Dominasi Pasar (Rp 500.000)</option>
                  </optgroup>
                  <optgroup label="Layanan Tambahan">
                    <option value="Workshop & Pelatihan AI">Workshop & Pelatihan AI Praktis</option>
                    <option value="Desain Packaging & Kemasan">Desain Packaging & Kemasan Produk</option>
                    <option value="Web App Custom">Web App Custom (Sekolah / POS / Guru)</option>
                    <option value="Konsultasi Kebutuhan Lainnya">Konsultasi Kebutuhan Lainnya</option>
                  </optgroup>
                </select>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Usaha / Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sasak Coffee Roastery"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-indigo-500 text-slate-800"
                />
              </div>

              {/* Consultation Format */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Pilihan Format Konsultasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeetingType("studio")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      meetingType === "studio"
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-xs">📍 Tatap Muka</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">Studio Selong, Lotim</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingType("online")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      meetingType === "online"
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-xs">💻 Online Meeting</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">Google Meet / WA Call</div>
                  </button>
                </div>
              </div>

              {/* UMKM Checkbox */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="umkm-check"
                  checked={isUmkm}
                  onChange={(e) => setIsUmkm(e.target.checked)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="umkm-check" className="text-xs text-amber-950 cursor-pointer">
                  <strong className="font-bold">Klaim Diskon Khusus UMKM 15% - 20%</strong>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Saya pelaku usaha mikro/kecil lokal dan ingin mendapatkan harga subsidi UMKM.
                  </div>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Catatan Kebutuhan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan fitur khusus yang Anda inginkan atau target launching..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-indigo-500 text-slate-800 text-xs sm:text-sm"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gradient-cta w-full py-4 rounded-xl text-white font-extrabold text-sm shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Merekam ke Database & Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Booking & Lanjut ke WhatsApp</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto shadow-md">
              ✓
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">
              Booking Berhasil Dibuat!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Jendela WhatsApp sedang dibuka untuk menghubungkan Anda langsung dengan tim konsultan lomboXtudio Studio Selong.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
              <div><strong>Klien:</strong> {name} ({businessName})</div>
              <div><strong>Layanan:</strong> {service}</div>
              <div><strong>Format:</strong> {meetingType === "studio" ? "Studio Selong" : "Online Meet"}</div>
              <div><strong>Status UMKM:</strong> {isUmkm ? "Diskon 15-20% Aktif" : "Standar"}</div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm cursor-pointer hover:bg-slate-800"
            >
              Tutup & Kembali
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

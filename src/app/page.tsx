"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesBar from "@/components/ServicesBar";
import WhyUsSection from "@/components/WhyUsSection";
import PricingSection from "@/components/PricingSection";
import ExtensionsSection from "@/components/ExtensionsSection";
import PortfolioSection from "@/components/PortfolioSection";
import UmkmPromoBanner from "@/components/UmkmPromoBanner";
import WorkflowSection from "@/components/WorkflowSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SocialProofPopup from "@/components/SocialProofPopup";
import { useContent } from "@/context/ContentContext";
import { openWhatsApp } from "@/lib/whatsapp";

export default function Home() {
  const { content } = useContent();
  const brandName = content?.brand?.name || "lomboXtudio";
  const waNumber = content?.brand?.whatsappNumber;

  return (
    <div className="relative min-h-screen bg-[#F8FAFF] text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenBooking={() =>
          openWhatsApp(
            `Halo ${brandName}, saya ingin konsultasi gratis mengenai kebutuhan digital & solusi bisnis saya.`,
            waNumber
          )
        }
      />

      <main>
        {/* 2. Hero Section */}
        <HeroSection
          onOpenBooking={() =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin mulai konsultasi pembuatan website & strategi pemasaran digital untuk bisnis saya.`,
              waNumber
            )
          }
        />

        {/* 3. Services Bar */}
        <ServicesBar
          onSelectService={(service) =>
            openWhatsApp(
              `Halo ${brandName}, saya tertarik dengan layanan *${service}*. Mohon informasi detail paket, estimasi biaya, dan alur pengerjaannya.`,
              waNumber
            )
          }
        />

        {/* 4. Why Us / Search & Category Finder */}
        <WhyUsSection
          onOpenBooking={() =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin jadwalkan sesi konsultasi langsung dengan tim studio Selong mengenai strategi digital bisnis saya.`,
              waNumber
            )
          }
          onFilterService={(category) =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin tanya solusi digital kategori *${category}* untuk bisnis saya.`,
              waNumber
            )
          }
        />

        {/* 5. Packages & Pricing */}
        <PricingSection
          onSelectPlan={(plan, svc) => {
            let msg = `Halo ${brandName}, saya ingin memesan / konsultasi Paket *${svc} - ${plan}*. Mohon informasi detail dan proses pemesanannya.`;
            if (svc.toLowerCase().includes("web")) {
              msg = `Halo ${brandName}, saya ingin memesan / konsultasi Paket *Website - ${plan}*. Mohon informasi ketersediaan slot dan proses pemesanannya.`;
            } else if (svc.toLowerCase().includes("sosmed") || svc.toLowerCase().includes("sosial media")) {
              msg = `Halo ${brandName}, saya tertarik memesan Paket *Kelola Sosial Media - ${plan}*. Mohon informasi detail jadwal konten dan langkah awalnya.`;
            } else if (svc.toLowerCase().includes("video")) {
              msg = `Halo ${brandName}, saya ingin memesan Paket *Video & Image Ads - ${plan}*. Mohon info konsep materi dan alur produksinya.`;
            } else if (svc.toLowerCase().includes("meta")) {
              msg = `Halo ${brandName}, saya ingin menjalankan kampanye iklan melalui Paket *Meta Ads - ${plan}*. Mohon arahan target audiens dan persiapannya.`;
            } else if (svc.toLowerCase().includes("seo")) {
              msg = `Halo ${brandName}, saya ingin memesan Paket *Optimasi SEO - ${plan}*. Mohon analisis kata kunci dan alur optimasinya.`;
            }
            openWhatsApp(msg, waNumber);
          }}
        />

        {/* 6. Extension Services */}
        <ExtensionsSection
          onSelectExtension={(ext) =>
            openWhatsApp(
              `Halo ${brandName}, saya tertarik dan ingin konsultasi mengenai program *${ext}*. Mohon info penawaran dan jadwal pelaksanaannya.`,
              waNumber
            )
          }
        />

        {/* 7. Featured Portfolio */}
        <PortfolioSection />

        {/* 8. UMKM Special Discount Banner */}
        <UmkmPromoBanner
          onOpenBooking={(serviceName) =>
            openWhatsApp(
              `Halo ${brandName}, saya pelaku UMKM dan ingin klaim *Promo Diskon UMKM 15-20%* untuk layanan *${
                serviceName || "Website UMKM"
              }*. Mohon dibantu proses dan info slotnya!`,
              waNumber
            )
          }
        />

        {/* 9. Workflow 7-Step Timeline */}
        <WorkflowSection />

        {/* 10. Client Testimonials */}
        <TestimonialsSection />

        {/* 11. Final High Impact CTA Banner */}
        <CtaBanner
          onOpenBooking={() =>
            openWhatsApp(
              `Halo ${brandName}, saya siap mengembangkan bisnis bersama tim ${brandName}! Saya ingin booking sesi konsultasi sekarang.`,
              waNumber
            )
          }
        />
      </main>

      {/* 12. Comprehensive Footer */}
      <Footer />

      {/* 13. Floating Instant WhatsApp Action */}
      <FloatingWhatsApp />

      {/* 14. Live Activity Social Proof Notifications */}
      <SocialProofPopup
        onOpenBooking={(service) =>
          openWhatsApp(
            `Halo ${brandName}, saya melihat baru saja ada pemesanan untuk layanan *${
              service || "Solusi Digital"
            }*. Saya tertarik juga untuk bisnis saya, mohon info paketnya!`,
            waNumber
          )
        }
      />
    </div>
  );
}

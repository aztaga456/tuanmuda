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
  const brandName = content?.brand?.name || "TUANMUDA";
  const waNumber = content?.brand?.whatsappNumber;

  return (
    <div className="relative min-h-screen bg-[#F8FAFF] text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenBooking={() =>
          openWhatsApp(
            `Halo ${brandName}, saya ingin konsultasi gratis mengenai layanan digital & solusi bisnis Anda.`,
            waNumber
          )
        }
      />

      <main>
        {/* 2. Hero Section */}
        <HeroSection
          onOpenBooking={() =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin mulai konsultasi pembuatan website / branding untuk bisnis saya.`,
              waNumber
            )
          }
        />

        {/* 3. Services Bar */}
        <ServicesBar
          onSelectService={(service) =>
            openWhatsApp(
              `Halo ${brandName}, saya tertarik dengan layanan ${service}. Mohon informasi detail paket dan alur pengerjaannya.`,
              waNumber
            )
          }
        />

        {/* 4. Why Us / Search & Category Finder */}
        <WhyUsSection
          onOpenBooking={() =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin jadwalkan konsultasi langsung dengan tim profesional Anda mengenai kebutuhan digital bisnis saya.`,
              waNumber
            )
          }
          onFilterService={(category) =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin tanya solusi digital kategori ${category} untuk bisnis saya.`,
              waNumber
            )
          }
        />

        {/* 5. Packages & Pricing */}
        <PricingSection
          onSelectPlan={(plan, svc) =>
            openWhatsApp(
              `Halo ${brandName}, saya ingin pesan / konsultasi Paket ${svc} - ${plan}. Mohon informasi detail dan proses pemesanannya.`,
              waNumber
            )
          }
        />

        {/* 6. Extension Services */}
        <ExtensionsSection
          onSelectExtension={(ext) =>
            openWhatsApp(
              `Halo ${brandName}, saya tertarik dan ingin konsultasi mengenai program: ${ext}. Mohon info penawaran dan jadwalnya.`,
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
              `Halo ${brandName}, saya ingin klaim Promo Diskon Khusus UMKM untuk layanan ${
                serviceName || "Website UMKM"
              }. Mohon dibantu proses dan info slotnya!`,
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
              `Halo ${brandName}, saya siap berkolaborasi untuk mengembangkan proyek digital bisnis saya! Saya ingin booking sesi konsultasi.`,
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
            `Halo ${brandName}, saya melihat baru saja ada pemesanan untuk layanan ${
              service || "Digital Solution"
            }. Saya tertarik juga, mohon info paketnya!`,
            waNumber
          )
        }
      />
    </div>
  );
}

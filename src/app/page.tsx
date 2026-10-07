"use client";

import { useState } from "react";
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
import BookingModal from "@/components/BookingModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SocialProofPopup from "@/components/SocialProofPopup";

export default function Home() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState("Website Development");

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForBooking(serviceName);
    }
    setBookingModalOpen(true);
  };

  const handleFilterService = (category: string) => {
    handleOpenBooking(category);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFF] text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main>
        {/* 2. Hero Section (Gradient Navy-Purple, 3D Laptop/Phone/Cylinder stage, Starburst, metrics strip) */}
        <HeroSection onOpenBooking={() => handleOpenBooking()} />

        {/* 3. Services Bar (Iconic 3D icon row resting under the wave from HERO SECTION.jpg) */}
        <ServicesBar onSelectService={(s) => handleOpenBooking(s)} />

        {/* 4. Why Us / Search & Category Finder (Matching UI.jpg with 3D floating phone & 4-card feature row) */}
        <WhyUsSection
          onOpenBooking={() => handleOpenBooking()}
          onFilterService={handleFilterService}
        />

        {/* 5. Packages & Pricing (PRD Section 5.5: Beli Lepas vs Langganan, Section 5.6: Sosmed 3 Tiers, Ads) */}
        <PricingSection onSelectPlan={(plan, svc) => handleOpenBooking(`${svc} - ${plan}`)} />

        {/* 6. Extension Services (PRD Section 5.8: Workshop AI, Pelatihan Foto AI, Packaging, Web App) */}
        <ExtensionsSection onSelectExtension={(ext) => handleOpenBooking(ext)} />

        {/* 7. Featured Portfolio (Matching UI.jpg "Featured Ads" 4-column grid + detailed case study modal) */}
        <PortfolioSection />

        {/* 8. UMKM Special Discount Banner (Matching UI.jpg blue banner + interactive savings simulator) */}
        <UmkmPromoBanner onOpenBooking={(s) => handleOpenBooking(s || "Website UMKM")} />

        {/* 9. Workflow 7-Step Timeline (PRD Section 5.11: Alur Kerja Transparan) */}
        <WorkflowSection />

        {/* 10. Client Testimonials (PRD Section 5.12) */}
        <TestimonialsSection />

        {/* 11. Final High Impact CTA Banner */}
        <CtaBanner onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* 13. Comprehensive Footer with Selong Studio Address & Map (PRD Section 5.13) */}
      <Footer />

      {/* 14. Interactive Booking Modal System (PRD Section 8) */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={selectedServiceForBooking}
      />

      {/* 15. Floating Instant WhatsApp Action */}
      <FloatingWhatsApp />

      {/* 16. Live Activity Social Proof Notifications */}
      <SocialProofPopup onOpenBooking={(s) => handleOpenBooking(s)} />
    </div>
  );
}

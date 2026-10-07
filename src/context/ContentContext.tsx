"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent, defaultSiteContent } from "@/data/defaultSiteContent";

interface ContentContextType {
  content: SiteContent;
  isLoaded: boolean;
  updateContent: (newContent: Partial<SiteContent> | ((prev: SiteContent) => SiteContent)) => void;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (jsonStr: string) => boolean;
  syncWithDatabase: (replacedUrls?: string[]) => Promise<{ success: boolean; message: string; deletedFiles?: string[] }>;
}

const STORAGE_KEY = "tuanmuda_cms_content";

const ContentContext = createContext<ContentContextType>({
  content: defaultSiteContent,
  isLoaded: false,
  updateContent: () => {},
  resetContent: () => {},
  exportContent: () => "",
  importContent: () => false,
  syncWithDatabase: async () => ({ success: false, message: "" }),
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with defaultSiteContent to ensure newly added keys are preserved
        setContent((prev) => ({
          ...defaultSiteContent,
          ...parsed,
          brand: { ...defaultSiteContent.brand, ...(parsed.brand || {}) },
          hero: {
            ...defaultSiteContent.hero,
            ...(parsed.hero || {}),
            rotatingServices: parsed.hero?.rotatingServices?.length
              ? parsed.hero.rotatingServices
              : defaultSiteContent.hero.rotatingServices,
          },
          servicesBar: {
            ...defaultSiteContent.servicesBar,
            ...(parsed.servicesBar || {}),
            items: parsed.servicesBar?.items?.length
              ? parsed.servicesBar.items
              : defaultSiteContent.servicesBar.items,
          },
          whyUs: {
            ...defaultSiteContent.whyUs,
            ...(parsed.whyUs || {}),
            differentiators: parsed.whyUs?.differentiators?.length
              ? parsed.whyUs.differentiators
              : defaultSiteContent.whyUs.differentiators,
          },
          pricing: {
            ...defaultSiteContent.pricing,
            ...(parsed.pricing || {}),
            websitePlans: parsed.pricing?.websitePlans?.length
              ? parsed.pricing.websitePlans
              : defaultSiteContent.pricing.websitePlans,
            sosmedPlans: parsed.pricing?.sosmedPlans?.length
              ? parsed.pricing.sosmedPlans
              : defaultSiteContent.pricing.sosmedPlans,
            videoAdsPlans: parsed.pricing?.videoAdsPlans?.length
              ? parsed.pricing.videoAdsPlans
              : defaultSiteContent.pricing.videoAdsPlans,
            metaAdsPlans: parsed.pricing?.metaAdsPlans?.length
              ? parsed.pricing.metaAdsPlans
              : defaultSiteContent.pricing.metaAdsPlans,
            seoPlans: parsed.pricing?.seoPlans?.length
              ? parsed.pricing.seoPlans
              : defaultSiteContent.pricing.seoPlans,
          },
          extensions: {
            ...defaultSiteContent.extensions,
            ...(parsed.extensions || {}),
            items: parsed.extensions?.items?.length
              ? parsed.extensions.items
              : defaultSiteContent.extensions.items,
          },
          portfolio: {
            ...defaultSiteContent.portfolio,
            ...(parsed.portfolio || {}),
            items: parsed.portfolio?.items?.length
              ? parsed.portfolio.items
              : defaultSiteContent.portfolio.items,
          },
          workflow: {
            ...defaultSiteContent.workflow,
            ...(parsed.workflow || {}),
            steps: parsed.workflow?.steps?.length
              ? parsed.workflow.steps
              : defaultSiteContent.workflow.steps,
          },
          testimonials: {
            ...defaultSiteContent.testimonials,
            ...(parsed.testimonials || {}),
            items: parsed.testimonials?.items?.length
              ? parsed.testimonials.items
              : defaultSiteContent.testimonials.items,
          },
          socialProof: {
            ...defaultSiteContent.socialProof,
            ...(parsed.socialProof || {}),
            items: parsed.socialProof?.items?.length
              ? parsed.socialProof.items
              : defaultSiteContent.socialProof.items,
          },
        }));
      }
    } catch (e) {
      console.error("Failed to load CMS content from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Storage sync parse error:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveToStorage = (updated: SiteContent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save CMS content to localStorage:", e);
    }
  };

  const updateContent = (
    newContent: Partial<SiteContent> | ((prev: SiteContent) => SiteContent)
  ) => {
    setContent((prev) => {
      const updated =
        typeof newContent === "function"
          ? newContent(prev)
          : { ...prev, ...newContent };
      saveToStorage(updated);
      return updated;
    });
  };

  const resetContent = () => {
    setContent(defaultSiteContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const exportContent = () => {
    return JSON.stringify(content, null, 2);
  };

  const importContent = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === "object" && parsed.brand) {
        const fullContent: SiteContent = {
          ...defaultSiteContent,
          ...parsed,
        };
        setContent(fullContent);
        saveToStorage(fullContent);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Invalid JSON import:", e);
      return false;
    }
  };

  const syncWithDatabase = async (
    replacedUrls?: string[]
  ): Promise<{ success: boolean; message: string; deletedFiles?: string[] }> => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, replacedUrls }),
      });
      const data = await res.json();
      if (data.success) {
        saveToStorage(content);
        return {
          success: true,
          message: data.message || "Konten berhasil disinkronkan ke database!",
          deletedFiles: data.deletedFiles,
        };
      }
      return { success: false, message: data.error || "Gagal sinkronisasi data." };
    } catch (err: any) {
      return { success: false, message: err.message || "Koneksi jaringan gagal." };
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoaded,
        updateContent,
        resetContent,
        exportContent,
        importContent,
        syncWithDatabase,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

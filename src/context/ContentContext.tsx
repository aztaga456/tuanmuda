"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteContent, defaultSiteContent } from "@/data/defaultSiteContent";
import { isFirebaseConfigured, subscribeToFirebaseContent } from "@/lib/firebase";

export function mergeWithDefault(parsed: Partial<SiteContent> | null | undefined): SiteContent {
  if (!parsed || typeof parsed !== "object") return defaultSiteContent;

  return {
    ...defaultSiteContent,
    ...parsed,
    brand: { ...defaultSiteContent.brand, ...(parsed.brand || {}) },
    hero: {
      ...defaultSiteContent.hero,
      ...(parsed.hero || {}),
      rotatingServices: parsed.hero?.rotatingServices?.length
        ? parsed.hero.rotatingServices
        : defaultSiteContent.hero.rotatingServices,
      metrics: parsed.hero?.metrics?.length
        ? parsed.hero.metrics
        : defaultSiteContent.hero.metrics,
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
  };
}

interface ContentContextType {
  content: SiteContent;
  isLoaded: boolean;
  updateContent: (newContent: Partial<SiteContent> | ((prev: SiteContent) => SiteContent)) => void;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (jsonStr: string) => boolean;
  syncWithDatabase: (
    replacedUrls?: string[],
    overrideContent?: SiteContent
  ) => Promise<{ success: boolean; message: string; deletedFiles?: string[] }>;
  reloadFromDatabase: () => Promise<boolean>;
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
  reloadFromDatabase: async () => false,
});

export function ContentProvider({
  children,
  initialContent,
}: {
  children: React.ReactNode;
  initialContent?: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent || defaultSiteContent);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveToStorage = (updated: SiteContent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save CMS content to localStorage:", e);
    }
  };

  // Fungsi reload data terbaru langsung dari Neon Database
  const reloadFromDatabase = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/content", {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const merged = mergeWithDefault(json.data);
          setContent(merged);
          saveToStorage(merged);
          return true;
        }
      }
    } catch (err) {
      console.warn("Could not reload content from database:", err);
    }
    return false;
  }, []);

  // Inisialisasi saat client mount
  useEffect(() => {
    let isMounted = true;

    // 1. Prioritaskan initialContent dari server (langsung dari DB). Jangan timpa dengan cache lokal basi!
    if (initialContent) {
      setContent(mergeWithDefault(initialContent));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContent));
      } catch {}
      setIsLoaded(true);
    } else {
      // Hanya jika initialContent kosong (misal SSR offline), baca dari localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setContent(mergeWithDefault(parsed));
        }
      } catch (e) {
        console.error("Failed to load CMS content from localStorage:", e);
      } finally {
        setIsLoaded(true);
      }
    }

    // 2. Real-time Listener ke Firebase Firestore
    // Bila admin mengubah data di PC / HP, semua layar lain langsung update secara realtime!
    let unsubscribeFirebase: (() => void) | null = null;
    if (isFirebaseConfigured()) {
      try {
        unsubscribeFirebase = subscribeToFirebaseContent((newContent) => {
          if (isMounted && newContent) {
            setContent(newContent);
            saveToStorage(newContent);
          }
        });
      } catch (fbErr) {
        console.warn("Firebase realtime subscription notice:", fbErr);
      }
    }

    // 3. Ambil data terbaru dari server (Neon DB / API) jika Firebase belum aktif
    const initFetch = async () => {
      try {
        const res = await fetch("/api/content", {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            const merged = mergeWithDefault(json.data);
            setContent(merged);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Server content fetch notice (using cache/default):", err);
      }
    };

    initFetch();

    // 4. Sinkronisasi antar tab dalam browser yang sama
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setContent(mergeWithDefault(JSON.parse(e.newValue)));
        } catch (err) {
          console.error("Storage sync parse error:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      isMounted = false;
      if (unsubscribeFirebase) {
        unsubscribeFirebase();
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [initialContent]);

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
        const fullContent = mergeWithDefault(parsed);
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
    replacedUrls?: string[],
    overrideContent?: SiteContent
  ): Promise<{ success: boolean; message: string; deletedFiles?: string[] }> => {
    const targetContent = overrideContent || content;
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: targetContent, replacedUrls }),
      });
      const data = await res.json();
      if (data.success) {
        saveToStorage(targetContent);
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
        reloadFromDatabase,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

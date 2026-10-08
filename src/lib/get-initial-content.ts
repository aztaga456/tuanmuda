import { prisma } from "@/lib/db";
import { defaultSiteContent, SiteContent } from "@/data/defaultSiteContent";
import { mergeWithDefault } from "@/context/ContentContext";
import { isFirebaseConfigured, getFirebaseContent } from "@/lib/firebase";

/**
 * Mengambil data konten website langsung di server sebelum HTML dikirim ke browser.
 * Ini mencegah "flash" tampilan default (nama/logo lama) saat refresh atau pertama kali dibuka.
 */
export async function getInitialSiteContent(): Promise<SiteContent> {
  // 1. Cek Firebase Firestore jika sudah terkonfigurasi
  if (isFirebaseConfigured()) {
    try {
      const fbContent = await getFirebaseContent();
      if (fbContent) {
        return fbContent;
      }
    } catch (fbErr) {
      console.warn("[Server] getInitialSiteContent Firebase notice:", fbErr);
    }
  }

  // 2. Fallback ke Neon PostgreSQL (Prisma)
  try {
    if (process.env.DATABASE_URL && prisma) {
      const record = await prisma.siteContent.findUnique({
        where: { key: "main" },
      });

      if (record && record.data) {
        return mergeWithDefault(record.data as Partial<SiteContent>);
      }
    }
  } catch (error) {
    console.warn("[Server] getInitialSiteContent fallback to default:", error);
  }

  return defaultSiteContent;
}

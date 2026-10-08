import { prisma } from "@/lib/db";
import { defaultSiteContent, SiteContent } from "@/data/defaultSiteContent";
import { mergeWithDefault } from "@/context/ContentContext";

/**
 * Mengambil data konten website langsung di server sebelum HTML dikirim ke browser (SSR).
 * Ini mencegah "flash" tampilan default (nama/logo lama) saat refresh atau pertama kali dibuka.
 */
export async function getInitialSiteContent(): Promise<SiteContent> {
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

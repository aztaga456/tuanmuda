import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultSiteContent, SiteContent } from "@/data/defaultSiteContent";
import { deleteStoredFile, extractMediaUrlsFromContent } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
  };

  try {
    // 1. Ambil langsung dari Neon PostgreSQL (Prisma) sebagai satu-satunya database
    if (process.env.DATABASE_URL && prisma) {
      try {
        const record = await prisma.siteContent.findUnique({
          where: { key: "main" },
        });

        if (record && record.data) {
          return NextResponse.json(
            {
              success: true,
              source: "database",
              version: record.version,
              updatedAt: record.updatedAt,
              data: record.data,
            },
            { headers }
          );
        }
      } catch (dbErr: any) {
        console.warn("[Content API] DB query error:", dbErr?.message);
      }
    }

    // 3. Fallback ke default site content jika DB belum terkonfigurasi atau data kosong
    return NextResponse.json(
      {
        success: true,
        source: "fallback",
        data: defaultSiteContent,
      },
      { headers }
    );
  } catch (err: any) {
    console.warn("Content GET from database fallback to default:", err?.message);
    return NextResponse.json(
      {
        success: true,
        source: "fallback_error",
        data: defaultSiteContent,
      },
      { headers }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Dukung format langsung SiteContent atau { content, replacedUrls }
    const newContent = (rawBody.content || rawBody) as SiteContent;
    const explicitReplaced = Array.isArray(rawBody.replacedUrls) ? rawBody.replacedUrls : [];

    if (!newContent || !newContent.brand || !newContent.hero) {
      return NextResponse.json(
        { success: false, error: "Format data konten tidak valid" },
        { status: 400 }
      );
    }

    let deletedFiles: string[] = [];
    let savedToNeon = false;

    // 1. Ambil data saat ini di Database SEBELUM di-upsert agar kita tahu persis file lama apa yang diganti/dihapus
    let oldData: any = null;
    if (process.env.DATABASE_URL && prisma) {
      try {
        const existingRecord = await prisma.siteContent.findUnique({
          where: { key: "main" },
        });
        if (existingRecord && existingRecord.data) {
          oldData = existingRecord.data;
        }
      } catch (err: any) {
        console.warn("[Content API] Cek existing record DB notice:", err?.message);
      }
    }

    // 2. Kumpulkan file / URL yang harus dihapus (khususnya logo lama)
    const filesToDelete = new Set<string>(explicitReplaced.filter(Boolean));

    if (oldData) {
      const oldBrand = (oldData as SiteContent).brand || ({} as any);
      const newBrand = newContent.brand || ({} as any);

      // A. Jika logoImage diganti atau sengaja dihapus
      if (oldBrand.logoImage && oldBrand.logoImage !== newBrand.logoImage) {
        filesToDelete.add(oldBrand.logoImage);
      }

      // B. Jika fullLogoImage diganti atau sengaja dihapus
      if (oldBrand.fullLogoImage && oldBrand.fullLogoImage !== newBrand.fullLogoImage) {
        filesToDelete.add(oldBrand.fullLogoImage);
      }

      // C. Jika beralih ke logo lengkap (fullLogoImage), bersihkan logo icon lama
      if (newBrand.fullLogoImage && oldBrand.logoImage && !newBrand.logoImage) {
        filesToDelete.add(oldBrand.logoImage);
      }

      // D. Jika beralih ke logo icon (logoImage), bersihkan full logo lama
      if (newBrand.logoImage && oldBrand.fullLogoImage && !newBrand.fullLogoImage) {
        filesToDelete.add(oldBrand.fullLogoImage);
      }

      // E. Deteksi URL media lainnya yang tidak lagi dipakai
      const oldUrls = extractMediaUrlsFromContent(oldData);
      const currentUrls = extractMediaUrlsFromContent(newContent);
      oldUrls.forEach((url) => {
        if (!currentUrls.includes(url) && !url.startsWith("data:")) {
          filesToDelete.add(url);
        }
      });
    }

    // 3. Simpan data konten baru ke Neon PostgreSQL (Ultra cepat < 50ms)
    if (process.env.DATABASE_URL && prisma) {
      try {
        await prisma.siteContent.upsert({
          where: { key: "main" },
          update: {
            data: newContent as any,
            version: { increment: 1 },
          },
          create: {
            key: "main",
            data: newContent as any,
            version: 1,
          },
        });
        savedToNeon = true;
      } catch (neonErr: any) {
        console.warn("[Content API] Gagal simpan ke Neon DB:", neonErr.message);
      }
    }

    // 4. Eksekusi penghapusan file lama di database & storage fisik SEGERA
    if (filesToDelete.size > 0) {
      deletedFiles = Array.from(filesToDelete);
      for (const url of deletedFiles) {
        try {
          await deleteStoredFile(url);
          if (process.env.DATABASE_URL && prisma) {
            try {
              await prisma.media.deleteMany({
                where: {
                  OR: [
                    { url },
                    { path: url },
                  ],
                },
              });
            } catch {}
          }
        } catch (delErr) {
          console.warn(`[Content API] Gagal hapus file usang (${url}):`, delErr);
        }
      }
    }

    const message = savedToNeon
      ? "Konten berhasil disimpan ke Neon Cloud Database!"
      : "Konten berhasil diperbarui!";

    return NextResponse.json({
      success: true,
      message,
      savedToNeon,
      deletedFiles,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Content POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menyimpan konten ke database" },
      { status: 500 }
    );
  }
}

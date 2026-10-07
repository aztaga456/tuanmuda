import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultSiteContent, SiteContent } from "@/data/defaultSiteContent";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const record = await prisma.siteContent.findUnique({
        where: { key: "main" },
      });

      if (record && record.data) {
        return NextResponse.json({
          success: true,
          source: "database",
          data: record.data,
        });
      }
    }

    // Fallback ke default site content jika DB belum terkonfigurasi
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: defaultSiteContent,
    });
  } catch (err: any) {
    console.warn("Content GET from database fallback to default:", err.message);
    return NextResponse.json({
      success: true,
      source: "fallback_error",
      data: defaultSiteContent,
    });
  }
}

import { deleteStoredFile, extractMediaUrlsFromContent } from "@/lib/storage";

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

    if (process.env.DATABASE_URL && prisma) {
      // 1. Deteksi gambar usang yang diganti (Garbage Collection)
      try {
        const existingRecord = await prisma.siteContent.findUnique({
          where: { key: "main" },
        });

        if (existingRecord && existingRecord.data) {
          const oldUrls = extractMediaUrlsFromContent(existingRecord.data);
          const currentUrls = extractMediaUrlsFromContent(newContent);
          
          // Gambar yang ada di database lama tetapi tidak ada lagi di konten baru
          const orphanedUrls = oldUrls.filter((url) => !currentUrls.includes(url));
          const allToDelete = Array.from(new Set([...orphanedUrls, ...explicitReplaced]));

          for (const url of allToDelete) {
            try {
              const ok = await deleteStoredFile(url);
              if (ok) {
                deletedFiles.push(url);
                // Bersihkan juga dari tabel Media
                try {
                  await prisma.media.deleteMany({ where: { url } });
                } catch {}
              }
            } catch (delErr) {
              console.warn(`Gagal menghapus file lama (${url}):`, delErr);
            }
          }
        }
      } catch (gcErr) {
        console.warn("Storage garbage collection notice:", gcErr);
      }

      // 2. Simpan konten terbaru ke Neon PostgreSQL
      const saved = await prisma.siteContent.upsert({
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

      return NextResponse.json({
        success: true,
        message:
          deletedFiles.length > 0
            ? `Konten berhasil disinkronkan ke Neon DB & ${deletedFiles.length} file gambar lama dibersihkan dari storage!`
            : "Konten website berhasil disimpan & disinkronkan ke Neon Database!",
        version: saved.version,
        deletedFiles,
        syncedAt: saved.updatedAt,
      });
    }

    // Jika DATABASE_URL belum diset (mode offline)
    return NextResponse.json({
      success: true,
      message: "Konten tersimpan di mode local cache (DATABASE_URL offline).",
      deletedFiles: [],
    });
  } catch (err: any) {
    console.error("Content POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menyimpan konten ke database" },
      { status: 500 }
    );
  }
}

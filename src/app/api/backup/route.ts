import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultSiteContent } from "@/data/defaultSiteContent";
import { saveUploadedFile, extractMediaUrlsFromContent } from "@/lib/storage";
import fs from "fs";
import path from "path";

/**
 * POST /api/backup
 * Melakukan backup snapshot database ke Neon & mengunggah/sinkron gambar lokal ke Google Drive Storage
 */
export async function POST(req: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    const backupKey = `backup_${Date.now()}`;

    // 1. Ambil data saat ini dari Neon Database
    let currentContent: any = defaultSiteContent;
    let bookingsCount = 0;
    let mediaCount = 0;

    if (process.env.DATABASE_URL && prisma) {
      const activeRecord = await prisma.siteContent.findUnique({
        where: { key: "main" },
      });
      if (activeRecord && activeRecord.data) {
        currentContent = activeRecord.data;
      }

      bookingsCount = await prisma.booking.count();
      mediaCount = await prisma.media.count();

      // 2. Simpan Snapshot Database ke Neon
      try {
        await prisma.siteContent.upsert({
          where: { key: backupKey },
          update: {
            data: currentContent,
            version: (activeRecord?.version || 1) + 1000,
          },
          create: {
            id: backupKey,
            key: backupKey,
            data: currentContent,
            version: 1,
          },
        });
      } catch (snapErr) {
        console.warn("DB snapshot creation warning:", snapErr);
      }
    }

    // 3. Scan & Backup Gambar Lokal / Aktif ke Google Drive Storage
    const mediaUrls = extractMediaUrlsFromContent(currentContent);
    let imagesBackedUpCount = 0;
    const backedUpImages: string[] = [];

    // Jika ada file lokal di public/uploads yang belum di-backup ke Cloud
    for (const imgUrl of mediaUrls) {
      if (imgUrl.startsWith("/uploads/")) {
        const localFilename = path.basename(imgUrl);
        const localFilePath = path.join(process.cwd(), "public", "uploads", localFilename);

        if (fs.existsSync(localFilePath)) {
          try {
            const fileBuffer = await fs.promises.readFile(localFilePath);
            const ext = path.extname(localFilename).toLowerCase();
            const mimeType =
              ext === ".png"
                ? "image/png"
                : ext === ".jpg" || ext === ".jpeg"
                ? "image/jpeg"
                : ext === ".webp"
                ? "image/webp"
                : "image/png";

            // Unggah buffer ke storage cloud (Google Drive / S3)
            const uploaded = await saveUploadedFile(fileBuffer, `backup-${localFilename}`, mimeType);
            imagesBackedUpCount++;
            backedUpImages.push(uploaded.url);
          } catch (uploadErr) {
            console.warn(`Gagal backup gambar lokal ${localFilename}:`, uploadErr);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Backup berhasil! Snapshot database tersimpan di Neon & ${imagesBackedUpCount} aset gambar lokal disinkronkan ke storage.`,
      backupKey,
      timestamp,
      stats: {
        totalMediaReferenced: mediaUrls.length,
        imagesBackedUpCount,
        bookingsCount,
        mediaCount,
        databaseProvider: "Neon PostgreSQL",
        storageDriver: process.env.STORAGE_DRIVER || "gdrive",
      },
    });
  } catch (err: any) {
    console.error("Backup error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal melakukan proses backup" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/backup
 * Mengunduh full archive JSON (SiteContent, Bookings, Media) langsung ke perangkat admin
 */
export async function GET() {
  try {
    let siteContentData = defaultSiteContent;
    let bookingsList: any[] = [];
    let mediaList: any[] = [];

    if (process.env.DATABASE_URL && prisma) {
      const active = await prisma.siteContent.findUnique({ where: { key: "main" } });
      if (active?.data) siteContentData = active.data as any;

      bookingsList = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 500,
      });

      mediaList = await prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        take: 500,
      });
    }

    const payload = {
      agency: "NUSADIGITAL / TUANMUDA Creative Agency",
      exportedAt: new Date().toISOString(),
      database: "Neon PostgreSQL",
      storage: process.env.STORAGE_DRIVER || "gdrive",
      siteContent: siteContentData,
      bookings: bookingsList,
      media: mediaList,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);

    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="nusadigital-backup-${dateStr}.json"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengunduh file backup" },
      { status: 500 }
    );
  }
}

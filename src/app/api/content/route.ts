import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultSiteContent, SiteContent } from "@/data/defaultSiteContent";
import {
  isFirebaseConfigured,
  getFirebaseContent,
  saveFirebaseContent,
} from "@/lib/firebase";
import { deleteStoredFile, extractMediaUrlsFromContent } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
  };

  try {
    // 1. Coba ambil dari Firebase Firestore jika terkonfigurasi
    if (isFirebaseConfigured()) {
      try {
        const fbContent = await getFirebaseContent();
        if (fbContent) {
          return NextResponse.json(
            {
              success: true,
              source: "firebase",
              data: fbContent,
            },
            { headers }
          );
        }
      } catch (fbErr: any) {
        console.warn("[Content API] Firebase fetch fallback to Neon:", fbErr.message);
      }
    }

    // 2. Fallback ke Neon PostgreSQL (Prisma)
    if (process.env.DATABASE_URL && prisma) {
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
    console.warn("Content GET from database fallback to default:", err.message);
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
    let savedToFirebase = false;
    let savedToNeon = false;

    // 1. Simpan ke Firebase Firestore (Realtime Database Utama)
    if (isFirebaseConfigured()) {
      try {
        await saveFirebaseContent(newContent);
        savedToFirebase = true;
      } catch (fbErr: any) {
        console.error("[Content API] Gagal simpan ke Firebase:", fbErr.message);
      }
    }

    // 2. Deteksi & pembersihan gambar usang (Garbage Collection)
    try {
      let oldData: any = null;
      if (process.env.DATABASE_URL && prisma) {
        const existingRecord = await prisma.siteContent.findUnique({
          where: { key: "main" },
        });
        if (existingRecord) oldData = existingRecord.data;
      }

      if (oldData) {
        const oldUrls = extractMediaUrlsFromContent(oldData);
        const currentUrls = extractMediaUrlsFromContent(newContent);

        // Gambar yang ada di database lama tetapi tidak ada lagi di konten baru
        const orphanedUrls = oldUrls.filter((url) => !currentUrls.includes(url));
        const allToDelete = Array.from(new Set([...orphanedUrls, ...explicitReplaced]));

        for (const url of allToDelete) {
          try {
            const ok = await deleteStoredFile(url);
            if (ok) {
              deletedFiles.push(url);
              if (process.env.DATABASE_URL && prisma) {
                try {
                  await prisma.media.deleteMany({ where: { url } });
                } catch {}
              }
            }
          } catch (delErr) {
            console.warn(`Gagal membersihkan file lama (${url}):`, delErr);
          }
        }
      }
    } catch (gcErr) {
      console.warn("Storage garbage collection notice:", gcErr);
    }

    // 3. Simpan juga ke Neon PostgreSQL jika aktif (Dual Backup)
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

    let message = "Konten berhasil disimpan";
    if (savedToFirebase && savedToNeon) {
      message = "Konten berhasil disimpan ke Firebase Realtime & Neon Database!";
    } else if (savedToFirebase) {
      message = "Konten berhasil disimpan secara realtime ke Firebase!";
    } else if (savedToNeon) {
      message = "Konten berhasil disimpan ke Neon Database!";
    }

    if (deletedFiles.length > 0) {
      message += ` (${deletedFiles.length} file gambar lama dibersihkan)`;
    }

    return NextResponse.json({
      success: true,
      message,
      savedToFirebase,
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

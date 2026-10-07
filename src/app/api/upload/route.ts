import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/storage";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Batas ukuran 5MB untuk gambar
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simpan ke storage (lokal atau cloud)
    const stored = await saveUploadedFile(buffer, file.name, file.type);

    // Catat metadata ke database jika koneksi DB tersedia
    try {
      if (process.env.DATABASE_URL && prisma) {
        await prisma.media.create({
          data: {
            filename: stored.filename,
            originalName: stored.originalName,
            mimeType: stored.mimeType,
            size: stored.size,
            url: stored.url,
            path: stored.path,
          },
        });
      }
    } catch (dbErr) {
      console.warn("Media DB record skipped (DB offline):", dbErr);
    }

    return NextResponse.json({
      success: true,
      url: stored.url,
      filename: stored.filename,
      size: stored.size,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

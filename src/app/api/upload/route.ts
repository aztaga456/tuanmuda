import { NextRequest, NextResponse } from "next/server";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { deleteStoredFile, saveUploadedFile } from "@/lib/storage";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldUrl = formData.get("oldUrl") as string | null;
    const folder = (formData.get("folder") as string) || "tuanmuda_agency";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file maksimal 20MB" },
        { status: 400 }
      );
    }

    // 1. Jika ada oldUrl yang digantikan, langsung hapus file lama dari Cloudinary & DB
    if (oldUrl && oldUrl.trim() !== "") {
      try {
        await deleteStoredFile(oldUrl.trim());
      } catch (delErr) {
        console.warn("[Upload API] Gagal hapus file lama sebelum upload:", delErr);
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/png";

    // 2. Prioritas Utama: Simpan ke Cloudinary CDN
    if (isCloudinaryConfigured()) {
      try {
        const cld = await uploadToCloudinary(buffer, {
          folder,
          filename: file.name,
        });

        // Simpan metadata ke tabel Media di PostgreSQL Neon
        if (process.env.DATABASE_URL && prisma) {
          try {
            await prisma.media.create({
              data: {
                filename: file.name,
                originalName: file.name,
                mimeType,
                size: cld.size || file.size,
                url: cld.url,
                path: cld.publicId,
              },
            });
          } catch (dbErr) {
            console.warn("[Upload API] Gagal simpan metadata media DB:", dbErr);
          }
        }

        return NextResponse.json({
          success: true,
          url: cld.url,
          publicId: cld.publicId,
          filename: file.name,
          size: cld.size,
          storage: "cloudinary",
          message: "Gambar berhasil diunggah permanen ke Cloudinary CDN!",
        });
      } catch (cldUploadErr: any) {
        console.error("[Upload API] Gagal upload Cloudinary:", cldUploadErr);
        const errMsg = cldUploadErr?.message || "Gagal mengunggah ke Cloudinary.";
        return NextResponse.json(
          {
            success: false,
            error: errMsg.includes("missing permissions")
              ? "Cloudinary menolak upload: API Key Anda tidak memiliki izin 'create' (Upload Assets). Silakan buka Cloudinary Console > Settings > Access Keys dan centang izin Upload/Manage Assets."
              : `Gagal upload Cloudinary: ${errMsg}`,
          },
          { status: 500 }
        );
      }
    }

    // 3. Fallback jika Cloudinary belum diisi di .env: Simpan melalui storage helper
    const fallbackSaved = await saveUploadedFile(buffer, file.name, mimeType);

    if (process.env.DATABASE_URL && prisma) {
      try {
        await prisma.media.create({
          data: {
            filename: fallbackSaved.filename,
            originalName: fallbackSaved.originalName,
            mimeType,
            size: fallbackSaved.size,
            url: fallbackSaved.url,
            path: fallbackSaved.path,
          },
        });
      } catch (dbErr) {
        console.warn("[Upload API] Gagal simpan fallback metadata DB:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: fallbackSaved.url,
      filename: fallbackSaved.filename,
      size: fallbackSaved.size,
      storage: "fallback",
      message: "Gambar diproses. Silakan isi kredensial Cloudinary di .env untuk CDN permanen.",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

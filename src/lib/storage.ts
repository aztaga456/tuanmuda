import path from "path";
import fs from "fs";
import { prisma } from "@/lib/db";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary";

export interface StoredFile {
  filename: string;
  originalName: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
}

/**
 * Menyimpan file: Prioritaskan Cloudinary jika terkonfigurasi,
 * fallback ke Buffer Data URL lokal jika belum diisi kredensialnya.
 */
export async function saveUploadedFile(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<StoredFile> {
  const cleanExt = path.extname(originalFilename).toLowerCase() || ".png";
  const baseName = path
    .basename(originalFilename, cleanExt)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 40);
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const filename = `${uniquePrefix}-${baseName}${cleanExt}`;

  // 1. Coba upload langsung ke Cloudinary
  if (isCloudinaryConfigured()) {
    try {
      const cld = await uploadToCloudinary(fileBuffer, {
        filename,
        folder: "tuanmuda_agency",
      });
      return {
        filename,
        originalName: originalFilename,
        url: cld.url,
        path: cld.publicId,
        size: cld.size || fileBuffer.length,
        mimeType,
      };
    } catch (cldErr: any) {
      console.warn("[Storage] Gagal upload ke Cloudinary, fallback ke Data URL:", cldErr?.message);
    }
  }

  // 2. Fallback: Data URL
  const dataUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

  return {
    filename,
    originalName: originalFilename,
    url: dataUrl,
    path: dataUrl,
    size: fileBuffer.length,
    mimeType,
  };
}

export async function deleteStoredFile(fileUrlOrPath: string): Promise<boolean> {
  if (!fileUrlOrPath) return false;

  let deletedAny = false;

  try {
    // 1. Jika URL Cloudinary (res.cloudinary.com)
    if (fileUrlOrPath.includes("cloudinary.com")) {
      try {
        const cldRes = await deleteFromCloudinary(fileUrlOrPath);
        if (cldRes.success) {
          deletedAny = true;
        }
      } catch (cldErr) {
        console.warn(`[Storage] Gagal menghapus Cloudinary file ${fileUrlOrPath}:`, cldErr);
      }
    }

    // 2. Jika file lokal di public/uploads/ atau public/
    if (fileUrlOrPath.startsWith("/uploads/") || fileUrlOrPath.startsWith("uploads/")) {
      const filename = path.basename(fileUrlOrPath);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          deletedAny = true;
        } catch (err) {
          console.warn(`[Storage] Gagal menghapus file lokal ${filePath}:`, err);
        }
      }
    } else if (fileUrlOrPath.startsWith("/") && !fileUrlOrPath.startsWith("/api") && !fileUrlOrPath.startsWith("/_next")) {
      // Cek apakah file berada langsung di public/
      const filename = path.basename(fileUrlOrPath);
      const protectedFiles = ["next.svg", "vercel.svg", "file.svg", "globe.svg", "window.svg"];
      if (!protectedFiles.includes(filename)) {
        const filePath = path.join(process.cwd(), "public", filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            deletedAny = true;
          } catch (err) {
            console.warn(`[Storage] Gagal menghapus file public ${filePath}:`, err);
          }
        }
      }
    }

    // 3. Hapus catatan media dari database Neon PostgreSQL jika ada
    if (process.env.DATABASE_URL && prisma) {
      try {
        const filename = path.basename(fileUrlOrPath);
        const whereClause: any[] = [
          { url: fileUrlOrPath },
          { path: fileUrlOrPath },
        ];
        if (filename && filename.length > 3 && !fileUrlOrPath.startsWith("data:")) {
          whereClause.push({ filename });
        }

        const deleteResult = await prisma.media.deleteMany({
          where: {
            OR: whereClause,
          },
        });
        if (deleteResult.count > 0) {
          deletedAny = true;
        }
      } catch (err) {
        console.warn(`[Storage] Gagal menghapus media record untuk ${fileUrlOrPath}:`, err);
      }
    }
  } catch (outerErr) {
    console.warn(`[Storage] Error saat memproses penghapusan ${fileUrlOrPath}:`, outerErr);
  }

  return deletedAny;
}

export function extractMediaUrlsFromContent(obj: any): string[] {
  const urls: Set<string> = new Set();

  function traverse(item: any) {
    if (!item) return;
    if (typeof item === "string") {
      if (
        item.includes("cloudinary.com") ||
        item.startsWith("data:") ||
        item.includes("googleusercontent.com/d/") ||
        item.includes("drive.google.com") ||
        item.startsWith("/uploads/") ||
        /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(item)
      ) {
        urls.add(item);
      }
    } else if (Array.isArray(item)) {
      item.forEach(traverse);
    } else if (typeof item === "object") {
      Object.values(item).forEach(traverse);
    }
  }

  traverse(obj);
  return Array.from(urls);
}

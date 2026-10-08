import fs from "fs";
import path from "path";

export interface StoredFile {
  filename: string;
  originalName: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
}

/**
 * Mengunggah file gambar ke ImgBB API
 * Upload sangat cepat (< 500ms), direct Cloudflare CDN URL (i.ibb.co),
 * tanpa masalah CORS, Referer, atau kuota seperti Google Drive.
 */
export async function uploadToImgBB(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<StoredFile> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY belum dikonfigurasi di environment variables (.env)");
  }

  const base64Image = fileBuffer.toString("base64");
  const cleanExt = path.extname(originalFilename).toLowerCase() || ".png";
  const baseName = path
    .basename(originalFilename, cleanExt)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 40);

  const formData = new FormData();
  formData.append("image", base64Image);
  formData.append("name", baseName);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!json.success || !json.data?.url) {
    const errorMsg = json.error?.message || "Gagal mengunggah gambar ke ImgBB";
    throw new Error(errorMsg);
  }

  const directUrl = json.data.url;
  const fileId = json.data.id || baseName;

  return {
    filename: json.data.image?.filename || `${baseName}${cleanExt}`,
    originalName: originalFilename,
    url: directUrl,
    path: `imgbb://${fileId}`,
    size: json.data.size || fileBuffer.length,
    mimeType: json.data.image?.mime || mimeType,
  };
}

/**
 * Menyimpan buffer file ke storage ImgBB (prioritas),
 * Cloudflare R2 / S3, Google Drive, atau storage lokal.
 */
export async function saveUploadedFile(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<StoredFile> {
  // 1. Mode ImgBB (Prioritas Utama untuk realtime & performa instan)
  const isImgBB =
    Boolean(process.env.IMGBB_API_KEY) ||
    process.env.STORAGE_DRIVER === "imgbb";

  if (isImgBB && process.env.IMGBB_API_KEY) {
    try {
      return await uploadToImgBB(fileBuffer, originalFilename, mimeType);
    } catch (imgbbError: any) {
      console.warn("[Storage] ImgBB upload notice, mencoba fallback ke GDrive / Local:", imgbbError.message);
    }
  }

  const isCloudStorage = process.env.STORAGE_DRIVER === "s3" && process.env.STORAGE_S3_BUCKET;

  // Bersihkan nama file agar aman untuk URL & OS
  const cleanExt = path.extname(originalFilename).toLowerCase() || ".png";
  const baseName = path
    .basename(originalFilename, cleanExt)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 40);
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const filename = `${uniquePrefix}-${baseName}${cleanExt}`;

  if (isCloudStorage) {
    // Mode Cloud Storage (Cloudflare R2 / AWS S3)
    const publicUrlBase = process.env.STORAGE_S3_PUBLIC_URL || "";
    const bucket = process.env.STORAGE_S3_BUCKET || "";
    const fileUrl = `${publicUrlBase.replace(/\/$/, "")}/${filename}`;

    try {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const endpoint = process.env.STORAGE_S3_ENDPOINT;
      const accessKeyId = process.env.STORAGE_S3_ACCESS_KEY;
      const secretAccessKey = process.env.STORAGE_S3_SECRET_KEY;

      if (endpoint && accessKeyId && secretAccessKey && bucket) {
        const s3Client = new S3Client({
          region: "auto",
          endpoint,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: filename,
            Body: fileBuffer,
            ContentType: mimeType,
          })
        );

        return {
          filename,
          originalName: originalFilename,
          url: fileUrl,
          path: `s3://${bucket}/${filename}`,
          size: fileBuffer.length,
          mimeType,
        };
      }
    } catch (s3Error: any) {
      console.error("Cloudflare R2 / S3 upload failed, falling back to local:", s3Error);
    }
  }

  // Mode Local Storage (public/uploads/)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const destinationPath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(destinationPath, fileBuffer);

  const fileUrl = `/uploads/${filename}`;

  return {
    filename,
    originalName: originalFilename,
    url: fileUrl,
    path: destinationPath,
    size: fileBuffer.length,
    mimeType,
  };
}

/**
 * Mengambil daftar file yang ada di direktori public/uploads
 */
export async function listLocalUploads(): Promise<string[]> {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) return [];
    const files = await fs.promises.readdir(uploadsDir);
    return files.map((f) => `/uploads/${f}`);
  } catch {
    return [];
  }
}

/**
 * Menghapus file dari media storage (Local / S3)
 */
export async function deleteStoredFile(fileUrlOrPath: string): Promise<boolean> {
  if (!fileUrlOrPath) return false;

  // Abaikan aset statis publik bawaan
  if (
    fileUrlOrPath.startsWith("/svg/") ||
    fileUrlOrPath.startsWith("/images/") ||
    fileUrlOrPath.includes("logo") && !fileUrlOrPath.includes("/uploads/")
  ) {
    return false;
  }

  // 2. Cloudflare R2 / AWS S3 Deletion
  const isS3 =
    process.env.STORAGE_DRIVER === "s3" ||
    fileUrlOrPath.startsWith("s3://") ||
    (process.env.STORAGE_S3_PUBLIC_URL && fileUrlOrPath.includes(process.env.STORAGE_S3_PUBLIC_URL));
  if (isS3 && process.env.STORAGE_S3_BUCKET) {
    try {
      const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      const filename = path.basename(fileUrlOrPath);
      const s3Client = new S3Client({
        region: "auto",
        endpoint: process.env.STORAGE_S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.STORAGE_S3_ACCESS_KEY || "",
          secretAccessKey: process.env.STORAGE_S3_SECRET_KEY || "",
        },
      });
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.STORAGE_S3_BUCKET,
          Key: filename,
        })
      );
      console.log(`[Storage] S3/R2 file deleted: ${filename}`);
      return true;
    } catch (err) {
      console.warn(`[Storage] S3 delete error:`, err);
    }
  }

  // 3. Local Uploads Deletion
  if (fileUrlOrPath.startsWith("/uploads/") || fileUrlOrPath.includes("public/uploads")) {
    try {
      const filename = path.basename(fileUrlOrPath);
      const localFilePath = path.join(process.cwd(), "public", "uploads", filename);
      if (fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath);
        console.log(`[Storage] Local file deleted: ${filename}`);
        return true;
      }
    } catch (err) {
      console.warn(`[Storage] Local file delete error:`, err);
    }
  }

  return false;
}

/**
 * Mengumpulkan semua URL gambar/media yang ada di dalam objek SiteContent
 */
export function extractMediaUrlsFromContent(obj: any): string[] {
  const urls: Set<string> = new Set();

  function traverse(item: any) {
    if (!item) return;
    if (typeof item === "string") {
      if (
        item.includes("googleusercontent.com/d/") ||
        item.includes("drive.google.com") ||
        item.includes("i.ibb.co") ||
        item.includes("ibb.co") ||
        item.startsWith("/uploads/") ||
        item.startsWith("s3://") ||
        item.includes(".r2.dev/") ||
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

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
 * Menyimpan buffer file ke storage lokal (public/uploads)
 * atau ke Cloudflare R2 / S3 jika environment S3 diaktifkan.
 */
export async function saveUploadedFile(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<StoredFile> {
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

  // Mode Google Drive Storage (default jika bukan S3)
  const isGDriveStorage =
    process.env.STORAGE_DRIVER === "gdrive" ||
    !process.env.STORAGE_DRIVER ||
    process.env.STORAGE_DRIVER !== "s3";
  if (isGDriveStorage) {
    // 1. Opsi A: Google Apps Script Webhook (Zero GCP Setup, langsung simpan ke folder)
    const webhookUrl =
      process.env.GDRIVE_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbwOJ_mMEzcbziNorIm7ujvRrcdiyApBQ2gKWkvVUvl257tYqYeoadRhGbUuUvIDlrtv/exec";
    if (webhookUrl) {
      try {
        const base64Data = fileBuffer.toString("base64");
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            filename,
            mimeType,
            base64: base64Data,
            folderId: process.env.GDRIVE_FOLDER_ID || "1upsJGoReWcDMNRrppckI2_5-fsJzfIGZ",
          }),
          redirect: "follow",
        });

        if (res.ok) {
          const text = await res.text();
          try {
            const result = JSON.parse(text);
            if (result.success && result.url) {
              return {
                filename,
                originalName: originalFilename,
                url: result.url,
                path: `gdrive://${result.fileId || filename}`,
                size: fileBuffer.length,
                mimeType,
              };
            }
          } catch {
            console.warn("GDrive Webhook non-JSON response:", text);
          }
        }
        console.warn("GDrive Webhook response failed, attempting Service Account or fallback.");
      } catch (webhookErr) {
        console.error("GDrive Webhook error:", webhookErr);
      }
    }

    // 2. Opsi B: Google Cloud Service Account (JWT)
    try {
      const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.GDRIVE_PRIVATE_KEY;
      const folderId = process.env.GDRIVE_FOLDER_ID || "1upsJGoReWcDMNRrppckI2_5-fsJzfIGZ";

      if (clientEmail && rawPrivateKey && folderId) {
        const { google } = await import("googleapis");
        const { Readable } = await import("stream");

        const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
        const auth = new google.auth.JWT({
          email: clientEmail,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/drive"],
        });

        const drive = google.drive({ version: "v3", auth });

        const stream = new Readable();
        stream.push(fileBuffer);
        stream.push(null);

        const response = await drive.files.create({
          requestBody: {
            name: filename,
            parents: [folderId],
          },
          media: {
            mimeType,
            body: stream,
          },
          fields: "id, name, webViewLink",
        });

        const fileId = response.data.id;

        if (fileId) {
          // Buat file publik agar bisa diakses langsung sebagai URL gambar
          try {
            await drive.permissions.create({
              fileId,
              requestBody: {
                role: "reader",
                type: "anyone",
              },
            });
          } catch (permErr) {
            console.warn("GDrive public permission notice:", permErr);
          }

          // Direct public Google image URL
          const publicUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

          return {
            filename,
            originalName: originalFilename,
            url: publicUrl,
            path: `gdrive://${folderId}/${fileId}`,
            size: fileBuffer.length,
            mimeType,
          };
        }
      } else {
        console.warn("Kredensial Google Drive belum lengkap di .env, fallback ke local storage.");
      }
    } catch (gdriveErr: any) {
      console.error("Google Drive upload error, fallback ke local:", gdriveErr);
    }
  }

  // Jika berjalan di Vercel / serverless AWS Lambda, filesystem /var/task bersifat read-only
  if (process.env.VERCEL) {
    throw new Error(
      "Gagal mengunggah file ke Google Drive storage. Pastikan webhook Google Drive aktif dan dapat diakses."
    );
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
 * Mengekstrak ID file Google Drive dari berbagai format URL
 */
export function extractGdriveFileId(urlOrPath: string): string | null {
  if (!urlOrPath) return null;

  // Format: https://lh3.googleusercontent.com/d/FILE_ID
  const lh3Match = urlOrPath.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match) return lh3Match[1];

  // Format: https://drive.google.com/uc?id=FILE_ID atau thumbnail?id=FILE_ID
  const idParamMatch = urlOrPath.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  // Format: https://drive.google.com/file/d/FILE_ID
  const fileDMatch = urlOrPath.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch) return fileDMatch[1];

  // Format: gdrive://folderId/FILE_ID
  const gdriveSchemeMatch = urlOrPath.match(/gdrive:\/\/[^/]+\/([a-zA-Z0-9_-]+)/);
  if (gdriveSchemeMatch) return gdriveSchemeMatch[1];

  return null;
}

/**
 * Menghapus file dari media storage (Google Drive / S3 / Local)
 */
export async function deleteStoredFile(fileUrlOrPath: string): Promise<boolean> {
  if (!fileUrlOrPath) return false;

  // Abaikan aset statis publik bawaan
  if (
    fileUrlOrPath.startsWith("/svg/") ||
    fileUrlOrPath.startsWith("/images/") ||
    fileUrlOrPath.includes("logo") && !fileUrlOrPath.includes("/uploads/") && !fileUrlOrPath.includes("googleusercontent")
  ) {
    return false;
  }

  // 1. Google Drive Deletion
  const gdriveFileId = extractGdriveFileId(fileUrlOrPath);
  if (gdriveFileId) {
    const webhookUrl =
      process.env.GDRIVE_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbwOJ_mMEzcbziNorIm7ujvRrcdiyApBQ2gKWkvVUvl257tYqYeoadRhGbUuUvIDlrtv/exec";
    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "delete",
            fileId: gdriveFileId,
          }),
          redirect: "follow",
        });
        if (res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.success) {
              console.log(`[Storage] GDrive file deleted: ${gdriveFileId}`);
              return true;
            }
          } catch {}
        }
      } catch (err) {
        console.warn(`[Storage] GDrive webhook delete error:`, err);
      }
    }

    // Fallback GCP Service Account
    const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GDRIVE_PRIVATE_KEY;
    if (clientEmail && rawPrivateKey) {
      try {
        const { google } = await import("googleapis");
        const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
        const auth = new google.auth.JWT({
          email: clientEmail,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/drive"],
        });
        const drive = google.drive({ version: "v3", auth });
        await drive.files.delete({ fileId: gdriveFileId });
        console.log(`[Storage] GDrive service account file deleted: ${gdriveFileId}`);
        return true;
      } catch (err) {
        console.warn(`[Storage] GDrive service account delete error:`, err);
      }
    }
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

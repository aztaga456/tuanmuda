import { v2 as cloudinary } from "cloudinary";

// Inisialisasi konfigurasi Cloudinary
cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Cek apakah kredensial Cloudinary sudah lengkap di environment variables
 */
export function isCloudinaryConfigured(): boolean {
  if (process.env.CLOUDINARY_URL) {
    return true;
  }
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
      cloudName.trim() !== "" &&
      apiKey &&
      apiKey.trim() !== "" &&
      apiSecret &&
      apiSecret.trim() !== ""
  );
}

/**
 * Ekstrak Public ID dari URL Cloudinary untuk proses penghapusan permanen
 * Mendukung URL dengan folder, transformasi, dan versi (v123456)
 */
export function extractCloudinaryPublicId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const afterUpload = parts[1].split("?")[0].split("#")[0];
    const segments = afterUpload.split("/");
    // Abaikan segment versi (v123...) dan transformasi (w_200, f_auto, dsb)
    const pathSegments = segments.filter(
      (seg) =>
        !/^v\d+$/.test(seg) &&
        !/^(?:[a-z]{1,4}_|f_|q_|c_|w_|h_|dpr_|fl_|b_|ar_|co_|e_|l_|o_|r_|u_|z_)/.test(
          seg
        )
    );

    const fullPath = pathSegments.join("/");
    const lastDot = fullPath.lastIndexOf(".");
    return lastDot !== -1 ? fullPath.slice(0, lastDot) : fullPath;
  } catch {
    return null;
  }
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Upload file gambar (Buffer atau Base64 Data URL) ke Cloudinary
 */
export async function uploadToCloudinary(
  fileBufferOrDataUrl: Buffer | string,
  options?: {
    folder?: string;
    filename?: string;
    publicId?: string;
  }
): Promise<CloudinaryUploadResult> {
  const folder = options?.folder || "tuanmuda_agency";

  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: "image",
      overwrite: true,
      invalidate: true, // Bersihkan cache CDN seketika
    };

    if (options?.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    if (typeof fileBufferOrDataUrl === "string") {
      // Input berupa Data URL (base64) atau HTTP URL
      cloudinary.uploader.upload(
        fileBufferOrDataUrl,
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Gagal mengunggah ke Cloudinary"));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes,
          });
        }
      );
    } else {
      // Input berupa Buffer biner
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Gagal mengunggah ke Cloudinary"));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes,
          });
        }
      );
      uploadStream.end(fileBufferOrDataUrl);
    }
  });
}

/**
 * Hapus file gambar dari Cloudinary secara permanen dan invalidate CDN cache
 */
export async function deleteFromCloudinary(
  urlOrPublicId: string
): Promise<{ success: boolean; result?: string }> {
  if (!urlOrPublicId) return { success: false };

  const publicId = urlOrPublicId.includes("cloudinary.com")
    ? extractCloudinaryPublicId(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) {
    return { success: false };
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      invalidate: true, // Invalidate CDN cache agar gambar langsung hilang
      resource_type: "image",
    });

    return {
      success: res.result === "ok" || res.result === "not found",
      result: res.result,
    };
  } catch (err: any) {
    console.warn(`[Cloudinary] Gagal menghapus file ${publicId}:`, err?.message);
    return { success: false, result: err?.message };
  }
}

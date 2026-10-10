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
 * Menyimpan file secara langsung sebagai Data URL / Buffer lokal
 * Tanpa ketergantungan storage eksternal (ImgBB / Cloud disk)
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
  // Data URLs tidak memerlukan penghapusan disk fisik
  return true;
}

export function extractMediaUrlsFromContent(obj: any): string[] {
  const urls: Set<string> = new Set();

  function traverse(item: any) {
    if (!item) return;
    if (typeof item === "string") {
      if (
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

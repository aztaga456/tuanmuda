/**
 * Mengekstrak ID file Google Drive dari berbagai format URL (Client-safe, zero Node deps)
 */
export function extractGdriveFileId(urlOrPath?: string | null): string | null {
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

  // Jika input adalah raw fileId (biasanya 25+ karakter alfanumerik)
  const trimmed = urlOrPath.trim();
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed) && !trimmed.includes("/")) {
    return trimmed;
  }

  return null;
}

/**
 * Mengonversi URL gambar Google Drive menjadi URL yang aman dimuat browser
 * tanpa terkena blokir Referer / CORS / Rate-Limit (429) dari Google CDN.
 */
export function getSafeImageUrl(url?: string | null): string {
  if (!url) return "";

  // Data URI atau URL internal /api/media sudah aman
  if (url.startsWith("data:") || url.startsWith("/api/media")) {
    return url;
  }

  // File statis bawaan public
  if (
    url.startsWith("/svg/") ||
    url.startsWith("/images/") ||
    url.startsWith("/port-") ||
    url.startsWith("/ext-") ||
    url.startsWith("/favicon")
  ) {
    return url;
  }

  // Jika URL Google Drive, gunakan endpoint proxy internal /api/media
  const gdriveId = extractGdriveFileId(url);
  if (gdriveId) {
    return `/api/media?id=${gdriveId}`;
  }

  // Jika file lokal uploads
  if (url.startsWith("/uploads/")) {
    return url;
  }

  return url;
}

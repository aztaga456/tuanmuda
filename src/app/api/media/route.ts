import { NextRequest, NextResponse } from "next/server";
import { extractGdriveFileId } from "@/lib/image-helper";
import fs from "fs";
import path from "path";

// In-memory cache untuk performa tinggi & hemat bandwidth
const memoryCache = new Map<string, { buffer: Buffer; contentType: string; cachedAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("id");
    const rawUrl = searchParams.get("url");

    const target = rawId || rawUrl;
    if (!target) {
      return NextResponse.json({ error: "Parameter 'id' atau 'url' wajib disertakan" }, { status: 400 });
    }

    // 1. Dukungan file lokal di /uploads/...
    if (target.startsWith("/uploads/") || (!rawId && !target.includes("http") && !target.includes("drive"))) {
      const filename = path.basename(target);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (fs.existsSync(filePath)) {
        const buffer = await fs.promises.readFile(filePath);
        const ext = path.extname(filename).toLowerCase();
        const contentType =
          ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".webp"
            ? "image/webp"
            : ext === ".svg"
            ? "image/svg+xml"
            : "application/octet-stream";

        return new Response(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      }
    }

    // 2. Google Drive Storage
    const fileId = extractGdriveFileId(target) || rawId;
    if (!fileId) {
      return NextResponse.json({ error: "ID file Google Drive tidak valid" }, { status: 400 });
    }

    // Cek cache in-memory
    const cached = memoryCache.get(fileId);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return new Response(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Media-Cache": "HIT",
        },
      });
    }

    // Coba endpoint Google CDN (tanpa Referer header agar tidak kena rate limit 429)
    const candidateUrls = [
      `https://lh3.googleusercontent.com/d/${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
    ];

    let imageBuffer: Buffer | null = null;
    let contentType = "image/png";

    for (const fetchUrl of candidateUrls) {
      try {
        const res = await fetch(fetchUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          redirect: "follow",
        });

        if (res.ok) {
          const resContentType = res.headers.get("content-type") || "";
          if (resContentType.startsWith("image/")) {
            const arrayBuffer = await res.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
            contentType = resContentType;
            break;
          }
        }
      } catch (candidateErr) {
        // Coba kandidat berikutnya
      }
    }

    if (!imageBuffer) {
      return NextResponse.json(
        { error: "Gambar tidak dapat dimuat dari Google Drive atau belum disetel publik" },
        { status: 404 }
      );
    }

    // Simpan ke cache memory (batasi maksimal 150 item agar hemat RAM)
    if (memoryCache.size > 150) {
      const firstKey = memoryCache.keys().next().value;
      if (firstKey) memoryCache.delete(firstKey);
    }
    memoryCache.set(fileId, {
      buffer: imageBuffer,
      contentType,
      cachedAt: Date.now(),
    });

    return new Response(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Media-Cache": "MISS",
      },
    });
  } catch (err: any) {
    console.error("Media route error:", err);
    return NextResponse.json({ error: "Gagal memproses gambar: " + err.message }, { status: 500 });
  }
}

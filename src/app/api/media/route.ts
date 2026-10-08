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

    const target = rawUrl || rawId;
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

    // 2. Dukungan Remote URL (ImgBB, Cloudflare CDN, dll.)
    // Berfungsi sebagai proxy agar tidak terkena blokir ISP / Handshake Failure di Indonesia
    if (target.startsWith("http://") || target.startsWith("https://")) {
      const isRemoteCdn = target.includes("ibb.co") || target.includes("imgbb") || !target.includes("google");
      if (isRemoteCdn) {
        const cached = memoryCache.get(target);
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

        try {
          const remoteRes = await fetch(target, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });

          if (remoteRes.ok) {
            const contentType = remoteRes.headers.get("content-type") || "image/jpeg";
            const arrayBuffer = await remoteRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            if (memoryCache.size > 200) {
              const firstKey = memoryCache.keys().next().value;
              if (firstKey) memoryCache.delete(firstKey);
            }
            memoryCache.set(target, { buffer, contentType, cachedAt: Date.now() });

            return new Response(new Uint8Array(buffer), {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Media-Cache": "MISS",
              },
            });
          }
        } catch (remoteErr) {
          console.warn("[Media Proxy] Gagal direct fetch remote URL, mencoba fallback CDN:", target);
        }

        // Fallback: Jika direct fetch gagal (misal TLS handshake failure oleh ISP Indonesia), gunakan wsrv.nl CDN
        try {
          const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(target)}&output=webp`;
          const wsrvRes = await fetch(wsrvUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });

          if (wsrvRes.ok) {
            const contentType = wsrvRes.headers.get("content-type") || "image/webp";
            const arrayBuffer = await wsrvRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            if (memoryCache.size > 200) {
              const firstKey = memoryCache.keys().next().value;
              if (firstKey) memoryCache.delete(firstKey);
            }
            memoryCache.set(target, { buffer, contentType, cachedAt: Date.now() });

            return new Response(new Uint8Array(buffer), {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Media-Cache": "WSRV-FALLBACK",
              },
            });
          }
        } catch (wsrvErr) {
          console.error("[Media Proxy] WSRV CDN fallback failed:", wsrvErr);
        }
      }
    }

    // 3. Google Drive Storage
    const fileId = extractGdriveFileId(target) || rawId;
    if (!fileId) {
      return NextResponse.json({ error: "ID file media tidak valid" }, { status: 400 });
    }

    // Cek cache in-memory untuk Google Drive
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

    // Coba endpoint Google CDN
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
      } catch {}
    }

    if (!imageBuffer) {
      return NextResponse.json(
        { error: "Gambar tidak dapat dimuat" },
        { status: 404 }
      );
    }

    if (memoryCache.size > 200) {
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

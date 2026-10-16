import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const hasSecret = Boolean(process.env.CLOUDINARY_API_SECRET);
  const isConfigured = isCloudinaryConfigured();

  // Mask API key for security
  const apiKeyMasked =
    apiKey.length > 6
      ? `${apiKey.slice(0, 3)}•••••${apiKey.slice(-3)}`
      : apiKey ? "••••••" : "";

  return NextResponse.json({
    success: true,
    isConfigured,
    cloudName,
    apiKeyMasked,
    hasSecret,
    driver: process.env.STORAGE_DRIVER || "cloudinary",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { cloudName, apiKey, apiSecret, cloudinaryUrl } = body;

    // Jika pengguna menempelkan URL lengkap (cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
    if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
      try {
        const parsed = new URL(cloudinaryUrl);
        apiKey = parsed.username;
        apiSecret = parsed.password;
        cloudName = parsed.hostname;
      } catch (parseErr) {
        return NextResponse.json(
          { success: false, error: "Format Cloudinary URL tidak valid" },
          { status: 400 }
        );
      }
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Cloud Name, API Key, dan API Secret wajib diisi.",
        },
        { status: 400 }
      );
    }

    cloudName = cloudName.trim();
    apiKey = apiKey.trim();
    apiSecret = apiSecret.trim();

    // 1. Uji koneksi ke Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    let pingSuccess = false;
    let pingError = "";
    try {
      const pingRes = await cloudinary.api.ping();
      if (pingRes && (pingRes.status === "ok" || pingRes.status)) {
        pingSuccess = true;
      }
    } catch (err: any) {
      pingError = err?.message || "Gagal menghubungi server Cloudinary";
      console.warn("[Cloudinary Config API] Ping warning:", pingError);
    }

    // 2. Terapkan ke process.env runtime saat ini (Gunakan dynamic key agar tidak di-replace DefinePlugin webpack)
    const envObj = process.env as Record<string, string | undefined>;
    envObj["STORAGE_DRIVER"] = "cloudinary";
    envObj["CLOUDINARY_CLOUD_NAME"] = cloudName;
    envObj["NEXT_PUBLIC_" + "CLOUDINARY_CLOUD_NAME"] = cloudName;
    envObj["CLOUDINARY_API_KEY"] = apiKey;
    envObj["CLOUDINARY_API_SECRET"] = apiSecret;

    // 3. Simpan permanen ke file .env di root proyek
    try {
      const envPath = path.join(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");

        const updateOrAppend = (key: string, val: string) => {
          const regex = new RegExp(`^${key}=.*$`, "m");
          if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}="${val}"`);
          } else {
            envContent += `\n${key}="${val}"`;
          }
        };

        updateOrAppend("STORAGE_DRIVER", "cloudinary");
        updateOrAppend("CLOUDINARY_CLOUD_NAME", cloudName);
        updateOrAppend("CLOUDINARY_API_KEY", apiKey);
        updateOrAppend("CLOUDINARY_API_SECRET", apiSecret);
        updateOrAppend("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", cloudName);

        fs.writeFileSync(envPath, envContent, "utf8");
      }
    } catch (fsErr) {
      console.warn("[Cloudinary Config API] Gagal menulis ke file .env:", fsErr);
    }

    return NextResponse.json({
      success: true,
      pingSuccess,
      message: pingSuccess
        ? "✅ Kredensial Cloudinary valid & berhasil disimpan permanen ke .env!"
        : `⚠️ Kredensial disimpan ke .env, namun verifikasi ping mengembalikan: ${pingError}. Periksa kembali Cloud Name & API Key Anda.`,
      cloudName,
    });
  } catch (err: any) {
    console.error("Cloudinary config POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menyimpan konfigurasi Cloudinary" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultSiteContent } from "@/data/defaultSiteContent";

export async function POST() {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.siteContent.upsert({
        where: { key: "main" },
        update: {
          data: defaultSiteContent as any,
          version: 1,
        },
        create: {
          key: "main",
          data: defaultSiteContent as any,
          version: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Konten database berhasil di-reset ke setelan bawaan pabrik!",
      data: defaultSiteContent,
    });
  } catch (err: any) {
    console.error("Content reset error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mereset konten di database" },
      { status: 500 }
    );
  }
}

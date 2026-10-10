/**
 * Script Seeder Database — lomboXtudio Creative Agency
 * Mengisi data awal ke Neon PostgreSQL:
 * 1. SiteContent (Semua section website default)
 * 2. Akun Admin awal
 * 3. Sample booking jika diperlukan
 *
 * Jalankan dengan: node scripts/seed-neon.mjs
 */

import { defaultSiteContent } from "../src/data/defaultSiteContent.js";

async function main() {
  console.log("🚀 Memulai proses seeding database...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL belum diatur di environment.");
    console.log("Silakan atur DATABASE_URL di file .env terlebih dahulu.");
    process.exit(1);
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    // 1. Seed SiteContent
    console.log("📦 Menyimpan default SiteContent ke database...");
    const content = await prisma.siteContent.upsert({
      where: { key: "main" },
      update: {
        data: defaultSiteContent,
        version: { increment: 1 },
      },
      create: {
        id: "active_content",
        key: "main",
        data: defaultSiteContent,
        version: 1,
      },
    });
    console.log("✅ SiteContent berhasil disimpan (Versi:", content.version, ")");

    // 2. Seed Default Admin User
    console.log("👤 Membuat akun admin default...");
    const adminPassword = process.env.ADMIN_PASSWORD || "suksesbareng";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nusadigital.id";

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash: adminPassword,
        name: "Super Admin NusaDigital",
      },
      create: {
        email: adminEmail,
        passwordHash: adminPassword,
        name: "Super Admin NusaDigital",
        role: "ADMIN",
      },
    });
    console.log("✅ Akun Admin aktif:", admin.email);

    console.log("\n🎉 Database siap digunakan untuk Production!");
  } catch (err) {
    console.error("❌ Seeding gagal:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

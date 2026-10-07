// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
import { defaultSiteContent } from "../src/data/defaultSiteContent";

const prisma = new (PrismaClient as any)();

async function main() {
  console.log("🌱 Menjalankan Database Seeder NUSADIGITAL...");

  // 1. Simpan Konten Website Utama
  const content = await prisma.siteContent.upsert({
    where: { key: "main" },
    update: {
      data: defaultSiteContent as any,
      version: { increment: 1 },
    },
    create: {
      id: "active_content",
      key: "main",
      data: defaultSiteContent as any,
      version: 1,
    },
  });
  console.log(`✅ Konten Website (SiteContent) tersimpan! ID: ${content.id}, Versi: ${content.version}`);

  // 2. Akun Admin Default
  const adminPassword = process.env.ADMIN_PASSWORD || "suksesbareng";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nusadigital.id";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPassword,
      name: "Admin NusaDigital",
    },
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      name: "Admin NusaDigital",
      role: "ADMIN",
    },
  });
  console.log(`✅ Akun Admin tersimpan: ${admin.email}`);

  console.log("✨ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import type { Metadata } from "next";
import "./globals.css";
import { ContentProvider } from "@/context/ContentContext";
import { getInitialSiteContent } from "@/lib/get-initial-content";

export const metadata: Metadata = {
  title: "TUANMUDA — Creative Agency & Digital Growth Studio | Selong, Lombok Timur",
  description:
    "Official Studio di Selong, Lombok Timur. Jasa pembuatan website profesional, Meta ads & video iklan, kelola sosial media, SEO organik, dan pelatihan AI. Digital Rapi, Hasil Nyata.",
  keywords: [
    "jasa website lombok",
    "agensi digital lombok timur",
    "tuanmuda selong",
    "tuanmuda digital",
    "meta ads lombok",
    "kelola instagram lombok",
    "jasa seo ntb",
    "workshop ai lombok",
    "website umkm",
  ],
  authors: [{ name: "TUANMUDA Creative Agency" }],
  openGraph: {
    title: "TUANMUDA — Creative Agency & Digital Growth Studio",
    description:
      "Bisnis Anda Layak Tampil Hebat di Dunia Digital. Cepat, terjangkau, dan bergaransi dengan studio fisik di Selong Lombok Timur.",
    url: "https://tuanmuda.id",
    siteName: "TUANMUDA",
    locale: "id_ID",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = await getInitialSiteContent();

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans antialiased selection:bg-purple-500 selection:text-white">
        <ContentProvider initialContent={initialContent}>{children}</ContentProvider>
      </body>
    </html>
  );
}

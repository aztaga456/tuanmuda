import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Caveat } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

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

import { ContentProvider } from "@/context/ContentContext";
import { getInitialSiteContent } from "@/lib/get-initial-content";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = await getInitialSiteContent();

  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable} ${caveat.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans antialiased selection:bg-purple-500 selection:text-white">
        <ContentProvider initialContent={initialContent}>{children}</ContentProvider>
      </body>
    </html>
  );
}

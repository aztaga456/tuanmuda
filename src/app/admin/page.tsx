"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import {
  SiteContent,
  ServiceItem,
  DifferentiatorItem,
  WebsitePlan,
  SosmedPlan,
  VideoAdsPlan,
  MetaAdsPlan,
  SeoPlan,
  ExtensionItem,
  PortfolioItem,
  WorkflowStep,
  TestimonialItem,
  SocialProofItem,
  RotatingHeroService,
  MetricItem,
} from "@/data/defaultSiteContent";
import { getSafeImageUrl } from "@/lib/image-helper";

export default function AdminPage() {
  const {
    content,
    updateContent,
    resetContent,
    exportContent,
    importContent,
    syncWithDatabase,
    reloadFromDatabase,
  } = useContent();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<
    | "brand"
    | "hero"
    | "servicesBar"
    | "whyUs"
    | "pricing"
    | "extensions"
    | "portfolio"
    | "workflow"
    | "testimonials"
    | "socialProof"
    | "backup"
  >("brand");

  // Sync, Backup & Upload States
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [replacedUrls, setReplacedUrls] = useState<string[]>([]);
  const [backupStats, setBackupStats] = useState<any>(null);

  // Pricing Sub-tab
  const [pricingSubTab, setPricingSubTab] = useState<
    "website" | "sosmed" | "video_ads" | "meta_ads" | "seo"
  >("website");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Check existing session & sync from cloud
  useEffect(() => {
    const session = sessionStorage.getItem("tuanmuda_admin_session");
    if (session === "authenticated") {
      setIsAuthenticated(true);
      reloadFromDatabase();
    }
  }, [reloadFromDatabase]);

  const [newPasswordInput, setNewPasswordInput] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword =
      typeof window !== "undefined"
        ? localStorage.getItem("tuanmuda_admin_password") || "suksesbareng"
        : "suksesbareng";

    if (pinInput === storedPassword || pinInput === "suksesbareng") {
      sessionStorage.setItem("tuanmuda_admin_session", "authenticated");
      setIsAuthenticated(true);
      setAuthError("");
      reloadFromDatabase();
      showToast("Selamat datang di Panel Admin lomboXtudio!");
    } else {
      setAuthError("Password salah. Silakan coba lagi.");
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    showToast("Mengambil data terbaru dari Neon Database...");
    const ok = await reloadFromDatabase();
    setIsReloading(false);
    if (ok) {
      setHasUnsyncedChanges(false);
      showToast("✅ Berhasil memuat data terbaru dari cloud database!");
    } else {
      showToast("⚠️ Gagal memuat data dari database (cek koneksi).");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tuanmuda_admin_session");
    setIsAuthenticated(false);
  };

  // Upload file asli ke Storage Cloud (ImgBB / Google Drive / Local)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    oldUrl?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB.");
      return;
    }

    // 1. Tampilkan pratinjau lokal seketika (Zero Latency Instant Preview)
    try {
      const localPreviewUrl = URL.createObjectURL(file);
      onSuccess(localPreviewUrl);
      setHasUnsyncedChanges(true);
    } catch {}

    setIsUploading(true);
    showToast("Mengunggah gambar ke Cloud Storage...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        // 2. Ganti URL blob dengan URL cloud permanen
        onSuccess(data.url);
        setHasUnsyncedChanges(true);

        // Jika ada gambar lama yang diganti, catat untuk dihapus saat sinkronisasi
        if (
          oldUrl &&
          !oldUrl.startsWith("blob:") &&
          (oldUrl.includes("googleusercontent.com") ||
            oldUrl.includes("drive.google.com") ||
            oldUrl.startsWith("/uploads/"))
        ) {
          setReplacedUrls((prev) => Array.from(new Set([...prev, oldUrl])));
        }

        showToast("✅ Gambar berhasil diunggah & siap disimpan!");
      } else {
        alert("Gagal mengunggah file: " + (data.error || "Cek koneksi internet"));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan jaringan saat mengunggah: " + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Simpan & Sinkronkan langsung ke Cloud Database dan bersihkan gambar usang di storage
  const handleSync = async () => {
    setIsSyncing(true);
    showToast("Menyimpan ke Database & menyinkronkan data...");

    try {
      const res = await syncWithDatabase(replacedUrls);
      if (res.success) {
        setHasUnsyncedChanges(false);
        setReplacedUrls([]);
        const now = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setLastSyncTime(now);
        showToast(`✅ ${res.message}`);
      } else {
        alert(`Gagal sinkronisasi: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Backup snapshot database ke Neon & ekspor gambar lokal ke storage
  const handleBackup = async () => {
    setIsBackingUp(true);
    showToast("Memproses backup database ke Neon & ekspor gambar...");

    try {
      const res = await fetch("/api/backup", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setBackupStats(data.stats);
        showToast(`✅ ${data.message}`);
      } else {
        alert("Gagal backup: " + (data.error || "Unknown"));
      }
    } catch (err: any) {
      alert("Gagal memproses backup: " + err.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07091E] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md mx-3 sm:mx-auto bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mx-auto flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-indigo-500/30 mb-3 sm:mb-4 border border-white/20">
              LX
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Portal Admin lomboXtudio</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manajemen Konten & Kustomisasi Seluruh Website
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password / PIN Akses
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                autoFocus
              />
              {authError && (
                <p className="text-pink-400 text-xs mt-2 flex items-center gap-1">
                  <span>⚠️</span> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Masuk ke Panel Kontrol
            </button>


            <div className="pt-4 border-t border-white/5 text-center">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <span>←</span> Kembali ke Halaman Utama
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const ADMIN_TABS = [
    { id: "brand", label: "Brand & Logo", icon: "🏷️" },
    { id: "hero", label: "Hero Section", icon: "🚀" },
    { id: "servicesBar", label: "Solusi Terpadu", icon: "⚡" },
    { id: "whyUs", label: "Standar Mutu", icon: "🛡️" },
    { id: "pricing", label: "Paket & Harga", icon: "💰" },
    { id: "extensions", label: "Layanan Ekstensi", icon: "🧩" },
    { id: "portfolio", label: "Portofolio", icon: "💼" },
    { id: "workflow", label: "6 Alur Kerja", icon: "🔄" },
    { id: "testimonials", label: "Testimoni", icon: "⭐" },
    { id: "socialProof", label: "Social Proof Toast", icon: "🔔" },
    { id: "backup", label: "Export / Backup", icon: "📦" },
  ] as const;

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#060818] text-slate-200 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-5 sm:max-w-md z-50 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold animate-toast-in border border-emerald-400">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Panel Admin */}
      <header className="bg-[#090C22] border-b border-white/10 sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 shadow-lg backdrop-blur-md">
        {/* Brand Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/30 border border-white/20 shrink-0">
            {content.brand.emblemText || "LX"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight truncate">
                {content.brand.name || "lomboXtudio"} <span className="text-indigo-400">Admin</span>
              </span>
              <span className="text-[9px] sm:text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 sm:px-2 py-0.5 rounded-full font-mono shrink-0 font-bold">
                CMS
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate hidden xs:inline">Realtime Cloud Sync Aktif</span>
              <span className="truncate xs:hidden">Sync Aktif</span>
            </div>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* TOMBOL SIMPAN UTAMA (Sangat menonjol & responsif) */}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer ${
              isSyncing
                ? "bg-indigo-600/70 text-white cursor-wait border border-indigo-400/40"
                : hasUnsyncedChanges
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 border border-emerald-300 ring-2 ring-emerald-400/40 animate-pulse"
                : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 shadow-sm"
            }`}
            title="Simpan perubahan ke Cloud Database (langsung aktif realtime di HP & semua pengunjung)"
          >
            {isSyncing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden xs:inline">Menyimpan...</span>
                <span className="xs:hidden">...</span>
              </>
            ) : hasUnsyncedChanges ? (
              <>
                <span className="text-sm">💾</span>
                <span className="font-extrabold">Simpan</span>
                <span className="hidden sm:inline font-bold">Perubahan</span>
              </>
            ) : (
              <>
                <span className="text-emerald-400">✓</span>
                <span className="font-bold">Tersimpan</span>
              </>
            )}
          </button>

          {/* Tombol Tarik Data Cloud dari Database */}
          <button
            type="button"
            onClick={handleReload}
            disabled={isReloading}
            className={`px-2 sm:px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-xs font-semibold text-sky-300 hover:text-sky-200 border border-sky-500/30 transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
              isReloading ? "opacity-75 cursor-wait" : ""
            }`}
            title="Tarik data terbaru dari Neon Database (jika baru diedit dari HP atau perangkat lain)"
          >
            <span className={isReloading ? "animate-spin" : ""}>🔄</span>
            <span className="hidden md:inline">{isReloading ? "Memuat..." : "Tarik Data Cloud"}</span>
            <span className="md:hidden hidden xs:inline">Tarik</span>
          </button>

          {/* Tombol Lihat Website */}
          <Link
            href="/"
            target="_blank"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 transition-colors inline-flex items-center gap-1.5"
            title="Buka website publik di tab baru"
          >
            <span>👁️</span>
            <span className="hidden md:inline">Website</span>
          </Link>

          {/* Tombol Backup Snapshot */}
          <button
            type="button"
            onClick={handleBackup}
            disabled={isBackingUp}
            className={`hidden sm:inline-flex px-2 sm:px-3 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-xs font-semibold text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-colors items-center gap-1.5 cursor-pointer ${
              isBackingUp ? "opacity-75 cursor-wait" : ""
            }`}
            title="Backup snapshot database ke Neon & ekspor aset gambar ke storage"
          >
            <span>{isBackingUp ? "⏳" : "📦"}</span>
            <span className="hidden lg:inline">{isBackingUp ? "Membackup..." : "Backup"}</span>
          </button>

          {/* Tombol Keluar */}
          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-xs font-semibold text-pink-300 hover:text-pink-200 border border-pink-500/30 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="Keluar dari portal admin"
          >
            <span>🚪</span>
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Tabs (Desktop) */}
        <aside className="w-full md:w-64 bg-[#080B1E] border-b md:border-b-0 md:border-r border-white/10 p-2 sm:p-4 shrink-0 no-scrollbar hidden md:block">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Menu Bagian Website
          </div>
          <nav className="flex flex-col gap-1">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 border border-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Workspace Form Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl pb-32 md:pb-12">
          {/* ========================================================
              NAVIGASI KHUSUS MOBILE (UI HP yang Mudah Digunakan)
              ======================================================== */}
          <div className="md:hidden mb-4 bg-gradient-to-b from-[#0f1338] to-[#0a0d26] border border-white/15 rounded-2xl p-3 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📂</span> Menu Bagian Website
              </span>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-mono">
                11 Bagian
              </span>
            </div>

            {/* Dropdown Selector Cepat untuk Pengguna HP */}
            <div className="relative mb-2.5">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                aria-label="Pilih Bagian Website"
                className="w-full bg-[#151945] border border-indigo-500/30 text-white font-bold text-xs rounded-xl py-2.5 px-3 pr-8 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer shadow-inner"
              >
                {ADMIN_TABS.map((tab) => (
                  <option key={tab.id} value={tab.id} className="bg-[#0b0e2b] text-white py-1">
                    {tab.icon} {tab.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300 text-xs font-bold">
                ▼
              </div>
            </div>

            {/* Horizontal Swipeable Pill Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md border border-white/20"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* ========================================================
              TAB 1: IDENTITAS BRAND & LOGO
              ======================================================== */}
          {activeTab === "brand" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🏷️</span> Identitas Brand & Logo
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Atur nama agensi, teks logo, gambar logo kustom, dan kontak studio.
                </p>
              </div>

              {/* Logo Customization Card */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                  Tampilan Logo Agensi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Nama Brand
                    </label>
                    <input
                      type="text"
                      value={content.brand.name}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, name: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Subtitle Tagline (di bawah logo)
                    </label>
                    <input
                      type="text"
                      value={content.brand.subtitle}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, subtitle: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Teks Logo Bagian 1 (Putih)
                    </label>
                    <input
                      type="text"
                      value={content.brand.logoText1}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, logoText1: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Teks Logo Bagian 2 (Gradien)
                    </label>
                    <input
                      type="text"
                      value={content.brand.logoText2}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, logoText2: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Huruf Emblem Kotak (Default: TM)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={content.brand.emblemText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, emblemText: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  {/* Logo Image Upload / URL */}
                  {/* Logo Icon Image Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      1. Gambar Logo Icon Saja (File / URL) <span className="text-[10px] text-indigo-400 font-normal">(Mengganti ikon kotak, teks brand tetap utuh)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tempel URL ikon gambar atau upload..."
                        value={content.brand.logoImage || ""}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            brand: { ...prev.brand, logoImage: e.target.value },
                          }))
                        }
                        className="admin-input flex-1"
                      />
                      <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center transition-colors">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              (url) =>
                                updateContent((prev) => ({
                                  ...prev,
                                  brand: { ...prev.brand, logoImage: url },
                                })),
                              content.brand.logoImage
                            )
                          }
                        />
                      </label>
                      {content.brand.logoImage && (
                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              brand: { ...prev.brand, logoImage: "" },
                            }))
                          }
                          className="px-2 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/40 rounded-xl text-xs"
                          title="Hapus gambar icon"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Combined Full Logo Image Upload */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      2. Upload Logo Lengkap (Icon & Nama Brand Jadi Satu) <span className="text-[10px] text-pink-400 font-normal">(Opsional: Jika Anda punya 1 gambar logo horizontal menyatu dengan teks brand)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tempel URL logo lengkap (icon + teks) atau upload gambar horizontal..."
                        value={content.brand.fullLogoImage || ""}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            brand: { ...prev.brand, fullLogoImage: e.target.value },
                          }))
                        }
                        className="admin-input flex-1"
                      />
                      <label className="px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center transition-colors shadow-md shadow-pink-600/20">
                        Upload Logo Lengkap
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              (url) =>
                                updateContent((prev) => ({
                                  ...prev,
                                  brand: { ...prev.brand, fullLogoImage: url },
                                })),
                              content.brand.fullLogoImage
                            )
                          }
                        />
                      </label>
                      {content.brand.fullLogoImage && (
                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              brand: { ...prev.brand, fullLogoImage: "" },
                            }))
                          }
                          className="px-2 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/40 rounded-xl text-xs"
                          title="Hapus logo lengkap (kembali ke mode teks + icon)"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      💡 Jika logo lengkap diupload, website otomatis menampilkan gambar tersebut secara horizontal tanpa menduplikasi teks ketikan.
                    </p>
                  </div>
                </div>

                {/* Live Logo Preview Box */}
                <div className="mt-4 p-4 rounded-2xl bg-[#090c22] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>👁️</span> Pratinjau Logo Aktif:
                    </span>
                    <div className="flex items-center gap-2">
                      {content.brand.fullLogoImage ? (
                        <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2.5 py-0.5 rounded-full font-bold">
                          ✨ Mode Logo Lengkap (Menyatu) Aktif
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                          🎨 Mode Icon + Teks Brand
                        </span>
                      )}
                      {(content.brand.logoImage || content.brand.fullLogoImage) && (
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Media Cloud
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Dark Background Preview (Tampilan Header) */}
                    <div className="p-3.5 rounded-xl bg-[#07091E] border border-white/10 flex flex-col items-center justify-center min-h-[90px] relative">
                      <span className="text-[9px] uppercase font-bold text-slate-500 absolute top-2 left-2">Background Gelap (Header)</span>
                      <div className="flex items-center gap-2.5 my-2">
                        {content.brand.fullLogoImage ? (
                          <img
                            src={getSafeImageUrl(content.brand.fullLogoImage)}
                            alt="Preview Full Logo Dark"
                            className="h-9 sm:h-10 w-auto max-w-[220px] object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <>
                            {content.brand.logoImage ? (
                              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                                <img
                                  src={getSafeImageUrl(content.brand.logoImage)}
                                  alt="Preview Logo Icon Dark"
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.dataset.fallback && content.brand.logoImage) {
                                      img.dataset.fallback = "true";
                                      img.src = `https://wsrv.nl/?url=${encodeURIComponent(content.brand.logoImage)}`;
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                                {content.brand.emblemText || "LX"}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <div className="text-base sm:text-lg font-black tracking-tight leading-none text-white flex items-center">
                                <span>{content.brand.logoText1 || "lomboXtudio"}</span>
                                {content.brand.logoText2 && (
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400">
                                    {content.brand.logoText2}
                                  </span>
                                )}
                                {!`${content.brand.logoText1 || ""}${content.brand.logoText2 || ""}`.endsWith(".") && (
                                  <span className="text-pink-500">.</span>
                                )}
                              </div>
                              <span className="text-[7.5px] font-extrabold tracking-[0.2em] text-slate-400 uppercase mt-0.5">
                                {content.brand.subtitle || "DIGITAL SOLUTION"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Light Background Preview (Cek Transparansi / Footer / Surat) */}
                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center min-h-[90px] relative">
                      <span className="text-[9px] uppercase font-bold text-slate-500 absolute top-2 left-2">Background Terang (Cek Transparansi)</span>
                      <div className="flex items-center gap-2.5 my-2">
                        {content.brand.fullLogoImage ? (
                          <img
                            src={getSafeImageUrl(content.brand.fullLogoImage)}
                            alt="Preview Full Logo Light"
                            className="h-9 sm:h-10 w-auto max-w-[220px] object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <>
                            {content.brand.logoImage ? (
                              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                                <img
                                  src={getSafeImageUrl(content.brand.logoImage)}
                                  alt="Preview Logo Icon Light"
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
                                {content.brand.emblemText || "LX"}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <div className="text-base sm:text-lg font-black tracking-tight leading-none text-slate-900 flex items-center">
                                <span>{content.brand.logoText1 || "lomboXtudio"}</span>
                                {content.brand.logoText2 && (
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500">
                                    {content.brand.logoText2}
                                  </span>
                                )}
                                {!`${content.brand.logoText1 || ""}${content.brand.logoText2 || ""}`.endsWith(".") && (
                                  <span className="text-pink-500">.</span>
                                )}
                              </div>
                              <span className="text-[7.5px] font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-0.5">
                                {content.brand.subtitle || "DIGITAL SOLUTION"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Description & Studio Contacts */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                  Informasi Kontak & Studio Selong
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Deskripsi Brand (Tampil di Footer)
                  </label>
                  <textarea
                    rows={3}
                    value={content.brand.description}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, description: e.target.value },
                      }))
                    }
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Nomor WhatsApp (format internasional, cth: 6285955343737)
                    </label>
                    <input
                      type="text"
                      value={content.brand.whatsappNumber}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, whatsappNumber: e.target.value },
                        }))
                      }
                      className="admin-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      WhatsApp Tampilan (cth: +62 859-5534-3737)
                    </label>
                    <input
                      type="text"
                      value={content.brand.whatsappDisplay}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, whatsappDisplay: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Email Studio
                    </label>
                    <input
                      type="email"
                      value={content.brand.email}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, email: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Jam Operasional
                    </label>
                    <input
                      type="text"
                      value={content.brand.operationalHours}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, operationalHours: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Alamat Fisik Studio
                    </label>
                    <input
                      type="text"
                      value={content.brand.studioAddress}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, studioAddress: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Link Google Maps
                    </label>
                    <input
                      type="text"
                      value={content.brand.mapsUrl}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, mapsUrl: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: HERO SECTION
              ======================================================== */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🚀</span> Hero Section (Bagian Paling Atas)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Kustomisasi judul, narasi pengantar, layanan berputar, dan tombol CTA.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                  Judul & Narasi Hero
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Badge Kecil Atas
                    </label>
                    <input
                      type="text"
                      value={content.hero.badge}
                      placeholder="✦ Solusi Digital & Kreatif Terpercaya"
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, badge: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Judul Baris 1 (Teks Putih)
                    </label>
                    <input
                      type="text"
                      value={content.hero.headline1}
                      placeholder="Bisnis Anda"
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headline1: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Judul Baris 2 - Teks Putih <span className="text-slate-500 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlinePrefix2 || ""}
                      placeholder="Kosongkan jika semua baris 2 bergradien"
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headlinePrefix2: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Judul Baris 2 (Teks Gradien)
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlineGradient}
                      placeholder="Layak tampil Hebat"
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headlineGradient: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  {/* Live Preview Box Hero Headline */}
                  <div className="sm:col-span-3 p-4 rounded-xl bg-[#090c22] border border-white/10 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Preview Live Judul Hero:
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Real-time Sync
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="text-amber-300 text-xs">✦</span>
                        <span className="text-xs font-semibold text-sky-200">
                          {content.hero.badge ? content.hero.badge.replace(/^[✦✨★\s]+/, "") : "Solusi Digital & Kreatif Terpercaya"}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      </div>

                      <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                        <div>{content.hero.headline1 || "Bisnis Anda"}</div>
                        <div className="mt-0.5">
                          {content.hero.headlinePrefix2 && (
                            <span className="text-white mr-2">{content.hero.headlinePrefix2}</span>
                          )}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-300 to-pink-400">
                            {content.hero.headlineGradient || "Layak tampil Hebat"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Narasi Deskripsi Hero
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.narrative}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, narrative: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Teks Tombol Utama (CTA 1)
                    </label>
                    <input
                      type="text"
                      value={content.hero.primaryCta}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, primaryCta: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Teks Tombol Kedua (CTA 2)
                    </label>
                    <input
                      type="text"
                      value={content.hero.secondaryCta}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCta: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>

              {/* Rotating Services & Starting Prices */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                      Layanan Mengetik Berganti & Harga Mulai
                    </h3>
                    <p className="text-xs text-slate-400">
                      Teks animasi mengetik warna pink dan scroll harga di Hero
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSvc: RotatingHeroService = {
                        service: "Layanan Baru",
                        price: "Mulai Rp. 100 Ribu",
                      };
                      updateContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          rotatingServices: [...(prev.hero.rotatingServices || []), newSvc],
                        },
                      }));
                      showToast("Item layanan ditambahkan!");
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    + Tambah Layanan
                  </button>
                </div>

                <div className="space-y-2">
                  {content.hero.rotatingServices?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <span className="text-xs font-mono text-slate-500 w-6">#{idx + 1}</span>
                      <input
                        type="text"
                        value={item.service}
                        placeholder="Nama Layanan (cth: Bangun Web)"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...(prev.hero.rotatingServices || [])];
                            updated[idx] = { ...updated[idx], service: val };
                            return { ...prev, hero: { ...prev.hero, rotatingServices: updated } };
                          });
                        }}
                        className="admin-input flex-1"
                      />
                      <input
                        type="text"
                        value={item.price}
                        placeholder="Harga Mulai (cth: Mulai Rp. 200 Ribu)"
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...(prev.hero.rotatingServices || [])];
                            updated[idx] = { ...updated[idx], price: val };
                            return { ...prev, hero: { ...prev.hero, rotatingServices: updated } };
                          });
                        }}
                        className="admin-input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (content.hero.rotatingServices.length <= 1) {
                            alert("Minimal harus ada 1 item layanan berganti.");
                            return;
                          }
                          updateContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              rotatingServices: prev.hero.rotatingServices.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }));
                          showToast("Item dihapus!");
                        }}
                        className="px-2.5 py-1.5 text-pink-400 hover:bg-pink-500/20 rounded-lg text-xs transition-colors"
                        title="Hapus"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: SOLUSI TERPADU (ServicesBar)
              ======================================================== */}
          {activeTab === "servicesBar" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⚡</span> Solusi Terpadu lomboXtudio
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola kartu layanan utama (Website, Video Ads, Sosmed, Meta Ads, SEO).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: ServiceItem = {
                      id: `svc-${Date.now()}`,
                      title: "Layanan Baru",
                      badge: "Fitur Unggulan",
                      description: "Deskripsi singkat mengenai layanan ini untuk menarik minat klien.",
                      gradient: "from-blue-500 to-indigo-600",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      servicesBar: {
                        ...prev.servicesBar,
                        items: [...prev.servicesBar.items, newItem],
                      },
                    }));
                    showToast("Kartu layanan baru ditambahkan!");
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Kartu Layanan
                </button>
              </div>

              {/* Section Header */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Badge Section
                    </label>
                    <input
                      type="text"
                      value={content.servicesBar.badge}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          servicesBar: { ...prev.servicesBar, badge: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Judul Section
                    </label>
                    <input
                      type="text"
                      value={content.servicesBar.title}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          servicesBar: { ...prev.servicesBar, title: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Narasi Deskripsi
                    </label>
                    <textarea
                      rows={2}
                      value={content.servicesBar.narrative}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          servicesBar: { ...prev.servicesBar, narrative: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {content.servicesBar.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">
                        Kartu #{idx + 1} — {item.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            servicesBar: {
                              ...prev.servicesBar,
                              items: prev.servicesBar.items.filter((_, i) => i !== idx),
                            },
                          }));
                          showToast("Kartu dihapus!");
                        }}
                        className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                      >
                        Hapus Kartu
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Judul Layanan
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.servicesBar.items];
                              updated[idx] = { ...updated[idx], title: val };
                              return {
                                ...prev,
                                servicesBar: { ...prev.servicesBar, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Badge Kartu
                        </label>
                        <input
                          type="text"
                          value={item.badge}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.servicesBar.items];
                              updated[idx] = { ...updated[idx], badge: val };
                              return {
                                ...prev,
                                servicesBar: { ...prev.servicesBar, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Deskripsi Layanan
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.servicesBar.items];
                              updated[idx] = { ...updated[idx], description: val };
                              return {
                                ...prev,
                                servicesBar: { ...prev.servicesBar, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: STANDAR MUTU (WhyUsSection)
              ======================================================== */}
          {activeTab === "whyUs" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🛡️</span> Standar Mutu lomboXtudio
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola 4 keunggulan mutu dan banner kepercayaan klien.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newDiff: DifferentiatorItem = {
                      title: "Keunggulan Baru",
                      tagline: "Garansi Kualitas",
                      desc: "Penjelasan keunggulan yang membuat klien lebih yakin bermitra.",
                      gradient: "from-blue-500 to-indigo-600",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      whyUs: {
                        ...prev.whyUs,
                        differentiators: [...prev.whyUs.differentiators, newDiff],
                      },
                    }));
                    showToast("Keunggulan baru ditambahkan!");
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Keunggulan
                </button>
              </div>

              {/* Header section WhyUs */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Badge Section
                    </label>
                    <input
                      type="text"
                      value={content.whyUs.badge}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          whyUs: { ...prev.whyUs, badge: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Judul Bagian 1
                    </label>
                    <input
                      type="text"
                      value={content.whyUs.title}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          whyUs: { ...prev.whyUs, title: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Judul Bagian 2 (Gradien)
                    </label>
                    <input
                      type="text"
                      value={content.whyUs.titleGradient}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          whyUs: { ...prev.whyUs, titleGradient: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Narasi Deskripsi
                    </label>
                    <textarea
                      rows={2}
                      value={content.whyUs.narrative}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          whyUs: { ...prev.whyUs, narrative: e.target.value },
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Keunggulan Cards */}
              <div className="space-y-4">
                {content.whyUs.differentiators.map((diff, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">
                        Keunggulan #{idx + 1}: {diff.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            whyUs: {
                              ...prev.whyUs,
                              differentiators: prev.whyUs.differentiators.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }));
                          showToast("Keunggulan dihapus!");
                        }}
                        className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Judul
                        </label>
                        <input
                          type="text"
                          value={diff.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.whyUs.differentiators];
                              updated[idx] = { ...updated[idx], title: val };
                              return {
                                ...prev,
                                whyUs: { ...prev.whyUs, differentiators: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Tagline Singkat
                        </label>
                        <input
                          type="text"
                          value={diff.tagline}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.whyUs.differentiators];
                              updated[idx] = { ...updated[idx], tagline: val };
                              return {
                                ...prev,
                                whyUs: { ...prev.whyUs, differentiators: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Penjelasan Detail
                        </label>
                        <textarea
                          rows={2}
                          value={diff.desc}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.whyUs.differentiators];
                              updated[idx] = { ...updated[idx], desc: val };
                              return {
                                ...prev,
                                whyUs: { ...prev.whyUs, differentiators: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: PAKET LAYANAN & HARGA (PricingSection)
              ======================================================== */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>💰</span> Manajemen Paket Layanan & Harga
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Atur harga beli lepas vs langganan website, paket sosmed, video ads, meta ads, dan SEO.
                </p>
              </div>

              {/* Sub-tabs for 5 pricing categories */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                {[
                  { id: "website", label: "🌐 Website & Landing Page" },
                  { id: "sosmed", label: "📱 Kelola Sosial Media" },
                  { id: "video_ads", label: "🎬 Video & Image Ads" },
                  { id: "meta_ads", label: "🎯 Jasa Meta Ads" },
                  { id: "seo", label: "🔍 Optimasi SEO" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setPricingSubTab(st.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pricingSubTab === st.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* 1. SUB-TAB: WEBSITE */}
              {pricingSubTab === "website" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total Paket Website: {content.pricing.websitePlans.length} paket
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPlan: WebsitePlan = {
                          name: "Paket Web Baru",
                          badge: "Pilihan Terbaik",
                          popular: false,
                          desc: "Deskripsi singkat paket website ini.",
                          priceLepas: "Rp 500.000",
                          subLepas: "Sekali beli • Tanpa biaya bulanan",
                          priceLangganan: "Rp 250.000",
                          subLangganan: "Awal + Rp 50.000 / 6 bulan",
                          features: [
                            "Desain Modern Responsif",
                            "Domain & Hosting Termasuk",
                            "Tombol WhatsApp Direct",
                          ],
                        };
                        updateContent((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            websitePlans: [...prev.pricing.websitePlans, newPlan],
                          },
                        }));
                        showToast("Paket website baru ditambahkan!");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      + Tambah Paket Web
                    </button>
                  </div>

                  {content.pricing.websitePlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            #{idx + 1} {plan.name}
                          </span>
                          {plan.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              ⭐ Paling Laris
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plan.popular}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                updateContent((prev) => {
                                  const updated = [...prev.pricing.websitePlans];
                                  updated[idx] = { ...updated[idx], popular: chk };
                                  return {
                                    ...prev,
                                    pricing: { ...prev.pricing, websitePlans: updated },
                                  };
                                });
                              }}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                            />
                            <span>Paling Laris</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  websitePlans: prev.pricing.websitePlans.filter(
                                    (_, i) => i !== idx
                                  ),
                                },
                              }));
                              showToast("Paket dihapus!");
                            }}
                            className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Nama Paket
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], name: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Badge Paket
                          </label>
                          <input
                            type="text"
                            value={plan.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], badge: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harga Beli Lepas
                          </label>
                          <input
                            type="text"
                            value={plan.priceLepas}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], priceLepas: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-bold text-sky-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Keterangan Beli Lepas
                          </label>
                          <input
                            type="text"
                            value={plan.subLepas}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], subLepas: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harga Langganan Hemat
                          </label>
                          <input
                            type="text"
                            value={plan.priceLangganan}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], priceLangganan: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-bold text-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Keterangan Langganan
                          </label>
                          <input
                            type="text"
                            value={plan.subLangganan}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], subLangganan: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Deskripsi Paket
                          </label>
                          <input
                            type="text"
                            value={plan.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], desc: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        {/* Features List (Comma or Line Separated) */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Fitur-Fitur (Pisahkan tiap baris fitur baru)
                          </label>
                          <textarea
                            rows={4}
                            value={plan.features.join("\n")}
                            onChange={(e) => {
                              const feats = e.target.value
                                .split("\n")
                                .filter((f) => f.trim().length > 0);
                              updateContent((prev) => {
                                const updated = [...prev.pricing.websitePlans];
                                updated[idx] = { ...updated[idx], features: feats };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, websitePlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. SUB-TAB: SOSMED */}
              {pricingSubTab === "sosmed" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total Paket Sosial Media: {content.pricing.sosmedPlans.length} paket
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPlan: SosmedPlan = {
                          name: "Paket Sosmed Baru",
                          badge: "Tingkatkan Followers",
                          popular: false,
                          price: "Rp 750.000",
                          period: "/ bulan",
                          platforms: "Instagram & Facebook",
                          addPlatform: "Tambah platform lain +50K/bulan",
                          bonus: "Free Riset Hashtag & Copywriting",
                          posts: "15 Feeds Desain",
                          reels: "4 Video Reels",
                          features: [
                            "Desain Grafis Profesional",
                            "Jadwal Posting Rutin",
                            "Laporan Performa Bulanan",
                          ],
                        };
                        updateContent((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            sosmedPlans: [...prev.pricing.sosmedPlans, newPlan],
                          },
                        }));
                        showToast("Paket sosmed baru ditambahkan!");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      + Tambah Paket Sosmed
                    </button>
                  </div>

                  {content.pricing.sosmedPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            #{idx + 1} {plan.name}
                          </span>
                          {plan.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              ⭐ Paling Laris
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plan.popular}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                updateContent((prev) => {
                                  const updated = [...prev.pricing.sosmedPlans];
                                  updated[idx] = { ...updated[idx], popular: chk };
                                  return {
                                    ...prev,
                                    pricing: { ...prev.pricing, sosmedPlans: updated },
                                  };
                                });
                              }}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                            />
                            <span>Paling Laris</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  sosmedPlans: prev.pricing.sosmedPlans.filter((_, i) => i !== idx),
                                },
                              }));
                              showToast("Paket dihapus!");
                            }}
                            className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Nama Paket
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], name: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harga Paket
                          </label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], price: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-bold text-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Platform Default
                          </label>
                          <input
                            type="text"
                            value={plan.platforms}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], platforms: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Catatan Tambah Platform
                          </label>
                          <input
                            type="text"
                            value={plan.addPlatform}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], addPlatform: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input text-pink-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Jumlah Feeds Post
                          </label>
                          <input
                            type="text"
                            value={plan.posts}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], posts: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Jumlah Video Reels
                          </label>
                          <input
                            type="text"
                            value={plan.reels}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], reels: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Bonus / Benefit Tambahan
                          </label>
                          <input
                            type="text"
                            value={plan.bonus}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], bonus: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Fitur-Fitur (Pisahkan tiap baris baru)
                          </label>
                          <textarea
                            rows={3}
                            value={plan.features.join("\n")}
                            onChange={(e) => {
                              const feats = e.target.value
                                .split("\n")
                                .filter((f) => f.trim().length > 0);
                              updateContent((prev) => {
                                const updated = [...prev.pricing.sosmedPlans];
                                updated[idx] = { ...updated[idx], features: feats };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, sosmedPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. SUB-TAB: VIDEO & IMAGE ADS */}
              {pricingSubTab === "video_ads" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total Paket Video & Image Ads: {content.pricing.videoAdsPlans.length} paket
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPlan: VideoAdsPlan = {
                          name: "Paket Video Baru",
                          badge: "Format Stop-Scrolling",
                          popular: false,
                          price: "Rp 150.000",
                          subPrice: "/ paket iklan",
                          desc: "Deskripsi paket video atau image iklan.",
                          highlights: [
                            "Durasi 15-30 detik",
                            "Script Hook & CTA",
                            "Voiceover & Sound Efek",
                          ],
                        };
                        updateContent((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            videoAdsPlans: [...prev.pricing.videoAdsPlans, newPlan],
                          },
                        }));
                        showToast("Paket video ads baru ditambahkan!");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      + Tambah Paket Video Ads
                    </button>
                  </div>

                  {content.pricing.videoAdsPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          #{idx + 1} {plan.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plan.popular}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                updateContent((prev) => {
                                  const updated = [...prev.pricing.videoAdsPlans];
                                  updated[idx] = { ...updated[idx], popular: chk };
                                  return {
                                    ...prev,
                                    pricing: { ...prev.pricing, videoAdsPlans: updated },
                                  };
                                });
                              }}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                            />
                            <span>Paling Laris</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  videoAdsPlans: prev.pricing.videoAdsPlans.filter(
                                    (_, i) => i !== idx
                                  ),
                                },
                              }));
                              showToast("Paket dihapus!");
                            }}
                            className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Nama Paket
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.videoAdsPlans];
                                updated[idx] = { ...updated[idx], name: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, videoAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harga
                          </label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.videoAdsPlans];
                                updated[idx] = { ...updated[idx], price: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, videoAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-bold text-pink-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Badge
                          </label>
                          <input
                            type="text"
                            value={plan.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.videoAdsPlans];
                                updated[idx] = { ...updated[idx], badge: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, videoAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Deskripsi
                          </label>
                          <input
                            type="text"
                            value={plan.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.videoAdsPlans];
                                updated[idx] = { ...updated[idx], desc: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, videoAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Highlights / Fitur (Tiap baris baru)
                          </label>
                          <textarea
                            rows={3}
                            value={plan.highlights.join("\n")}
                            onChange={(e) => {
                              const arr = e.target.value
                                .split("\n")
                                .filter((f) => f.trim().length > 0);
                              updateContent((prev) => {
                                const updated = [...prev.pricing.videoAdsPlans];
                                updated[idx] = { ...updated[idx], highlights: arr };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, videoAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. SUB-TAB: JASA META ADS */}
              {pricingSubTab === "meta_ads" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total Paket Meta Ads: {content.pricing.metaAdsPlans.length} paket
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPlan: MetaAdsPlan = {
                          name: "Paket Meta Ads Baru",
                          badge: "Jangkauan Luas",
                          popular: false,
                          price: "Rp 75.000",
                          viewsEst: "10.000 – 25.000 Estimasi Tayang",
                          desc: "Penayangan iklan bersponsor di beranda Facebook & Instagram.",
                          highlights: [
                            "Targeting Audience Tertarget",
                            "Setup Pixel & Konversi",
                            "Laporan Transparan Meta Ads Manager",
                          ],
                        };
                        updateContent((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            metaAdsPlans: [...prev.pricing.metaAdsPlans, newPlan],
                          },
                        }));
                        showToast("Paket meta ads baru ditambahkan!");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      + Tambah Paket Meta Ads
                    </button>
                  </div>

                  {content.pricing.metaAdsPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          #{idx + 1} {plan.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plan.popular}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                updateContent((prev) => {
                                  const updated = [...prev.pricing.metaAdsPlans];
                                  updated[idx] = { ...updated[idx], popular: chk };
                                  return {
                                    ...prev,
                                    pricing: { ...prev.pricing, metaAdsPlans: updated },
                                  };
                                });
                              }}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                            />
                            <span>Paling Laris</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  metaAdsPlans: prev.pricing.metaAdsPlans.filter(
                                    (_, i) => i !== idx
                                  ),
                                },
                              }));
                              showToast("Paket dihapus!");
                            }}
                            className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Nama Paket
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.metaAdsPlans];
                                updated[idx] = { ...updated[idx], name: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, metaAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harga
                          </label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.metaAdsPlans];
                                updated[idx] = { ...updated[idx], price: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, metaAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-bold text-violet-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Estimasi Jangkauan / Views
                          </label>
                          <input
                            type="text"
                            value={plan.viewsEst}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.metaAdsPlans];
                                updated[idx] = { ...updated[idx], viewsEst: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, metaAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input text-sky-300"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Deskripsi
                          </label>
                          <input
                            type="text"
                            value={plan.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.metaAdsPlans];
                                updated[idx] = { ...updated[idx], desc: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, metaAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Highlights / Fitur (Tiap baris baru)
                          </label>
                          <textarea
                            rows={3}
                            value={plan.highlights.join("\n")}
                            onChange={(e) => {
                              const arr = e.target.value
                                .split("\n")
                                .filter((f) => f.trim().length > 0);
                              updateContent((prev) => {
                                const updated = [...prev.pricing.metaAdsPlans];
                                updated[idx] = { ...updated[idx], highlights: arr };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, metaAdsPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. SUB-TAB: OPTIMASI SEO */}
              {pricingSubTab === "seo" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Total Paket SEO: {content.pricing.seoPlans.length} paket
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPlan: SeoPlan = {
                          name: "Paket SEO Baru",
                          badge: "Tingkatkan Rank Google",
                          popular: false,
                          price: "Rp 150.000",
                          benefit: "Optimasi Keyword & Google Search Console",
                          highlights: [
                            "Riset Kata Kunci Lokal",
                            "Setup Meta Tags & Sitemap",
                            "Google Business Profile Sync",
                          ],
                        };
                        updateContent((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            seoPlans: [...prev.pricing.seoPlans, newPlan],
                          },
                        }));
                        showToast("Paket SEO baru ditambahkan!");
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      + Tambah Paket SEO
                    </button>
                  </div>

                  {content.pricing.seoPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          #{idx + 1} {plan.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plan.popular}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                updateContent((prev) => {
                                  const updated = [...prev.pricing.seoPlans];
                                  updated[idx] = { ...updated[idx], popular: chk };
                                  return {
                                    ...prev,
                                    pricing: { ...prev.pricing, seoPlans: updated },
                                  };
                                });
                              }}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                            />
                            <span>Paling Laris</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  seoPlans: prev.pricing.seoPlans.filter((_, i) => i !== idx),
                                },
                              }));
                              showToast("Paket dihapus!");
                            }}
                            className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Nama Paket
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.seoPlans];
                                updated[idx] = { ...updated[idx], name: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, seoPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Harga
                          </label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.seoPlans];
                                updated[idx] = { ...updated[idx], price: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, seoPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-bold text-teal-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Badge
                          </label>
                          <input
                            type="text"
                            value={plan.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.seoPlans];
                                updated[idx] = { ...updated[idx], badge: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, seoPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Manfaat Utama / Benefit
                          </label>
                          <input
                            type="text"
                            value={plan.benefit}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateContent((prev) => {
                                const updated = [...prev.pricing.seoPlans];
                                updated[idx] = { ...updated[idx], benefit: val };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, seoPlans: updated },
                                };
                              });
                            }}
                            className="admin-input"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">
                            Highlights / Fitur (Tiap baris baru)
                          </label>
                          <textarea
                            rows={3}
                            value={plan.highlights.join("\n")}
                            onChange={(e) => {
                              const arr = e.target.value
                                .split("\n")
                                .filter((f) => f.trim().length > 0);
                              updateContent((prev) => {
                                const updated = [...prev.pricing.seoPlans];
                                updated[idx] = { ...updated[idx], highlights: arr };
                                return {
                                  ...prev,
                                  pricing: { ...prev.pricing, seoPlans: updated },
                                };
                              });
                            }}
                            className="admin-input font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 6: LAYANAN EKSTENSI (ExtensionsSection)
              ======================================================== */}
          {activeTab === "extensions" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🧩</span> Layanan Ekstensi & Inovasi
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola Workshop AI, Pelatihan Foto AI, Desain Kemasan, dan Web App Sistem.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExt: ExtensionItem = {
                      id: `ext-${Date.now()}`,
                      title: "Layanan Ekstensi Baru",
                      category: "Layanan Khusus",
                      badge: "Baru",
                      image: "/ext-workshop-ai.jpg",
                      desc: "Deskripsi lengkap mengenai program atau solusi ekstensi ini.",
                      details: [
                        "Materi komprehensif & praktek langsung",
                        "Sertifikat & modul lengkap",
                        "Konsultasi follow up",
                      ],
                      gradient: "from-blue-600 to-indigo-600",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      extensions: {
                        ...prev.extensions,
                        items: [...prev.extensions.items, newExt],
                      },
                    }));
                    showToast("Layanan ekstensi baru ditambahkan!");
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Ekstensi
                </button>
              </div>

              {content.extensions.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-300">
                      #{idx + 1} {item.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          extensions: {
                            ...prev.extensions,
                            items: prev.extensions.items.filter((_, i) => i !== idx),
                          },
                        }));
                        showToast("Layanan ekstensi dihapus!");
                      }}
                      className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Judul
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.extensions.items];
                            updated[idx] = { ...updated[idx], title: val };
                            return { ...prev, extensions: { ...prev.extensions, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.extensions.items];
                            updated[idx] = { ...updated[idx], category: val };
                            return { ...prev, extensions: { ...prev.extensions, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Badge
                      </label>
                      <input
                        type="text"
                        value={item.badge}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.extensions.items];
                            updated[idx] = { ...updated[idx], badge: val };
                            return { ...prev, extensions: { ...prev.extensions, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    {/* Image URL & File Upload */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Gambar Thumbnail (URL atau Upload Langsung)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.image}
                          placeholder="/ext-workshop-ai.jpg atau https://..."
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.extensions.items];
                              updated[idx] = { ...updated[idx], image: val };
                              return {
                                ...prev,
                                extensions: { ...prev.extensions, items: updated },
                              };
                            });
                          }}
                          className="admin-input flex-1"
                        />
                        <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                (url) => {
                                  updateContent((prev) => {
                                    const updated = [...prev.extensions.items];
                                    updated[idx] = { ...updated[idx], image: url };
                                    return {
                                      ...prev,
                                      extensions: { ...prev.extensions, items: updated },
                                    };
                                  });
                                },
                                content.extensions.items[idx]?.image
                              )
                            }
                          />
                        </label>
                      </div>

                      {/* Live Thumbnail Preview for Extension Item */}
                      {item.image ? (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-[#090c22] border border-white/10 flex items-center gap-3">
                          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/15">
                            <img
                              src={getSafeImageUrl(item.image)}
                              alt={item.title || "Thumbnail Preview"}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const img = e.currentTarget;
                                if (!img.dataset.fallback && item.image) {
                                  img.dataset.fallback = "true";
                                  img.src = `https://wsrv.nl/?url=${encodeURIComponent(item.image)}`;
                                }
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Pratinjau Thumbnail Aktif
                            </span>
                            <p className="text-[11px] text-white font-medium truncate mt-0.5">
                              {item.title}
                            </p>
                            <span className="text-[9px] text-slate-400 font-mono truncate block mt-0.5">
                              {item.image}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => {
                                const updated = [...prev.extensions.items];
                                updated[idx] = { ...updated[idx], image: "" };
                                return {
                                  ...prev,
                                  extensions: { ...prev.extensions, items: updated },
                                };
                              });
                            }}
                            className="px-2.5 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg text-xs shrink-0 cursor-pointer border border-red-500/20"
                            title="Hapus gambar thumbnail"
                          >
                            ✕ Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 p-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.01] text-center text-[11px] text-slate-500">
                          📷 Belum ada gambar thumbnail. Unggah gambar atau masukkan URL di atas.
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.extensions.items];
                            updated[idx] = { ...updated[idx], desc: val };
                            return { ...prev, extensions: { ...prev.extensions, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Detail Poin (Tiap baris baru)
                      </label>
                      <textarea
                        rows={3}
                        value={item.details.join("\n")}
                        onChange={(e) => {
                          const arr = e.target.value
                            .split("\n")
                            .filter((f) => f.trim().length > 0);
                          updateContent((prev) => {
                            const updated = [...prev.extensions.items];
                            updated[idx] = { ...updated[idx], details: arr };
                            return { ...prev, extensions: { ...prev.extensions, items: updated } };
                          });
                        }}
                        className="admin-input font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================
              TAB 7: PORTOFOLIO (PortfolioSection)
              ======================================================== */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>💼</span> Portofolio Proyek Klien
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola studi kasus, metrik pertumbuhan omset, tantangan, solusi, dan gambar thumbnail.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPort: PortfolioItem = {
                      id: `port-${Date.now()}`,
                      title: "Nama Brand / Proyek",
                      category: "Web",
                      client: "Nama Klien / Perusahaan",
                      image: "/port-resort.jpg",
                      rating: 5,
                      metric: "+150% Omset",
                      description: "Deskripsi singkat hasil proyek.",
                      challenge: "Tantangan awal klien sebelum proyek dimulai.",
                      solution: "Solusi kreatif dan teknis yang kami hadirkan.",
                      results: ["Kenaikan omset nyata", "Tampilan profesional", "Kemudahan operasional"],
                      year: "2024",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      portfolio: {
                        ...prev.portfolio,
                        items: [...prev.portfolio.items, newPort],
                      },
                    }));
                    showToast("Proyek portofolio baru ditambahkan!");
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Proyek Portofolio
                </button>
              </div>

              {content.portfolio.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-sky-300">
                      #{idx + 1} {item.title} ({item.category})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio,
                            items: prev.portfolio.items.filter((_, i) => i !== idx),
                          },
                        }));
                        showToast("Proyek portofolio dihapus!");
                      }}
                      className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                    >
                      Hapus Proyek
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Judul Proyek
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], title: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Kategori
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], category: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input bg-[#090C22]"
                      >
                        <option value="Web">Web</option>
                        <option value="Ads">Ads</option>
                        <option value="Sosmed">Sosmed</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Web App">Web App</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Nama Klien
                      </label>
                      <input
                        type="text"
                        value={item.client}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], client: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Metrik Utama (cth: +340% Booking)
                      </label>
                      <input
                        type="text"
                        value={item.metric}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], metric: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input font-bold text-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Tahun
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], year: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    {/* Image URL & File Upload */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Gambar Thumbnail (URL atau File Upload)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.portfolio.items];
                              updated[idx] = { ...updated[idx], image: val };
                              return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                            });
                          }}
                          className="admin-input flex-1"
                        />
                        <label className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                (url) => {
                                  updateContent((prev) => {
                                    const updated = [...prev.portfolio.items];
                                    updated[idx] = { ...updated[idx], image: url };
                                    return {
                                      ...prev,
                                      portfolio: { ...prev.portfolio, items: updated },
                                    };
                                  });
                                },
                                content.portfolio.items[idx]?.image
                              )
                            }
                          />
                        </label>
                      </div>

                      {/* Live Thumbnail Preview for Portfolio Item */}
                      {item.image ? (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-[#090c22] border border-white/10 flex items-center gap-3">
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/15">
                            <img
                              src={getSafeImageUrl(item.image)}
                              alt={item.title || "Portfolio Preview"}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const img = e.currentTarget;
                                if (!img.dataset.fallback && item.image) {
                                  img.dataset.fallback = "true";
                                  img.src = `https://wsrv.nl/?url=${encodeURIComponent(item.image)}`;
                                }
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                              Pratinjau Portofolio Aktif
                            </span>
                            <p className="text-[11px] text-white font-medium truncate mt-0.5">
                              {item.title} ({item.client})
                            </p>
                            <span className="text-[9px] text-slate-400 font-mono truncate block mt-0.5">
                              {item.image}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              updateContent((prev) => {
                                const updated = [...prev.portfolio.items];
                                updated[idx] = { ...updated[idx], image: "" };
                                return {
                                  ...prev,
                                  portfolio: { ...prev.portfolio, items: updated },
                                };
                              });
                            }}
                            className="px-2.5 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg text-xs shrink-0 cursor-pointer border border-red-500/20"
                            title="Hapus gambar portofolio"
                          >
                            ✕ Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 p-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.01] text-center text-[11px] text-slate-500">
                          📷 Belum ada gambar portofolio. Unggah gambar atau masukkan URL di atas.
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], description: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Tantangan Klien (Challenge)
                      </label>
                      <textarea
                        rows={2}
                        value={item.challenge}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], challenge: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Solusi yang Kami Hadirkan
                      </label>
                      <textarea
                        rows={2}
                        value={item.solution}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], solution: val };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Hasil Nyata (Results - tiap baris baru)
                      </label>
                      <textarea
                        rows={3}
                        value={item.results.join("\n")}
                        onChange={(e) => {
                          const arr = e.target.value
                            .split("\n")
                            .filter((f) => f.trim().length > 0);
                          updateContent((prev) => {
                            const updated = [...prev.portfolio.items];
                            updated[idx] = { ...updated[idx], results: arr };
                            return { ...prev, portfolio: { ...prev.portfolio, items: updated } };
                          });
                        }}
                        className="admin-input font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================
              TAB 8: 6 ALUR KERJA (WorkflowSection)
              ======================================================== */}
          {activeTab === "workflow" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🔄</span> 6 Alur Kerja Transparan
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola tahapan SOP pengerjaan dari konsultasi, DP, pengerjaan, hingga serah terima.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newStep: WorkflowStep = {
                      step: `0${content.workflow.steps.length + 1}`,
                      title: "Langkah Baru",
                      desc: "Penjelasan proses pada langkah ini.",
                      deliverable: "Hasil output tahapan ini",
                      gradient: "from-blue-600 to-indigo-600",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      workflow: {
                        ...prev.workflow,
                        steps: [...prev.workflow.steps, newStep],
                      },
                    }));
                    showToast("Langkah alur kerja baru ditambahkan!");
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Langkah
                </button>
              </div>

              {content.workflow.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-400">
                      Langkah {st.step}: {st.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          workflow: {
                            ...prev.workflow,
                            steps: prev.workflow.steps.filter((_, i) => i !== idx),
                          },
                        }));
                        showToast("Langkah dihapus!");
                      }}
                      className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Nomor Langkah (cth: 01)
                      </label>
                      <input
                        type="text"
                        value={st.step}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.workflow.steps];
                            updated[idx] = { ...updated[idx], step: val };
                            return { ...prev, workflow: { ...prev.workflow, steps: updated } };
                          });
                        }}
                        className="admin-input font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Judul Langkah
                      </label>
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.workflow.steps];
                            updated[idx] = { ...updated[idx], title: val };
                            return { ...prev, workflow: { ...prev.workflow, steps: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Deliverable / Output Nyata
                      </label>
                      <input
                        type="text"
                        value={st.deliverable}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.workflow.steps];
                            updated[idx] = { ...updated[idx], deliverable: val };
                            return { ...prev, workflow: { ...prev.workflow, steps: updated } };
                          });
                        }}
                        className="admin-input text-emerald-300"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Deskripsi Penjelasan
                      </label>
                      <textarea
                        rows={2}
                        value={st.desc}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.workflow.steps];
                            updated[idx] = { ...updated[idx], desc: val };
                            return { ...prev, workflow: { ...prev.workflow, steps: updated } };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================
              TAB 9: TESTIMONI KLIEN (TestimonialsSection)
              ======================================================== */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⭐</span> Testimoni Klien
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola review asli dari UMKM, bisnis, dan institusi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTesti: TestimonialItem = {
                      name: "Nama Klien Baru",
                      role: "Owner / Pengusaha",
                      company: "Nama Usaha di Selong / NTB",
                      rating: 5,
                      content: "Review positif mengenai pengerjaan dan kepuasan hasil layanan.",
                      avatarBg: "bg-blue-600",
                      initial: "N",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      testimonials: {
                        ...prev.testimonials,
                        items: [...prev.testimonials.items, newTesti],
                      },
                    }));
                    showToast("Testimoni baru ditambahkan!");
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Testimoni
                </button>
              </div>

              {content.testimonials.items.map((testi, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300">
                      #{idx + 1} {testi.name} — {testi.company}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateContent((prev) => ({
                          ...prev,
                          testimonials: {
                            ...prev.testimonials,
                            items: prev.testimonials.items.filter((_, i) => i !== idx),
                          },
                        }));
                        showToast("Testimoni dihapus!");
                      }}
                      className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Nama Klien
                      </label>
                      <input
                        type="text"
                        value={testi.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.testimonials.items];
                            updated[idx] = {
                              ...updated[idx],
                              name: val,
                              initial: val.charAt(0).toUpperCase() || "T",
                            };
                            return {
                              ...prev,
                              testimonials: { ...prev.testimonials, items: updated },
                            };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Jabatan / Role
                      </label>
                      <input
                        type="text"
                        value={testi.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.testimonials.items];
                            updated[idx] = { ...updated[idx], role: val };
                            return {
                              ...prev,
                              testimonials: { ...prev.testimonials, items: updated },
                            };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Nama Usaha / Perusahaan
                      </label>
                      <input
                        type="text"
                        value={testi.company}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.testimonials.items];
                            updated[idx] = { ...updated[idx], company: val };
                            return {
                              ...prev,
                              testimonials: { ...prev.testimonials, items: updated },
                            };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Isi Ulasan / Testimoni
                      </label>
                      <textarea
                        rows={3}
                        value={testi.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateContent((prev) => {
                            const updated = [...prev.testimonials.items];
                            updated[idx] = { ...updated[idx], content: val };
                            return {
                              ...prev,
                              testimonials: { ...prev.testimonials, items: updated },
                            };
                          });
                        }}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================
              TAB 10: SOCIAL PROOF POPUP ALERTS
              ======================================================== */}
          {activeTab === "socialProof" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🔔</span> Social Proof Toast Popup
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Notifikasi mengambang otomatis di pojok kiri bawah saat pengunjung melihat website.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    checked={content.socialProof.enabled}
                    onChange={(e) => {
                      const chk = e.target.checked;
                      updateContent((prev) => ({
                        ...prev,
                        socialProof: { ...prev.socialProof, enabled: chk },
                      }));
                      showToast(
                        chk ? "Social proof diaktifkan!" : "Social proof dinonaktifkan!"
                      );
                    }}
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-white">
                    {content.socialProof.enabled ? "Aktif" : "Nonaktif"}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Daftar Notifikasi Bergilir ({content.socialProof.items.length} item)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: SocialProofItem = {
                      name: "Pengunjung Baru",
                      location: "Selong, Lombok Timur",
                      action: "Telah memesan konsultasi gratis",
                      service: "Website",
                      timeAgo: "1 menit yang lalu",
                      icon: "💬",
                      gradient: "from-blue-500 to-indigo-600",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      socialProof: {
                        ...prev.socialProof,
                        items: [...prev.socialProof.items, newItem],
                      },
                    }));
                    showToast("Notifikasi social proof baru ditambahkan!");
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Tambah Notifikasi
                </button>
              </div>

              <div className="space-y-3">
                {content.socialProof.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>
                          {item.name} ({item.location})
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            socialProof: {
                              ...prev.socialProof,
                              items: prev.socialProof.items.filter((_, i) => i !== idx),
                            },
                          }));
                          showToast("Item notifikasi dihapus!");
                        }}
                        className="text-pink-400 hover:text-pink-300 text-xs px-2 py-1 rounded hover:bg-pink-500/10 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Nama Klien / Inisial
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.socialProof.items];
                              updated[idx] = { ...updated[idx], name: val };
                              return {
                                ...prev,
                                socialProof: { ...prev.socialProof, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Lokasi (cth: Selong, Mataram)
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.socialProof.items];
                              updated[idx] = { ...updated[idx], location: val };
                              return {
                                ...prev,
                                socialProof: { ...prev.socialProof, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Waktu Lalu (cth: 3 menit lalu)
                        </label>
                        <input
                          type="text"
                          value={item.timeAgo}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.socialProof.items];
                              updated[idx] = { ...updated[idx], timeAgo: val };
                              return {
                                ...prev,
                                socialProof: { ...prev.socialProof, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Aksi / Tindakan (cth: Telah memesan Paket Web Sekolah)
                        </label>
                        <input
                          type="text"
                          value={item.action}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.socialProof.items];
                              updated[idx] = { ...updated[idx], action: val };
                              return {
                                ...prev,
                                socialProof: { ...prev.socialProof, items: updated },
                              };
                            });
                          }}
                          className="admin-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Emoji Icon (cth: 🌐, 💬, 🎬)
                        </label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateContent((prev) => {
                              const updated = [...prev.socialProof.items];
                              updated[idx] = { ...updated[idx], icon: val };
                              return {
                                ...prev,
                                socialProof: { ...prev.socialProof, items: updated },
                              };
                            });
                          }}
                          className="admin-input text-center text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 11: BACKUP, EXPORT & SYNC CLOUD
              ======================================================== */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📦</span> Sinkronisasi Cloud, Backup & Ekspor Data
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola sinkronisasi langsung ke Neon PostgreSQL dan ImgBB Cloud Storage.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSyncing ? "⏳" : "⚡"}</span>
                    <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isBackingUp ? "⏳" : "💾"}</span>
                    <span>{isBackingUp ? "Membackup..." : "Buat Snapshot Backup"}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Database */}
                <div className="bg-[#090C22] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">
                    🗄️
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Database Cloud
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Neon PostgreSQL (Connected)
                    </div>
                  </div>
                </div>

                {/* Status Storage */}
                <div className="bg-[#090C22] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                    📁
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Media Storage
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ImgBB Cloud Storage (Aktif & Realtime)
                    </div>
                  </div>
                </div>

                {/* Status Sinkronisasi */}
                <div className="bg-[#090C22] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
                    🔄
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Status Sinkronisasi
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {hasUnsyncedChanges ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          ⚠️ Ada Perubahan Belum Disimpan
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          ✓ Tersinkron ({lastSyncTime || "Terbaru"})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice Garbage Collection */}
              {replacedUrls.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🗑️</span>
                    <span>
                      Ada <strong>{replacedUrls.length} file gambar lama</strong> yang diganti.
                      File tersebut akan otomatis dibersihkan dari penyimpanan cloud saat Anda menekan tombol <strong>Sinkronkan Sekarang</strong>.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSync}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors shrink-0"
                  >
                    Hapus & Sinkronkan
                  </button>
                </div>
              )}

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Simpan & Sinkronkan Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-2xl mb-2">⚡</div>
                    <h3 className="font-bold text-white text-sm">Simpan & Sinkronkan</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Update konten langsung ke Cloud DB dan bersihkan otomatis gambar usang di storage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSyncing ? "Menyinkronkan..." : "Sinkronkan ke Cloud"}
                  </button>
                </div>

                {/* Snapshot Backup Neon & Storage Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-2xl mb-2">📦</div>
                    <h3 className="font-bold text-white text-sm">Snapshot Backup Neon</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Buat titik pemulihan permanen di Neon Database & arsipkan data terbaru.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isBackingUp ? "Memproses Backup..." : "Ekspor & Buat Snapshot"}
                  </button>
                </div>

                {/* Download Backup JSON */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-2xl mb-2">💾</div>
                    <h3 className="font-bold text-white text-sm">Download Backup JSON</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Unduh seluruh konten website beserta data booking dan media ke file JSON offline.
                    </p>
                  </div>
                  <a
                    href="/api/backup"
                    download
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center border border-white/15 block"
                  >
                    Unduh Arsip Lengkap (.json)
                  </a>
                </div>

                {/* Import / Restore Backup */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-2xl mb-2">📥</div>
                    <h3 className="font-bold text-white text-sm">Restore Data dari JSON</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Unggah file JSON backup yang pernah Anda unduh sebelumnya untuk mengembalikan konten.
                    </p>
                  </div>
                  <label className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center border border-white/15 block">
                    Pilih File JSON
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const fileContent = event.target?.result as string;
                            if (fileContent && importContent(fileContent)) {
                              setHasUnsyncedChanges(true);
                              showToast("Data berhasil dipulihkan dari file JSON!");
                            } else {
                              alert("Format file JSON tidak valid.");
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Pengaturan Akun & Reset */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ganti Password Admin */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div>
                    <div className="text-2xl mb-2">🔑</div>
                    <h3 className="font-bold text-white text-sm">Ganti Password Admin</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ubah password untuk masuk ke panel admin (bawaan: <code className="text-emerald-300 font-mono">suksesbareng</code>).
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Ketik password baru..."
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="admin-input text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPasswordInput || newPasswordInput.trim().length < 4) {
                          alert("Password baru minimal 4 karakter.");
                          return;
                        }
                        localStorage.setItem("tuanmuda_admin_password", newPasswordInput.trim());
                        setNewPasswordInput("");
                        showToast("Password admin berhasil diperbarui!");
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      Simpan
                    </button>
                  </div>
                </div>

                {/* Factory Reset */}
                <div className="bg-pink-500/[0.05] border border-pink-500/20 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-2xl mb-2">↺</div>
                    <h3 className="font-bold text-pink-300 text-sm">Kembali ke Default Pabrik</h3>
                    <p className="text-xs text-pink-200/60 mt-1">
                      Mengembalikan seluruh teks, harga, dan struktur section ke konten bawaan awal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          "PERINGATAN: Apakah Anda yakin ingin mengembalikan seluruh website ke setelan bawaan pabrik? Semua perubahan Anda akan di-reset."
                        )
                      ) {
                        resetContent();
                        setHasUnsyncedChanges(true);
                        showToast("Konten berhasil di-reset ke setelan awal pabrik!");
                      }
                    }}
                    className="w-full py-2.5 bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-pink-500/40 text-center"
                  >
                    Reset ke Konten Awal
                  </button>
                </div>
              </div>

              {/* Raw JSON View */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Raw Data JSON
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(exportContent());
                      showToast("JSON disalin ke clipboard!");
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Salin ke Clipboard
                  </button>
                </div>
                <pre className="bg-[#050614] p-4 rounded-xl text-[11px] font-mono text-slate-400 overflow-x-auto max-h-60 border border-white/5">
                  {exportContent()}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          STICKY MOBILE BOTTOM BAR (Khusus Layar HP / Mobile)
          Tombol Simpan selalu menempel di bawah jempol pengguna!
          ======================================================== */}
      <aside
        aria-label="Aksi Simpan Mobile"
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#07091Ef2] backdrop-blur-2xl border-t border-white/15 p-3 px-4 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                hasUnsyncedChanges ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            <span className="text-[11px] font-bold text-white truncate">
              {hasUnsyncedChanges ? "Ada Perubahan Baru" : "Semua Tersimpan"}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate mt-0.5">
            {hasUnsyncedChanges
              ? "Klik simpan untuk publikasi"
              : `Realtime Sync (${lastSyncTime || "Aktif"})`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 ${
            isSyncing
              ? "bg-indigo-600/70 text-white cursor-wait border border-indigo-400/30"
              : hasUnsyncedChanges
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/40 ring-2 ring-emerald-400/50 animate-pulse"
              : "bg-white/10 hover:bg-white/15 text-emerald-300 border border-emerald-400/30"
          }`}
        >
          {isSyncing ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : hasUnsyncedChanges ? (
            <>
              <span>💾</span>
              <span>Simpan Sekarang</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Tersimpan</span>
            </>
          )}
        </button>
      </aside>

      {/* Floating Notification Bar di Desktop jika ada perubahan belum disinkronkan */}
      {hasUnsyncedChanges && (
        <aside
          aria-label="Notifikasi Sinkronisasi Desktop"
          className="hidden md:flex fixed bottom-5 right-6 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 px-5 rounded-2xl shadow-2xl items-center gap-4 border border-indigo-500/40 backdrop-blur-xl max-w-md"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
            ⚡
          </div>
          <div className="text-xs min-w-0">
            <p className="font-bold text-white leading-tight">Perubahan Belum Disimpan ke Database!</p>
            <p className="text-[11px] text-slate-300 opacity-90 leading-tight mt-0.5">
              Klik simpan agar perubahan langsung aktif di HP & semua pengunjung.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="ml-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs shrink-0 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            {isSyncing ? "Menyimpan..." : "Simpan Sekarang"}
          </button>
        </aside>
      )}

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 0.75rem;
          color: #ffffff;
          font-size: 16px;
          transition: all 0.2s;
        }
        @media (min-width: 640px) {
          .admin-input {
            font-size: 0.8125rem;
          }
        }
        .admin-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          background-color: rgba(255, 255, 255, 0.08);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

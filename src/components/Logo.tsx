"use client";

import { useState, useEffect } from "react";
import { useContent } from "@/context/ContentContext";
import { getSafeImageUrl } from "@/lib/image-helper";

interface LogoProps {
  className?: string;
  variant?: "white" | "dark";
  subtitle?: string;
}

export default function Logo({ className = "", variant = "white", subtitle }: LogoProps) {
  const { content } = useContent();
  const brand = content?.brand;

  const [iconError, setIconError] = useState(false);
  const [fullLogoError, setFullLogoError] = useState(false);

  useEffect(() => {
    setIconError(false);
  }, [brand?.logoImage]);

  useEffect(() => {
    setFullLogoError(false);
  }, [brand?.fullLogoImage]);

  const customFullLogo = brand?.fullLogoImage;
  const safeFullLogoUrl = getSafeImageUrl(customFullLogo);

  // 1. OPSI LOGO LENGKAP: Jika upload gambar logo dan nama jadi satu (Full Logo Horizontal)
  if (customFullLogo && !fullLogoError) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={safeFullLogoUrl}
          alt={brand?.name || "Logo"}
          className="h-8 sm:h-9 md:h-10 w-auto max-w-[200px] sm:max-w-[260px] object-contain group-hover:scale-[1.02] transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={() => setFullLogoError(true)}
        />
      </div>
    );
  }

  // 2. OPSI LOGO ICON + TEKS BRAND:
  const displaySubtitle = subtitle || brand?.subtitle || "DIGITAL SOLUTION";
  const logoText1 = brand?.logoText1 !== undefined && brand?.logoText1 !== null ? brand.logoText1 : "lomboXtudio";
  const logoText2 = brand?.logoText2 !== undefined && brand?.logoText2 !== null ? brand.logoText2 : "";
  const emblemText = brand?.emblemText || "LX";
  const customLogoIcon = brand?.logoImage;
  const safeIconUrl = getSafeImageUrl(customLogoIcon);

  const fullText = `${logoText1}${logoText2}`;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Icon / Emblem: Border dihilangkan sepenuhnya */}
      {customLogoIcon && !iconError ? (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
          <img
            src={safeIconUrl}
            alt={brand?.name || "Logo Icon"}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            onError={() => setIconError(true)}
          />
        </div>
      ) : (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
          <span className="tracking-tighter">{emblemText}</span>
        </div>
      )}

      {/* Teks Brand Typography: Selalu tampil dan tidak pernah duplikat */}
      <div className="flex flex-col">
        <div className="text-xl sm:text-2xl font-black tracking-tight leading-none flex items-center">
          <span className={variant === "white" ? "text-white" : "text-slate-900"}>{logoText1}</span>
          {logoText2 && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400">
              {logoText2}
            </span>
          )}
          {!fullText.endsWith(".") && (
            <span className="text-pink-500 text-lg">.</span>
          )}
        </div>
        {displaySubtitle && (
          <span className="text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.24em] text-slate-400 uppercase mt-0.5">
            {displaySubtitle}
          </span>
        )}
      </div>
    </div>
  );
}

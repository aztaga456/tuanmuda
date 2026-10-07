"use client";

import { useState } from "react";
import Image from "next/image";
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

  const [imageError, setImageError] = useState(false);

  const displaySubtitle = subtitle || brand?.subtitle || "DIGITAL SOLUTION";
  const logoText1 = brand?.logoText1 || "TUAN";
  const logoText2 = brand?.logoText2 || "MUDA";
  const emblemText = brand?.emblemText || "TM";
  const customLogoImage = brand?.logoImage;

  const safeLogoUrl = getSafeImageUrl(customLogoImage);

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {customLogoImage && !imageError ? (
        <div className="relative h-10 w-auto min-w-[40px] max-w-[180px] flex items-center">
          <img
            src={safeLogoUrl}
            alt={brand?.name || "Logo"}
            className="max-h-10 object-contain rounded"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <>
          {/* High-tech Emblem TM */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30 border border-white/25 shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
            <span className="tracking-tighter">{emblemText}</span>
          </div>

          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl font-black tracking-tight leading-none">
              <span className={variant === "white" ? "text-white" : "text-slate-900"}>{logoText1}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400">
                {logoText2}
              </span>
              <span className="text-pink-500 text-lg">.</span>
            </div>
            <span className="text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.24em] text-slate-400 uppercase mt-0.5">
              {displaySubtitle}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

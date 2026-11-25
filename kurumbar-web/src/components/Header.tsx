"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  PhoneCall,
  Globe2,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  lang: "ta" | "en";
  setLang: (lang: "ta" | "en") => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    ta: {
      helpline: "சமூக உதவி எண்: +91 94432 12345 | support@kurumbar.org",
      verifyId: "உறுப்பினர் அட்டை சரிபார்ப்பு",
      home: "முகப்பு",
      about: "எங்களை பற்றி",
      register: "உறுப்பினர் பதிவு",
      matrimony: "வரன் தேடல்",
      marketplace: "சந்தை",
      jobs: "வேலைவாய்ப்பு",
      news: "செய்திகள்",
      gallery: "புகைப்படங்கள்",
      contact: "தொடர்பு",
      ctaRegister: "உறுப்பினர் பதிவு செய்க",
      login: "உள்நுழைவு",
    },
    en: {
      helpline: "Community Helpline: +91 94432 12345 | support@kurumbar.org",
      verifyId: "Verify Member ID",
      home: "Home",
      about: "About Us",
      register: "Member Registry",
      matrimony: "Matrimony",
      marketplace: "Marketplace",
      jobs: "Jobs",
      news: "News & Events",
      gallery: "Gallery",
      contact: "Contact",
      ctaRegister: "Register as Member",
      login: "Login",
    },
  }[lang];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      {/* Top micro-bar for official helpline & quick verification */}
      <div className="bg-[#14532D] text-white text-xs py-1.5 px-3 sm:px-6 lg:px-8 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <PhoneCall className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
          <span className="font-medium tracking-wide truncate text-[11px] sm:text-xs">
            <span className="hidden md:inline">{t.helpline}</span>
            <span className="hidden sm:inline md:hidden">உதவி எண்: +91 94432 12345 | support@kurumbar.org</span>
            <span className="sm:hidden">+91 94432 12345</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <Link
            href="#verify"
            className="hidden xs:flex items-center gap-1.5 text-white/90 hover:text-[#FACC15] transition-colors font-medium text-[11px] sm:text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>{t.verifyId}</span>
          </Link>
          <div className="flex items-center gap-1 bg-[#15803D] hover:bg-[#166534] rounded-full px-2 py-0.5 border border-white/20 transition-colors shadow-2xs">
            <Globe2 className="w-3 h-3 text-[#FACC15]" />
            <button
              onClick={() => setLang(lang === "ta" ? "en" : "ta")}
              className="font-bold text-[11px] text-white hover:text-[#FACC15] transition-colors cursor-pointer"
              title="Click to toggle Tamil / English"
            >
              {lang === "ta" ? "English" : "தமிழ்"}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-xs border border-[#15803D]/20 bg-[#FAFAF5] p-1 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/brand/logo.png"
                alt="Kurumbar Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#14532D] tracking-tight">
                  KURUMBAR
                </span>
                <span className="bg-[#FACC15] text-[#14532D] text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs shrink-0">
                  குறும்பர்
                </span>
              </div>
              <p className="hidden min-[1600px]:block text-[11px] text-[#475569] font-medium tracking-wide">
                அதிகாரப்பூர்வ சமூக இணையதளம் • www.kurumbar.org
              </p>
              <p className="hidden sm:block min-[1600px]:hidden text-[10px] text-[#475569] font-medium tracking-wide">
                அதிகாரப்பூர்வ தளம்
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible on xl: 1200px+) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 shrink-0">
            <Link
              href="#home"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.home}
            </Link>
            <Link
              href="#about"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.about}
            </Link>
            <Link
              href="#matrimony"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.matrimony}
            </Link>
            <Link
              href="#marketplace"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.marketplace}
            </Link>
            <Link
              href="#jobs"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.jobs}
            </Link>
            <Link
              href="#news"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.news}
            </Link>
            <Link
              href="#gallery"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.gallery}
            </Link>
            <Link
              href="#contact"
              className="px-2 py-1.5 text-xs 2xl:text-[13px] font-bold text-[#1E293B] hover:text-[#15803D] hover:bg-[#DCFCE7]/50 rounded-lg transition-colors whitespace-nowrap"
            >
              {t.contact}
            </Link>
          </nav>

          {/* Action CTA Button (Visible on xl: 1200px+) */}
          <div className="hidden xl:flex items-center shrink-0">
            <Link
              href="#register"
              className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-[#14532D] text-white px-4 2xl:px-5 py-2.5 rounded-xl font-bold text-xs 2xl:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4 text-[#FACC15]" />
              <span>{t.ctaRegister}</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls (Visible on screens < xl) */}
          <div className="xl:hidden flex items-center gap-2">
            <Link
              href="#register"
              className="inline-flex items-center gap-1.5 bg-[#15803D] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>{lang === "ta" ? "பதிவு செய்க" : "Register"}</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1E293B] hover:bg-[#FAFAF5] border border-[#E2E8F0] focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#14532D]" />
              ) : (
                <Menu className="w-6 h-6 text-[#14532D]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top">
          {/* Quick Language Switcher Bar inside Drawer */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#DCFCE7]/40 border border-[#15803D]/20 mb-3">
            <span className="text-xs font-bold text-[#14532D] flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#15803D]" />
              <span>{lang === "ta" ? "மொழியை மாற்றுக (Language)" : "Change Language"}</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <button
                type="button"
                onClick={() => setLang("ta")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === "ta" ? "bg-[#15803D] text-white shadow-xs" : "text-[#475569] hover:bg-gray-100"
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === "en" ? "bg-[#15803D] text-white shadow-xs" : "text-[#475569] hover:bg-gray-100"
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.home}
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.about}
            </Link>
            <Link
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#15803D] bg-[#DCFCE7]/60 flex items-center justify-between"
            >
              <span>{t.register}</span>
              <span className="text-[10px] font-black bg-[#15803D] text-white px-2 py-0.5 rounded-full">
                ID அட்டை
              </span>
            </Link>
            <Link
              href="#matrimony"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.matrimony}
            </Link>
            <Link
              href="#marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.marketplace}
            </Link>
            <Link
              href="#jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.jobs}
            </Link>
            <Link
              href="#news"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.news}
            </Link>
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.gallery}
            </Link>
            <Link
              href="#verify"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.verifyId}
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
            >
              {t.contact}
            </Link>

            <div className="pt-3">
              <Link
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#15803D] text-white px-5 py-3 rounded-xl font-bold text-center text-sm shadow-md"
              >
                <UserCheck className="w-4 h-4 text-[#FACC15]" />
                <span>{t.ctaRegister}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

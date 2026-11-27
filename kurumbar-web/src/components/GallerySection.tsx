"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Image as ImageIcon, Sparkles } from "lucide-react";

interface GalleryProps {
  lang: "ta" | "en";
}

const GALLERY_PHOTOS = [
  {
    url: "/images/realistic/community_meeting.jpg",
    caption: "பாரம்பரிய சமுதாய மாநாடு & மூத்தோர் கௌரவிப்பு",
    category: "மாநாடு (Conference)",
  },
  {
    url: "/images/realistic/temple_gopuram.jpg",
    caption: "ஸ்ரீ பீரேஸ்வரர் சுவாமி கோவில் திருவிழா & கும்பாபிஷேகம்",
    category: "திருவிழா (Temple Festival)",
  },
  {
    url: "/images/realistic/sheep_kurumba.jpg",
    caption: "பாரம்பரிய குறும்பர் ஆடு வளர்ப்பு & மேய்ச்சல் வாழ்வியல்",
    category: "பாரம்பரியம் (Heritage)",
  },
  {
    url: "/images/realistic/handloom_weaver.jpg",
    caption: "கைத்தறி கம்பளி நெசவு மற்றும் கலைக் கண்காட்சி",
    category: "கைத்தறி (Handloom)",
  },
  {
    url: "/images/realistic/student_education.jpg",
    caption: "சமுதாய மாணவர்களுக்கான வருடாந்திர கல்வி விருது வழங்கும் விழா",
    category: "கல்வி (Education)",
  },
  {
    url: "/images/realistic/temple_heritage.jpg",
    caption: "குறும்பர் வரலாற்றுச் சுவடுகள் & பண்பாட்டுத் திருத்தலங்கள்",
    category: "வரலாறு (Heritage)",
  },
];

export default function GallerySection({ lang }: GalleryProps) {
  const isTa = lang === "ta";
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#FAFAF5] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 border border-[#15803D]/20">
            <Camera className="w-4 h-4 text-[#15803D]" />
            <span>{isTa ? "சமுதாய புகைப்படத் தொகுப்பு" : "Community Photo Gallery"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14532D] tracking-tight">
            {isTa ? "நமது கலாச்சாரம் மற்றும் விழா நினைவுகள்" : "Cultural Events & Heritage Moments"}
          </h2>
          <p className="text-base text-[#475569] mt-3">
            {isTa
              ? "குறும்பர் சமுதாய திருவிழாக்கள், கைத்தறி கலைகள், மாநாடுகள் மற்றும் மாணவர் கௌரவிப்பு நிகழ்வுகளின் புகைப்படத் தொகுப்பு."
              : "Moments celebrating Kurumbar temple traditions, weaving crafts, youth conventions, and welfare gatherings."}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(photo.url)}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-[#E2E8F0] transition-all cursor-pointer group"
            >
              <div className="relative h-64 w-full overflow-hidden bg-[#FAFAF5]">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#14532D]/90 text-[#FACC15] text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {photo.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <p className="text-white text-xs font-bold leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-white border-t border-[#E2E8F0]">
                <p className="text-xs font-bold text-[#14532D] line-clamp-1">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20">
              <Image
                src={selectedImage}
                alt="Enlarged photo"
                width={1200}
                height={800}
                className="w-full h-auto object-contain max-h-[85vh]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#1E293B] font-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

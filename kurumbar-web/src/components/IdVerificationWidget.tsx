"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import jsQR from "jsQR";
import {
  ShieldCheck,
  CheckCircle2,
  Search,
  AlertTriangle,
  QrCode,
  Camera,
  Upload,
  X,
  RotateCcw,
} from "lucide-react";

interface IdVerificationProps {
  lang: "ta" | "en";
}

interface MemberVerificationResult {
  id?: string;
  membershipId: string;
  nameTa: string;
  nameEn: string;
  fatherName?: string;
  district?: string;
  constituency?: string;
  kulam?: string;
  status: string;
  createdAt?: string;
  photoUrl?: string;
  isSpecimen?: boolean;
}

export default function IdVerificationWidget({ lang }: IdVerificationProps) {
  const isTa = lang === "ta";

  // State
  const [searchId, setSearchId] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [memberResult, setMemberResult] = useState<MemberVerificationResult | null>(null);

  // Scanner State
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [scannerError, setScannerError] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Scanner Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Execute verification query against live API
  const executeVerify = useCallback(
    async (idToQuery: string) => {
      const clean = idToQuery.trim().toUpperCase();
      if (!clean) {
        setSearchError(
          isTa
            ? "உறுப்பினர் அடையாள எண்ணை உள்ளிடவும் (எ.கா: TN01M0000001)"
            : "Please enter a Member ID number (e.g. TN01M0000001)"
        );
        setSearched(false);
        setMemberResult(null);
        return;
      }

      if (clean.length < 5) {
        setSearchError(
          isTa
            ? "சரியான அடையாள அட்டை எண்ணை உள்ளிடவும் (குறைந்தது 5 எழுத்துக்கள்)"
            : "Please enter a valid Member ID (at least 5 characters)"
        );
        setSearched(false);
        setMemberResult(null);
        return;
      }

      setIsLoading(true);
      setSearchError("");
      setSearched(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";
        const res = await fetch(`${apiUrl}/members/verify/${encodeURIComponent(clean)}`);

        if (res.ok) {
          const data = await res.json();
          setMemberResult({
            id: data.id,
            membershipId: data.membershipId,
            nameTa: data.nameTa,
            nameEn: data.nameEn,
            fatherName: data.fatherName,
            district: data.district,
            constituency: data.constituency,
            kulam: data.kulam,
            status: data.status || "ACTIVE",
            createdAt: data.createdAt,
            photoUrl: data.photoUrl || "/images/member_avatar.png",
            isSpecimen: false,
          });
          setSearchError("");
        } else if (res.status === 404) {
          // Specimen fallback for demo cards
          if (clean === "TN01M0000001" || clean === "TN04M0001042") {
            setMemberResult({
              membershipId: clean,
              nameTa: "ஆர். கார்த்திகேயன்",
              nameEn: "Karthikeyan R",
              fatherName: "கே. ரங்கசாமி (K. Rangasamy)",
              district: "சேலம் (Salem West)",
              kulam: "அத்தி குலம் (Athi Kulam)",
              status: "ACTIVE",
              createdAt: "2026-11-24T00:00:00.000Z",
              photoUrl: "/images/member_avatar.png",
              isSpecimen: true,
            });
            setSearchError("");
          } else {
            setMemberResult(null);
            setSearchError(
              isTa
                ? `உறுப்பினர் எண் "${clean}" சமுதாய பதிவேட்டில் காணப்படவில்லை. தயவுசெய்து எண்ணை சரிபார்க்கவும்.`
                : `Member ID "${clean}" was not found in the community registry.`
            );
          }
        } else {
          throw new Error(`Server returned status ${res.status}`);
        }
      } catch (err) {
        console.warn("Verify API connection fallback:", err);
        if (clean === "TN01M0000001" || clean === "TN04M0001042") {
          setMemberResult({
            membershipId: clean,
            nameTa: "ஆர். கார்த்திகேயன்",
            nameEn: "Karthikeyan R",
            fatherName: "கே. ரங்கசாமி (K. Rangasamy)",
            district: "சேலம் (Salem West)",
            kulam: "அத்தி குலம் (Athi Kulam)",
            status: "ACTIVE",
            createdAt: "2026-11-24T00:00:00.000Z",
            photoUrl: "/images/member_avatar.png",
            isSpecimen: true,
          });
          setSearchError("");
        } else {
          setMemberResult(null);
          setSearchError(
            isTa
              ? "சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை. தயவுசெய்து இணைய இணைப்பை சரிபார்க்கவும்."
              : "Could not connect to the verification server. Please check your network connection."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isTa]
  );

  // Handle scanned QR code content
  const handleScannedText = useCallback(
    (rawText: string) => {
      stopCamera();
      setShowScanner(false);
      setScannerError("");

      let extractedId = rawText.trim();
      // Handle URL format: http://.../verify?id=TN01M0000001 or .../verify/TN01M0000001
      try {
        if (extractedId.startsWith("http://") || extractedId.startsWith("https://")) {
          const url = new URL(extractedId);
          const idParam = url.searchParams.get("id") || url.searchParams.get("membershipId");
          if (idParam) {
            extractedId = idParam;
          } else {
            const parts = url.pathname.split("/").filter(Boolean);
            const lastPart = parts[parts.length - 1];
            if (lastPart && (lastPart.startsWith("TN") || lastPart.startsWith("KB"))) {
              extractedId = lastPart;
            }
          }
        } else if (extractedId.startsWith("{") && extractedId.endsWith("}")) {
          const parsed = JSON.parse(extractedId);
          if (parsed.membershipId || parsed.id) {
            extractedId = parsed.membershipId || parsed.id;
          }
        }
      } catch {
        // Use raw string
      }

      const clean = extractedId.trim().toUpperCase();
      setSearchId(clean);
      executeVerify(clean);
    },
    [executeVerify, stopCamera]
  );

  // Camera video frame tick loop using ref to satisfy React hook declaration order
  const tickRef = useRef<() => void>(() => {});
  useEffect(() => {
    tickRef.current = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code && code.data) {
            handleScannedText(code.data);
            return;
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(() => tickRef.current());
    };
  }, [handleScannedText]);

  // Start Camera for live QR scanning
  const startCamera = async () => {
    setScannerError("");
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      setIsScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        animationFrameRef.current = requestAnimationFrame(() => tickRef.current());
      }
    } catch (err: unknown) {
      console.warn("Camera start failed:", err);
      setScannerError(
        isTa
          ? "கேமராவை இயக்க முடியவில்லை. கேமரா அனுமதியை சரிபார்க்கவும் அல்லது புகைப்படத்தை பதிவேற்றி ஸ்கேன் செய்யவும்."
          : "Could not access camera. Please check camera permissions or upload a QR image/card photo below."
      );
    }
  };

  // Handle uploaded QR image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleScannedText(code.data);
          } else {
            setScannerError(
              isTa
                ? "தேர்ந்தெடுக்கப்பட்ட படத்தில் QR குறியீடு கண்டறியப்படவில்லை. தெளிவான புகைப்படத்தை பதிவேற்றவும்."
                : "No QR code found in the selected image. Please upload a clear photo of the card."
            );
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerify(searchId);
  };

  return (
    <section id="verify" className="py-16 lg:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 border border-[#15803D]/20">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span>{isTa ? "பொது சரிபார்ப்பு தளம் • Public Verification" : "Public QR Verification"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14532D] tracking-tight">
            {isTa ? "குறும்பர் அடையாள அட்டை உண்மைத்தன்மை சரிபார்ப்பு" : "Verify Digital Member ID Card"}
          </h2>
          <p className="text-base text-[#475569] mt-3">
            {isTa
              ? "அடையாள அட்டையில் உள்ள உறுப்பினர் எண் (Member ID) அல்லது QR குறியீட்டை கேமரா மூலம் ஸ்கேன் செய்து உடனடியாக சரிபார்க்கலாம்."
              : "Enter the Member ID or scan the QR code printed on the physical or digital card to verify membership authenticity."}
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="max-w-xl mx-auto bg-[#FAFAF5] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-lg">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#1E293B] uppercase">
                  {isTa ? "உறுப்பினர் அடையாள எண் (Member ID)" : "Member ID Number"} *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowScanner(true);
                    startCamera();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#15803D] hover:text-[#14532D] bg-[#DCFCE7] px-2.5 py-1 rounded-lg border border-[#15803D]/20 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isTa ? "QR ஸ்கேனர்" : "QR Scanner"}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                  placeholder={isTa ? "எ.கா: TN01M0000001" : "e.g. TN01M0000001"}
                  className="w-full pl-4 pr-24 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-hidden font-mono font-bold text-base tracking-widest text-[#14532D] uppercase bg-white"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScanner(true);
                      startCamera();
                    }}
                    title={isTa ? "கேமரா மூலம் QR ஸ்கேன் செய்" : "Scan QR with Camera"}
                    className="bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#14532D] p-2 rounded-lg transition-all cursor-pointer"
                    aria-label="Scan QR Code"
                  >
                    <QrCode className="w-5 h-5 text-[#15803D]" />
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#15803D] hover:bg-[#14532D] text-white p-2 rounded-lg transition-all cursor-pointer"
                    aria-label="Verify"
                  >
                    <Search className="w-5 h-5 text-[#FACC15]" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#475569] mt-1.5">
                <span>
                  {isTa ? "மாதிரி ஐடி:" : "Specimen ID:"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchId("TN01M0000001");
                      executeVerify("TN01M0000001");
                    }}
                    className="font-mono font-bold text-[#15803D] hover:underline cursor-pointer"
                  >
                    TN01M0000001
                  </button>
                </span>
                <span className="text-[#64748B]">
                  {isTa ? "நேரடி சர்வர் சரிபார்ப்பு" : "Live Database Sync"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowScanner(true);
                  startCamera();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-[#14532D] font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-[#14532D]" />
                <span>{isTa ? "QR ஸ்கேனர் திறக்க (Scan QR)" : "Open QR Scanner"}</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#15803D] hover:bg-[#14532D] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#FACC15]" />
                    <span>{isTa ? "சரிபார்க்கிறது..." : "Verifying..."}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-[#FACC15]" />
                    <span>{isTa ? "சரிபார்க்க (Verify)" : "Verify Status"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {searchError && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-800">
                  {isTa ? "சரிபார்ப்பு தோல்வி (Verification Failed)" : "Verification Notice"}
                </h4>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  {searchError}
                </p>
              </div>
            </div>
          )}

          {/* Verification Result Card */}
          {searched && memberResult && (
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] animate-in fade-in zoom-in-95">
              <div className="bg-white rounded-2xl p-5 border-2 border-[#15803D] shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#15803D] block">
                        உறுதிசெய்யப்பட்டது • VERIFIED MEMBER
                      </span>
                      <span className="text-[10px] text-[#475569]">
                        தமிழ்நாடு குறும்பர் சமுதாய அதிகாரப்பூர்வ பதிவேடு
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#15803D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {memberResult.status}
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 rounded-xl overflow-hidden relative shrink-0 border-2 border-[#15803D]/40 bg-[#FAFAF5]">
                    <Image
                      src={memberResult.photoUrl || "/images/member_avatar.png"}
                      alt={memberResult.nameTa}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-sm text-[#14532D]">
                      {memberResult.nameTa} {memberResult.nameEn ? `(${memberResult.nameEn})` : ""}
                    </h4>
                    {memberResult.fatherName && (
                      <p className="text-[#475569]">
                        {isTa ? "தந்தை / கணவர்:" : "Father / Spouse:"}{" "}
                        <strong className="text-[#1E293B]">{memberResult.fatherName}</strong>
                      </p>
                    )}
                    {memberResult.district && (
                      <p className="text-[#475569]">
                        {isTa ? "மாவட்டம்:" : "District:"}{" "}
                        <strong className="text-[#1E293B]">
                          {memberResult.district}
                          {memberResult.constituency ? ` (${memberResult.constituency})` : ""}
                        </strong>
                      </p>
                    )}
                    {memberResult.kulam && (
                      <p className="text-[#475569]">
                        {isTa ? "குலம்:" : "Kulam:"}{" "}
                        <strong className="text-[#14532D]">{memberResult.kulam}</strong>
                      </p>
                    )}
                    <p className="font-mono text-xs font-bold text-[#15803D]">
                      {isTa ? "உறுப்பினர் ஐடி:" : "ID:"} {memberResult.membershipId}
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAFAF5] p-3 rounded-xl border border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px] text-[#475569]">
                  <div>
                    <span>{isTa ? "பதிவு செய்யப்பட்ட தேதி:" : "Registered Date:"}</span>
                    <strong className="block text-[#1E293B]">
                      {memberResult.createdAt
                        ? new Date(memberResult.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "24-Nov-2026"}
                    </strong>
                  </div>
                  <div>
                    <span>{isTa ? "செல்லுபடியாகும் தன்மை:" : "Validity:"}</span>
                    <strong className="block text-[#15803D]">
                      {isTa ? "ஆயுள் முழுவதும் (Lifetime)" : "Lifetime Active"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR CAMERA SCANNER MODAL */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#15803D] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#14532D] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#FACC15]" />
                <h3 className="font-bold text-sm">
                  {isTa ? "உறுப்பினர் அட்டை QR ஸ்கேனர்" : "Member ID Card QR Scanner"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setShowScanner(false);
                }}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewfinder Viewport */}
            <div className="p-4 bg-gray-950 text-center relative">
              <div className="relative w-full h-64 mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-[#15803D]">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* HUD Scanning Reticle */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-[#22C55E]/70 rounded-2xl relative shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      {/* Corner Target Markers */}
                      <span className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-[#FACC15]" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-[#FACC15]" />
                      <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-[#FACC15]" />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-[#FACC15]" />

                      {/* Animated Laser Scan Bar */}
                      <div className="w-full h-0.5 bg-[#22C55E] shadow-[0_0_8px_#22C55E] absolute top-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-gray-300 mt-2 font-medium">
                {isTa
                  ? "அடையாள அட்டையின் QR குறியீட்டை கேமராவின் முன் காட்டவும்"
                  : "Point camera at the Member ID QR Code"}
              </p>

              {/* Scanner error */}
              {scannerError && (
                <div className="mt-3 p-3 bg-red-900/40 border border-red-500 rounded-xl text-left">
                  <p className="text-[11px] text-red-200">{scannerError}</p>
                </div>
              )}
            </div>

            {/* Modal Footer with Image Upload Fallback */}
            <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#14532D] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#15803D]/20 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#15803D]" />
                <span>
                  {isTa
                    ? "📁 புகைப்படத்திலிருந்து QR ஸ்கேன் செய் (Upload QR Photo)"
                    : "📁 Scan QR from Photo / Screenshot"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setShowScanner(false);
                }}
                className="w-full text-xs font-semibold text-[#64748B] hover:text-[#1E293B] py-1.5 transition-all cursor-pointer"
              >
                {isTa ? "மூடுக (Cancel)" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

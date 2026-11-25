"use client";

import { useState } from "react";
import Image from "next/image";
import {
  TN_DISTRICTS_DATA,
  KULAM_OPTIONS,
  BLOOD_GROUPS,
} from "@/data/mockData";
import {
  UserCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Download,
  Printer,
  RotateCw,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
} from "lucide-react";

interface MemberRegistrationProps {
  lang: "ta" | "en";
}

export default function MemberRegistration({ lang }: MemberRegistrationProps) {
  const isTa = lang === "ta";

  // Form State
  const [step, setStep] = useState<number>(1);
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [otpVerified, setOtpVerified] = useState<boolean>(true);
  const [otpInput, setOtpInput] = useState<string>("8942");
  const [declarationAgreed, setDeclarationAgreed] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Data
  const [formData, setFormData] = useState({
    nameEn: "S. Bhuvanesan",
    nameTa: "சு. புவனேசன்",
    mobile: "9443212345",
    gender: "MALE" as "MALE" | "FEMALE",
    dob: "1998-08-14",
    bloodGroup: "O+",
    fatherName: "K. Rangasamy (ரங்கசாமி)",
    maritalStatus: "Unmarried",
    childrenMale: "0",
    childrenFemale: "0",
    district: "Salem (சேலம்)",
    constituency: "சேலம் மேற்கு (Salem West)",
    address: "142/3, பாரதி நகர், மேட்டூர் ரோடு, சேலம் - 636004",
    pincode: "636004",
    kulam: "அத்தி குலம் (Athi Kulam)",
    kuladeivam: "ஸ்ரீ பீரேஸ்வரர் சுவாமி திருக்கோவில், மேச்சேரி",
    education: "B.E. Computer Science & Engineering",
    professionSector: "PRIVATE",
    jobTitle: "Senior Software Engineer",
    houseType: "OWN",
    landAvailable: "YES",
    landDetails: "3.5 ஏக்கர் விவசாய நிலம் (சொந்த கிணறு & பாசனம்)",
    photoUrl: "/images/member_avatar.png",
  });

  // Card flip state in preview
  const [showCardBack, setShowCardBack] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Clear specific field error on change
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step-level form validation
  const validateStep = (currentStep: number): boolean => {
    const nextErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.nameEn.trim() || formData.nameEn.trim().length < 2) {
        nextErrors.nameEn = isTa
          ? "ஆங்கிலத்தில் சரியான பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்)"
          : "Please enter a valid English name (min 2 characters)";
      }
      if (!formData.nameTa.trim() || formData.nameTa.trim().length < 2) {
        nextErrors.nameTa = isTa
          ? "தமிழில் சரியான பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்)"
          : "Please enter a valid Tamil name (min 2 characters)";
      }
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(formData.mobile.trim())) {
        nextErrors.mobile = isTa
          ? "சரியான 10 இலக்க இந்திய கைபேசி எண்ணை உள்ளிடவும் (6, 7, 8, 9 இல் துவங்க வேண்டும்)"
          : "Please enter a valid 10-digit Indian mobile number";
      } else if (!otpVerified) {
        nextErrors.otp = isTa
          ? "தயவுசெய்து OTP சரிபார்க்கவும்"
          : "Please verify mobile number with OTP";
      }
      if (!formData.dob) {
        nextErrors.dob = isTa
          ? "பிறந்த தேதியை உள்ளிடவும்"
          : "Please select Date of Birth";
      } else {
        const birthYear = new Date(formData.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        if (currentYear - birthYear < 18) {
          nextErrors.dob = isTa
            ? "உறுப்பினர் வயது குறைந்தது 18 அல்லது அதற்கு மேல் இருக்க வேண்டும்"
            : "Member age must be 18 years or older";
        }
      }
    } else if (currentStep === 2) {
      if (!formData.fatherName.trim() || formData.fatherName.trim().length < 2) {
        nextErrors.fatherName = isTa
          ? "தந்தை / கணவர் பெயரை உள்ளிடவும்"
          : "Please enter Father's / Husband's name";
      }
      if (!formData.address.trim() || formData.address.trim().length < 8) {
        nextErrors.address = isTa
          ? "முழு வீட்டு முகவரியை உள்ளிடவும் (குறைந்தது 8 எழுத்துக்கள்)"
          : "Please enter full residential address (min 8 characters)";
      }
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(formData.pincode.trim())) {
        nextErrors.pincode = isTa
          ? "சரியான 6 இலக்க அஞ்சல் குறியீட்டு எண்ணை (PIN code) உள்ளிடவும்"
          : "Please enter a valid 6-digit postal PIN code";
      }
    } else if (currentStep === 3) {
      if (!formData.kuladeivam.trim() || formData.kuladeivam.trim().length < 2) {
        nextErrors.kuladeivam = isTa
          ? "குலதெய்வம் திருக்கோவில் பெயரை உள்ளிடவும்"
          : "Please enter Kuladeivam temple name";
      }
      if (!formData.education.trim()) {
        nextErrors.education = isTa
          ? "கல்வித் தகுதியை உள்ளிடவும்"
          : "Please enter highest education";
      }
      if (!formData.jobTitle.trim()) {
        nextErrors.jobTitle = isTa
          ? "பதவி அல்லது தொழிலை உள்ளிடவும்"
          : "Please enter job title or designation";
      }
    } else if (currentStep === 4) {
      if (!declarationAgreed) {
        nextErrors.declaration = isTa
          ? "தொடர சமுதாய உறுதிமொழியை ஏற்க வேண்டும்"
          : "You must agree to the community bylaws to proceed";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Calculate Member ID format: TN + District Code + M/W + 7 Digits (e.g. TN01M0000001)
  const getMemberId = () => {
    const districtIdx = Object.keys(TN_DISTRICTS_DATA).indexOf(formData.district);
    const districtCode = String(districtIdx >= 0 ? districtIdx + 1 : 1).padStart(2, "0");
    const genderCode = formData.gender === "MALE" ? "M" : "W";
    return `TN${districtCode}${genderCode}0000001`;
  };

  // Handle District Change to sync Constituencies
  const handleDistrictChange = (dist: string) => {
    const constituencies = TN_DISTRICTS_DATA[dist] || [];
    setFormData({
      ...formData,
      district: dist,
      constituency: constituencies[0] || "",
    });
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsGenerated(true);
      setStep(5);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <section id="register" className="py-16 lg:py-24 bg-[#FAFAF5] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 border border-[#15803D]/20">
            <UserCheck className="w-4 h-4 text-[#15803D]" />
            <span>{isTa ? "சமுதாய உறுப்பினர் சேர்க்கை & டிஜிட்டல் அட்டை" : "Official Member Registration & Digital ID"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14532D] tracking-tight">
            {isTa ? "குறும்பர் சமுதாய உறுப்பினர் பதிவு படிவம்" : "Kurumbar Community Registration Portal"}
          </h2>
          <p className="text-base text-[#475569] mt-3">
            {isTa
              ? "உங்கள் சுயவிவரங்களை பூர்த்தி செய்து உடனடியாக அதிகாரப்பூர்வ QR டிஜிட்டல் அடையாள அட்டையை பெற்றுக் கொள்ளுங்கள். (முற்றிலும் இலவசம்)"
              : "Register your family and receive an authenticated, verifiable Digital QR Member ID card instantly. (Free community initiative)"}
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2E8F0] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#15803D] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, labelTa: "தனிநபர் விவரம்", labelEn: "Personal" },
              { num: 2, labelTa: "குடும்பம் & முகவரி", labelEn: "Address" },
              { num: 3, labelTa: "சமூகம் & தொழில்", labelEn: "Career" },
              { num: 4, labelTa: "புகைப்படம்", labelEn: "Photo" },
              { num: 5, labelTa: "டிஜிட்டல் அட்டை", labelEn: "ID Card" },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${
                    step >= s.num
                      ? "bg-[#15803D] text-white ring-4 ring-[#DCFCE7]"
                      : "bg-white text-[#475569] border-2 border-[#E2E8F0]"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-[11px] font-bold mt-2 text-[#1E293B] hidden sm:block">
                  {isTa ? s.labelTa : s.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form & ID Card Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E2E8F0]">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#14532D]">
                  {isTa ? "படி 1: தனிப்பட்ட விவரங்கள் மற்றும் கைபேசி சரிபார்ப்பு" : "Step 1: Personal Details & Mobile Verification"}
                </h3>
                <p className="text-xs text-[#475569] mt-1">
                  {isTa ? "உங்கள் சரியான விவரங்களை உள்ளிடவும். அடையாள அட்டையில் இது அச்சிடப்படும்." : "Provide accurate details for the digital identity card."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    பெயர் (ஆங்கிலத்தில் - Name in English) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => updateField("nameEn", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.nameEn ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="e.g. S. Bhuvanesan"
                  />
                  {errors.nameEn && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.nameEn}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    பெயர் (தமிழில் - Name in Tamil) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameTa}
                    onChange={(e) => updateField("nameTa", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.nameTa ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="எ.கா. சு. புவனேசன்"
                  />
                  {errors.nameTa && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.nameTa}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    கைபேசி எண் (Mobile Number) *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#475569]">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => updateField("mobile", e.target.value)}
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                          errors.mobile ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                        }`}
                        placeholder="9443212345"
                      />
                    </div>
                    {!otpVerified ? (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          setOtpVerified(true);
                        }}
                        className="bg-[#15803D] hover:bg-[#14532D] text-white text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-xs"
                      >
                        {otpSent ? "சரிபார்க்கப்பட்டது ✓" : "OTP சரிபார்க்க"}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-3 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> சரிபார்க்கப்பட்டது
                      </span>
                    )}
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.mobile}
                    </p>
                  )}
                  {errors.otp && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.otp}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    பாலினம் (Gender - Exactly 2 Genders) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "MALE" })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.gender === "MALE"
                          ? "border-[#15803D] bg-[#DCFCE7]/60 text-[#14532D]"
                          : "border-[#E2E8F0] text-[#475569]"
                      }`}
                    >
                      <span>👨 ஆண் (MALE)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.gender === "FEMALE"
                          ? "border-[#15803D] bg-[#DCFCE7]/60 text-[#14532D]"
                          : "border-[#E2E8F0] text-[#475569]"
                      }`}
                    >
                      <span>👩 பெண் (FEMALE)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    பிறந்த தேதி (Date of Birth) *
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.dob ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                  />
                  {errors.dob && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.dob}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    இரத்த வகை (Blood Group) *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm bg-white"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg} Positive / Negative
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Family & Residence */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#14532D]">
                  {isTa ? "படி 2: குடும்ப விவரங்கள் மற்றும் இருப்பிடம்" : "Step 2: Family & Residential Details"}
                </h3>
                <p className="text-xs text-[#475569] mt-1">
                  {isTa ? "அடையாள அட்டையின் பின்புறத்தில் அச்சிடப்படும் முகவரி விவரங்கள்." : "Address information for the back side of the member ID card."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    தந்தை / கணவர் பெயர் (Father's / Husband's Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => updateField("fatherName", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.fatherName ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="e.g. K. Rangasamy"
                  />
                  {errors.fatherName && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.fatherName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    திருமண நிலை (Marital Status) *
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm bg-white"
                  >
                    <option value="Unmarried">திருமணமாகாதவர் (Unmarried)</option>
                    <option value="Married">திருமணமானவர் (Married)</option>
                    <option value="Widowed">கைம்பெண் / விதவை (Widowed)</option>
                    <option value="Divorced">விவாகரத்து பெற்றவர் (Divorced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    சொந்த மாவட்டம் (Native District) *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm bg-white"
                  >
                    {Object.keys(TN_DISTRICTS_DATA).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    சட்டமன்ற தொகுதி (Constituency - Auto Filtered) *
                  </label>
                  <select
                    value={formData.constituency}
                    onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm bg-white"
                  >
                    {(TN_DISTRICTS_DATA[formData.district] || []).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    அஞ்சல் குறியீட்டு எண் (PIN Code - 6 Digits) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.pincode ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="636004"
                  />
                  {errors.pincode && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.pincode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    வீட்டு வகை & நில விவரம் (House & Land)
                  </label>
                  <input
                    type="text"
                    value={formData.landDetails}
                    onChange={(e) => setFormData({ ...formData, landDetails: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm"
                    placeholder="3.5 ஏக்கர் விவசாய நிலம் (சொந்த கிணறு & பாசனம்)"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    முழு வீட்டு முகவரி (Full Residential Address) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.address ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="கதவு எண், தெரு பெயர், கிராமம்/நகரம், அஞ்சல் குறியீட்டு எண்"
                  />
                  {errors.address && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Community Heritage & Career */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#14532D]">
                  {isTa ? "படி 3: சமுதாய பாரம்பரியம், குலம் மற்றும் தொழில் விவரங்கள்" : "Step 3: Heritage, Kulam & Profession"}
                </h3>
                <p className="text-xs text-[#475569] mt-1">
                  {isTa ? "சமூக கணக்கெடுப்பு மற்றும் வரன் தேடல் இணைப்புகளுக்கான விவரங்கள்." : "Community census and matrimonial verification data."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    குலம் (Kulam / Sub-Caste) *
                  </label>
                  <select
                    value={formData.kulam}
                    onChange={(e) => setFormData({ ...formData, kulam: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm bg-white"
                  >
                    {KULAM_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    குலதெய்வம் திருக்கோவில் (Kuladeivam Temple) *
                  </label>
                  <input
                    type="text"
                    value={formData.kuladeivam}
                    onChange={(e) => updateField("kuladeivam", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.kuladeivam ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="எ.கா. ஸ்ரீ பீரேஸ்வரர் கோவில், ஊர் பெயர்"
                  />
                  {errors.kuladeivam && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.kuladeivam}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    கல்வித் தகுதி (Highest Education) *
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => updateField("education", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.education ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="e.g. B.E, B.Sc, Diploma, 12th Std"
                  />
                  {errors.education && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.education}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    பணித் துறை (Employment Sector) *
                  </label>
                  <select
                    value={formData.professionSector}
                    onChange={(e) => setFormData({ ...formData, professionSector: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm bg-white"
                  >
                    <option value="PRIVATE">தனியார் நிறுவனம் (Private Sector)</option>
                    <option value="GOVERNMENT">அரசுப் பணி (Government / PSU)</option>
                    <option value="BUSINESS">சுயதொழில் / வணிகம் (Business / Self-Employed)</option>
                    <option value="AGRICULTURE">வேளாண்மை / கால்நடை (Agriculture / Livestock)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    பதவி / தொழில் (Job Title / Designation) *
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-hidden font-medium text-sm ${
                      errors.jobTitle ? "border-red-500 bg-red-50/30" : "border-[#E2E8F0] focus:border-[#15803D]"
                    }`}
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {errors.jobTitle && (
                    <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.jobTitle}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                    வீட்டு வகை & நிலம் (House & Land Details)
                  </label>
                  <input
                    type="text"
                    value={formData.landDetails}
                    onChange={(e) => setFormData({ ...formData, landDetails: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#15803D] outline-hidden font-medium text-sm"
                    placeholder="சொந்த வீடு, நிலம் விவரங்கள்"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Photo & Verification Consent */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="text-xl font-bold text-[#14532D]">
                  {isTa ? "படி 4: அடையாள அட்டை புகைப்படம் மற்றும் ஒப்புதல்" : "Step 4: ID Card Photo & Verification Consent"}
                </h3>
                <p className="text-xs text-[#475569] mt-1">
                  {isTa ? "பாஸ்போர்ட் அளவு தெளிவான புகைப்படத்தை பதிவேற்றவும்." : "Upload a clear passport-style photo for your official member ID card."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                <div className="sm:col-span-5 text-center">
                  <div className="w-36 h-44 mx-auto rounded-2xl overflow-hidden border-4 border-[#15803D] shadow-lg relative bg-[#FAFAF5]">
                    <Image
                      src={formData.photoUrl}
                      alt="Uploaded Preview"
                      width={144}
                      height={176}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#14532D] mt-2">
                    {isTa ? "அடையாள அட்டை மாதிரி புகைப்படம்" : "Card Photo Specimen"}
                  </p>
                </div>

                <div className="sm:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl border-2 border-dashed border-[#15803D]/40 bg-[#DCFCE7]/20 text-center">
                    <Upload className="w-8 h-8 text-[#15803D] mx-auto mb-2" />
                    <span className="text-sm font-bold text-[#14532D] block">
                      புகைப்படத்தை மாற்ற (Upload / Change Photo)
                    </span>
                    <span className="text-xs text-[#475569] block mt-0.5">
                      JPG, PNG, WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, photoUrl: URL.createObjectURL(file) });
                        }
                      }}
                      className="mt-3 text-xs text-[#475569] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#15803D] file:text-white hover:file:bg-[#14532D]"
                    />
                  </div>

                  <div className={`p-4 rounded-xl border ${errors.declaration ? "bg-red-50 border-red-400" : "bg-[#FEF9C3] border-[#FACC15]"}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declarationAgreed}
                        onChange={(e) => {
                          setDeclarationAgreed(e.target.checked);
                          if (errors.declaration) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.declaration;
                              return next;
                            });
                          }
                        }}
                        className="mt-1 h-4 w-4 rounded-sm border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                      />
                      <span className="text-xs text-[#1E293B] leading-relaxed">
                        <strong>சமுதாய உறுதிமொழி:</strong> நான் வழங்கியுள்ள அனைத்து தகவல்களும் முற்றிலும் உண்மையானவை என உறுதி கூறுகிறேன். தமிழ்நாடு குறும்பர் சமுதாய விதிகளுக்கு உட்பட்டு நடக்க ஒப்புக்கொள்கிறேன்.
                      </span>
                    </label>
                    {errors.declaration && (
                      <p className="text-[11px] font-bold text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.declaration}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Live Interactive Digital ID Card Generation */}
          {step === 5 && (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#14532D] text-xs font-black px-3.5 py-1.5 rounded-full mb-2">
                  <Sparkles className="w-4 h-4 text-[#15803D]" />
                  <span>{isTa ? "உறுப்பினர் பதிவு வெற்றிகரமாக முடிந்தது!" : "Member ID Card Successfully Generated!"}</span>
                </div>
                <h3 className="text-2xl font-black text-[#14532D]">
                  {isTa ? "உங்கள் அதிகாரப்பூர்வ குறும்பர் டிஜிட்டல் உறுப்பினர் அட்டை" : "Your Official Kurumbar Digital Member ID Card"}
                </h3>
                <p className="text-xs text-[#475569] mt-1">
                  {isTa ? "அட்டையின் முன் மற்றும் பின் பக்கங்களை பார்வையிட கீழே உள்ள சுழற்று பொத்தானை அழுத்தவும்." : "Click below to flip and inspect the front and back sides of the card."}
                </p>
              </div>

              {/* ID Card Display Component with Flip */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {/* Front Side */}
                  {!showCardBack ? (
                    <div className="bg-gradient-to-br from-[#14532D] via-[#15803D] to-[#14532D] text-white rounded-3xl p-6 shadow-2xl border-4 border-[#FACC15] relative overflow-hidden transition-all">
                      {/* Watermark Monogram */}
                      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                        <span className="text-9xl font-black">K</span>
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center">
                            <Image
                              src="/brand/logo-concept-1-icon.png"
                              alt="Kurumbar Logo"
                              width={36}
                              height={36}
                            />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs tracking-wider text-white">
                              KURUMBAR COMMUNITY PLATFORM
                            </h4>
                            <p className="text-[10px] text-[#FACC15] font-bold">
                              குறும்பர் சமுதாய டிஜிட்டல் அடையாள அட்டை
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#FACC15] text-[#14532D] text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                          VERIFIED
                        </div>
                      </div>

                      {/* Content */}
                      <div className="grid grid-cols-12 gap-3.5 items-center">
                        <div className="col-span-4 text-center">
                          <div className="w-24 h-28 mx-auto rounded-xl overflow-hidden border-2 border-[#FACC15] shadow-inner bg-white">
                            <Image
                              src={formData.photoUrl}
                              alt="Member Photo"
                              width={96}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="inline-block mt-1 text-[9px] font-black bg-[#FACC15] text-[#14532D] px-2 py-0.5 rounded-full">
                            {formData.gender === "MALE" ? "MALE • ஆண்" : "FEMALE • பெண்"}
                          </span>
                        </div>

                        <div className="col-span-8 space-y-1 text-xs">
                          <div>
                            <span className="text-white/60 text-[10px] block">பெயர் (Name)</span>
                            <span className="font-bold text-white text-sm">{formData.nameTa}</span>
                            <span className="text-white/80 text-[11px] block">{formData.nameEn}</span>
                          </div>
                          <div>
                            <span className="text-white/60 text-[10px] block">தந்தை / கணவர் பெயர் (Father's Name)</span>
                            <span className="font-semibold text-white/95">{formData.fatherName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-white/60 text-[10px] block">பிறந்த தேதி (DOB)</span>
                              <span className="font-semibold text-white">{formData.dob}</span>
                            </div>
                            <div>
                              <span className="text-white/60 text-[10px] block">இரத்த வகை (Blood)</span>
                              <span className="font-bold text-[#FACC15]">{formData.bloodGroup}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-white/60 text-[10px] block">மாவட்டம் (District)</span>
                            <span className="font-semibold text-white">{formData.district}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between bg-black/25 -mx-6 -mb-6 p-4 rounded-b-2xl">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#FACC15] font-black block">
                            MEMBER ID NO
                          </span>
                          <span className="text-base font-mono font-black text-white tracking-widest">
                            {getMemberId()}
                          </span>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-1 rounded-md shadow-xs">
                          <div className="w-10 h-10 bg-black p-0.5 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="w-2 h-2 bg-white" />
                              <div className="w-2 h-2 bg-white" />
                            </div>
                            <div className="flex justify-center">
                              <div className="w-1.5 h-1.5 bg-[#FACC15]" />
                            </div>
                            <div className="flex justify-between">
                              <div className="w-2 h-2 bg-white" />
                              <div className="w-1 h-1 bg-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Back Side */
                    <div className="bg-gradient-to-br from-[#166534] via-[#14532D] to-[#0f3d20] text-white rounded-3xl p-6 shadow-2xl border-4 border-[#FACC15] relative overflow-hidden transition-all">
                      <div className="border-b border-white/20 pb-2 mb-3 flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[#FACC15] tracking-wider">
                          RESIDENTIAL & COMMUNITY DATA
                        </span>
                        <span className="text-[10px] text-white/70">பின்பக்கம் (BACK SIDE)</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-white/60 text-[10px] block font-semibold">இருப்பிட முகவரி (Address):</span>
                          <p className="text-white font-medium leading-relaxed">{formData.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-white/60 text-[10px] block">சட்டமன்ற தொகுதி:</span>
                            <span className="font-semibold text-white/90">{formData.constituency}</span>
                          </div>
                          <div>
                            <span className="text-white/60 text-[10px] block">அஞ்சல் எண்:</span>
                            <span className="font-semibold text-[#FACC15]">{formData.pincode}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                          <div>
                            <span className="text-white/60 text-[10px] block">குலம் (Kulam):</span>
                            <span className="font-semibold text-white">{formData.kulam}</span>
                          </div>
                          <div>
                            <span className="text-white/60 text-[10px] block">பணி / தொழில்:</span>
                            <span className="font-semibold text-white">{formData.jobTitle}</span>
                          </div>
                        </div>
                        <div className="pt-1">
                          <span className="text-white/60 text-[10px] block">குலதெய்வம் (Kuladeivam):</span>
                          <span className="font-semibold text-white/90">{formData.kuladeivam}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/20 bg-black/25 -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between text-[10px] text-white/80">
                        <div>
                          <span>வழங்கிய தேதி: 24-Nov-2026</span>
                          <span className="block text-[#FACC15] font-bold">செல்லுபடியாகும் காலம்: ஆயுள் முழுதும்</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold block text-white">மாநில செயலாளர்</span>
                          <span className="text-[9px] text-[#FACC15]">தமிழ்நாடு குறும்பர் சங்கம்</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flip button */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCardBack(!showCardBack)}
                      className="inline-flex items-center gap-2 bg-white text-[#14532D] text-xs font-bold px-4 py-2 rounded-xl border border-[#E2E8F0] shadow-xs hover:bg-[#FAFAF5]"
                    >
                      <RotateCw className="w-4 h-4 text-[#15803D]" />
                      <span>{showCardBack ? "முன்பக்கத்தை பார்க்க (Show Front)" : "பின்பக்கத்தை பார்க்க (Show Back)"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons for ID Card */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#15803D] hover:bg-[#14532D] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all"
                >
                  <Download className="w-4 h-4 text-[#FACC15]" />
                  <span>அட்டையை பதிவிறக்குக (Download / Print ID)</span>
                </button>
                <a
                  href="#verify"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#14532D] border-2 border-[#15803D] text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#DCFCE7]/40 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                  <span>பொது சரிபார்ப்பு காண்க (Verify QR Online)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setIsGenerated(false);
                  }}
                  className="w-full sm:w-auto text-xs text-[#475569] font-semibold hover:text-[#14532D] underline"
                >
                  புதிய உறுப்பினர் பதிவு செய்க
                </button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (for steps 1-4) */}
          {step < 5 && (
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E293B] hover:bg-[#FAFAF5]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>முந்தைய படி (Back)</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-[#14532D] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>{step === 4 ? "டிஜிட்டல் அட்டை உருவாக்குக (Generate ID Card)" : "அடுத்த படி (Continue)"}</span>
                <ArrowRight className="w-4 h-4 text-[#FACC15]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

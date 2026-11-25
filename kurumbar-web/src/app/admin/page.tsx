"use client";
import React, { useState } from 'react'
import {
  ShieldCheck,
  Users,
  Heart,
  Store,
  Bell,
  LogOut,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  UserCheck,
  AlertTriangle,
  Award,
  Lock,
} from 'lucide-react'

// Demo Admin Credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@kurumbar.org',
  password: 'Kurumbar@Admin2026',
  pin: '198426',
  name: 'முனைவர். மா. பெரியசாமி (Dr. M. Periyasamy)',
  role: 'மாநில முதன்மை நிர்வாகி (State Super Administrator)',
}

interface MemberApplication {
  id: string
  nameTa: string
  nameEn: string
  gender: 'M' | 'F'
  phone: string
  district: string
  kulam: string
  aadhaarMasked: string
  appliedDate: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  avatar: string
}

const INITIAL_APPLICATIONS: MemberApplication[] = [
  {
    id: 'TN04M0001042',
    nameTa: 'சு. புவனேசன்',
    nameEn: 'S. Bhuvanesan',
    gender: 'M',
    phone: '+91 94432 12345',
    district: 'ஈரோடு (Erode)',
    kulam: 'அத்தி குலம் (Athi Kulam)',
    aadhaarMasked: 'XXXX-XXXX-8942',
    appliedDate: '25 நவம்பர் 2026',
    status: 'PENDING',
    avatar: '/images/member_avatar.png',
  },
  {
    id: 'TN01M0000843',
    nameTa: 'மா. பெரியசாமி',
    nameEn: 'M. Periyasamy',
    gender: 'M',
    phone: '+91 98421 54321',
    district: 'சேலம் (Salem)',
    kulam: 'செல்ல குலம் (Chella Kulam)',
    aadhaarMasked: 'XXXX-XXXX-4512',
    appliedDate: '24 நவம்பர் 2026',
    status: 'PENDING',
    avatar: '/images/member_avatar.png',
  },
  {
    id: 'TN06W0000512',
    nameTa: 'கா. வள்ளியம்மாள்',
    nameEn: 'K. Valliammal',
    gender: 'F',
    phone: '+91 97890 12345',
    district: 'கிருஷ்ணகிரி (Krishnagiri)',
    kulam: 'முல்லை குலம் (Mullai Kulam)',
    aadhaarMasked: 'XXXX-XXXX-7821',
    appliedDate: '23 நவம்பர் 2026',
    status: 'APPROVED',
    avatar: '/images/member_avatar.png',
  },
  {
    id: 'TN05M0000921',
    nameTa: 'செ. சக்திவேல்',
    nameEn: 'S. Sakthivel',
    gender: 'M',
    phone: '+91 94421 98765',
    district: 'தருமபுரி (Dharmapuri)',
    kulam: 'கண்ணங்குலம் (Kannankulam)',
    aadhaarMasked: 'XXXX-XXXX-3190',
    appliedDate: '22 நவம்பர் 2026',
    status: 'PENDING',
    avatar: '/images/member_avatar.png',
  },
  {
    id: 'TN02W0000780',
    nameTa: 'ரா. மீனாட்சி',
    nameEn: 'R. Meenakshi',
    gender: 'F',
    phone: '+91 98940 56789',
    district: 'கோயம்புத்தூர் (Coimbatore)',
    kulam: 'சேரகுலம் (Cherakulam)',
    aadhaarMasked: 'XXXX-XXXX-6543',
    appliedDate: '21 நவம்பர் 2026',
    status: 'APPROVED',
    avatar: '/images/member_avatar.png',
  },
]

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; email: string } | null>(null)

  // Login Form State
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [pin, setPin] = useState<string>('')
  const [loginError, setLoginError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'members' | 'matrimony' | 'marketplace' | 'broadcast'>('members')
  const [applications, setApplications] = useState<MemberApplication[]>(INITIAL_APPLICATIONS)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [districtFilter, setDistrictFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [selectedApp, setSelectedApp] = useState<MemberApplication | null>(null)

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string>('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  // Auto-fill demo credentials
  const handleFillDemo = () => {
    setEmail(ADMIN_CREDENTIALS.email)
    setPassword(ADMIN_CREDENTIALS.password)
    setPin(ADMIN_CREDENTIALS.pin)
    setLoginError('')
  }

  // Handle Login Validation & Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    const trimmedEmail = email.trim()
    const trimmedPass = password.trim()
    const trimmedPin = pin.trim()

    // Email validation
    if (!trimmedEmail) {
      setLoginError('மின்னஞ்சல் முகவரியை உள்ளிடவும் (Please enter admin email)')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setLoginError('சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும் (Please enter a valid email address)')
      return
    }

    // Password validation
    if (!trimmedPass) {
      setLoginError('கடவுச்சொல்லை உள்ளிடவும் (Please enter your password)')
      return
    }
    if (trimmedPass.length < 8) {
      setLoginError('கடவுச்சொல் குறைந்தபட்சம் 8 எழுத்துக்கள் இருக்க வேண்டும் (Password must be at least 8 characters)')
      return
    }

    // 2FA PIN validation
    if (!trimmedPin) {
      setLoginError('பாதுகாப்பு குறியீட்டை உள்ளிடவும் (Please enter 6-digit Security PIN)')
      return
    }
    if (trimmedPin.length !== 6 || !/^\d{6}$/.test(trimmedPin)) {
      setLoginError('பாதுகாப்பு குறியீடு 6 இலக்க எண்களாக இருக்க வேண்டும் (Security PIN must be exactly 6 digits)')
      return
    }

    setIsSubmitting(true)

    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false)
      if (
        trimmedEmail.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
        trimmedPass === ADMIN_CREDENTIALS.password &&
        trimmedPin === ADMIN_CREDENTIALS.pin
      ) {
        setIsAuthenticated(true)
        setAdminUser({
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
          email: ADMIN_CREDENTIALS.email,
        })
        showToast('நிர்வாக பலகையில் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்!')
      } else {
        setLoginError('தவறான மின்னஞ்சல், கடவுச்சொல் அல்லது பாதுகாப்பு குறியீடு! (Invalid credentials. Please use demo credentials.)')
      }
    }, 500)
  }

  // Handle Application Approval/Rejection
  const handleUpdateStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    )
    showToast(
      newStatus === 'APPROVED'
        ? `உறுப்பினர் ${id} விண்ணப்பம் அங்கீகரிக்கப்பட்டது! டிஜிட்டல் அட்டை வெளியிடப்பட்டது.`
        : `விண்ணப்பம் ${id} மறுபரிசீலனைக்கு அனுப்பப்பட்டது.`
    )
    if (selectedApp?.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.nameTa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery)
    const matchesDistrict = districtFilter === 'ALL' || app.district.includes(districtFilter)
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesDistrict && matchesStatus
  })

  // ==========================================
  // RENDER: LOGIN PAGE
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F6F0] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#86EFAC]/40 animate-bounce">
            <CheckCircle className="w-5 h-5 text-[#FACC15]" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#15803D]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FACC15]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl p-8 relative z-10">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-[#14532D] p-3 border-4 border-[#FACC15] shadow-lg flex items-center justify-center">
              <img
                src="/brand/logo.png"
                alt="Kurumbar Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to icon if logo not loaded
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
              <Award className="w-10 h-10 text-[#FACC15] hidden" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#DCFCE7] text-[#14532D] border border-[#15803D]/20">
              <Lock className="w-3.5 h-3.5 text-[#15803D]" />
              அதிகாரப்பூர்வ நிர்வாக தளம்
            </span>
            <h1 className="text-2xl font-black text-[#14532D] mt-3">
              குறும்பர் சமுதாய நல வாரியம்
            </h1>
            <p className="text-xs text-[#64748B] font-medium mt-1">
              State Administrative Moderation & Digital ID Governance Console
            </p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FEF9C3] border border-[#FACC15] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#854D0E] uppercase flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#CA8A04]" />
                நிர்வாக உள்நுழைவு விவரங்கள் (Admin Credentials)
              </span>
            </div>
            <div className="space-y-1 font-mono text-xs text-[#713F12]">
              <p>
                <span className="font-sans font-bold text-[#854D0E]">மின்னஞ்சல்:</span>{' '}
                <strong className="text-[#14532D] font-mono select-all">admin@kurumbar.org</strong>
              </p>
              <p>
                <span className="font-sans font-bold text-[#854D0E]">கடவுச்சொல்:</span>{' '}
                <strong className="text-[#14532D] font-mono select-all">Kurumbar@Admin2026</strong>
              </p>
              <p>
                <span className="font-sans font-bold text-[#854D0E]">பாதுகாப்பு PIN:</span>{' '}
                <strong className="text-[#14532D] font-mono select-all">198426</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-3 w-full py-2 bg-[#15803D] hover:bg-[#14532D] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>விவரங்களை தானாக நிரப்புக (Auto-Fill Demo)</span>
            </button>
          </div>

          {/* Login Error Alert */}
          {loginError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                நிர்வாக மின்னஞ்சல் (Admin Email) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kurumbar.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-hidden font-medium text-sm text-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                கடவுச்சொல் (Password) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-hidden font-medium text-sm text-[#1E293B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#1E293B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] uppercase mb-1.5">
                2FA பாதுகாப்பு PIN (6 Digits) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#94A3B8]">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="198426"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-hidden font-mono font-bold text-sm tracking-widest text-[#14532D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-[#15803D] hover:bg-[#14532D] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>சரிபார்க்கப்படுகிறது... (Authenticating...)</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#FACC15]" />
                  <span>நிர்வாக பலகையில் நுழைக (Sign In as Administrator)</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
            <a
              href="https://kurumbar-web.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#15803D] hover:underline"
            >
              ← பொதுமக்கள் தளத்திற்கு செல்க (Back to Public Portal)
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER: AUTHENTICATED DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#14532D] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#86EFAC]/40">
          <CheckCircle className="w-5 h-5 text-[#FACC15]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#14532D] p-1.5 border-2 border-[#FACC15] shadow-sm flex items-center justify-center">
                <img src="/brand/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm font-black text-[#14532D] block">
                  குறும்பர் சமுதாய நல வாரியம்
                </span>
                <span className="text-[10px] font-bold text-[#64748B] block uppercase tracking-wider">
                  State Administration Console • v2.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-[#DCFCE7] text-[#14532D] px-3 py-1.5 rounded-full text-xs font-bold border border-[#15803D]/20">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                <span>{adminUser?.role}</span>
              </div>

              <div className="text-right hidden md:block">
                <span className="text-xs font-bold text-[#1E293B] block">{adminUser?.name}</span>
                <span className="text-[10px] text-[#64748B] block font-mono">{adminUser?.email}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false)
                  setAdminUser(null)
                  showToast('வெற்றிகரமாக வெளியேறியுள்ளீர்கள் (Signed out)')
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">வெளியேறு (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase">மொத்த உறுப்பினர்கள்</span>
              <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#14532D] mt-2">24,582</p>
            <span className="text-[11px] font-bold text-[#15803D] mt-1 block">
              +184 இந்த வாரம் (Active)
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase">சரிபார்ப்பு நிலுவை</span>
              <div className="w-8 h-8 rounded-xl bg-[#FEF9C3] text-[#854D0E] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#854D0E] mt-2">
              {applications.filter((a) => a.status === 'PENDING').length}
            </p>
            <span className="text-[11px] font-bold text-[#CA8A04] mt-1 block">
              விரைவான ஒப்புதல் தேவை
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase">வரன் பதிவுகள்</span>
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-pink-900 mt-2">1,240</p>
            <span className="text-[11px] font-bold text-pink-700 mt-1 block">
              38 புதிய வரன்கள்
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase">சந்தை பொருட்கள்</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-900 mt-2">86</p>
            <span className="text-[11px] font-bold text-amber-700 mt-1 block">
              கம்பளி & செம்மறி ஆடுகள்
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-2">
          {[
            { id: 'members', label: 'உறுப்பினர் சரிபார்ப்பு வரிசை (KYC Queue)', icon: UserCheck, count: applications.filter(a => a.status === 'PENDING').length },
            { id: 'matrimony', label: 'வரன் அமைப்பாளர் (Matrimony Moderation)', icon: Heart, count: 4 },
            { id: 'marketplace', label: 'சந்தை & கைவினை (Marketplace)', icon: Store, count: 2 },
            { id: 'broadcast', label: 'அறிவிப்பு பலகை (Welfare Announcements)', icon: Bell, count: 3 },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#14532D] text-white shadow-sm'
                    : 'bg-white text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FACC15]' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      active ? 'bg-[#FACC15] text-[#14532D]' : 'bg-[#E2E8F0] text-[#1E293B]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: MEMBERS KYC QUEUE */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="பெயர், உறுப்பினர் எண், தொலைபேசி கொண்டு தேடுக..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-medium focus:border-[#15803D] outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#1E293B] bg-white outline-hidden"
                >
                  <option value="ALL">அனைத்து மாவட்டங்கள் (All Districts)</option>
                  <option value="சேலம்">சேலம் (Salem)</option>
                  <option value="ஈரோடு">ஈரோடு (Erode)</option>
                  <option value="தருமபுரி">தருமபுரி (Dharmapuri)</option>
                  <option value="கிருஷ்ணகிரி">கிருஷ்ணகிரி (Krishnagiri)</option>
                  <option value="கோயம்புத்தூர்">கோயம்புத்தூர் (Coimbatore)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#1E293B] bg-white outline-hidden"
                >
                  <option value="ALL">அனைத்து நிலைகள் (All Status)</option>
                  <option value="PENDING">நிலுவையில் (Pending)</option>
                  <option value="APPROVED">அங்கீகரிக்கப்பட்டது (Approved)</option>
                  <option value="REJECTED">மறுக்கப்பட்டது (Rejected)</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">உறுப்பினர் விவரம் (Member)</th>
                      <th className="px-6 py-4">அடையாள எண் & ஆதார் (ID / Aadhaar)</th>
                      <th className="px-6 py-4">மாவட்டம் & குலம் (District / Kulam)</th>
                      <th className="px-6 py-4">விண்ணப்பித்த தேதி (Date)</th>
                      <th className="px-6 py-4">நிலை (Status)</th>
                      <th className="px-6 py-4 text-center">நடவடிக்கை (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-[#64748B]">
                          பொருத்தமான விண்ணப்பங்கள் ஏதுமில்லை (No matching applications found)
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E2E8F0] border-2 border-[#15803D]/40 shrink-0">
                                <img
                                  src={app.avatar}
                                  alt={app.nameEn}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                                  }}
                                />
                              </div>
                              <div>
                                <span className="font-extrabold text-[#14532D] text-sm block">
                                  {app.nameTa}
                                </span>
                                <span className="text-[11px] text-[#64748B] block">
                                  {app.nameEn} • {app.phone}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-[#14532D] block">
                              {app.id}
                            </span>
                            <span className="font-mono text-[11px] text-[#64748B] block">
                              Aadhaar: {app.aadhaarMasked}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-bold text-[#1E293B] block">{app.district}</span>
                            <span className="text-[11px] text-[#64748B] block">{app.kulam}</span>
                          </td>

                          <td className="px-6 py-4 text-[#64748B]">{app.appliedDate}</td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                app.status === 'APPROVED'
                                  ? 'bg-[#DCFCE7] text-[#14532D] border border-[#15803D]/20'
                                  : app.status === 'PENDING'
                                  ? 'bg-[#FEF9C3] text-[#854D0E] border border-[#CA8A04]/20'
                                  : 'bg-red-100 text-red-700 border border-red-200'
                              }`}
                            >
                              {app.status === 'APPROVED'
                                ? '✓ அங்கீகரிக்கப்பட்டது'
                                : app.status === 'PENDING'
                                ? '⏳ சரிபார்ப்பில்'
                                : '✕ நிராகரிக்கப்பட்டது'}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {app.status === 'PENDING' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                    className="p-1.5 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white"
                                    title="அங்கீகரி (Approve & Issue ID)"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                    title="மறுபரிசீலனை கோரு (Request Resubmit)"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedApp(app)}
                                className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-[#1E293B] hover:bg-[#F1F5F9] font-bold text-[11px]"
                              >
                                காண்க
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATRIMONY MODERATION */}
        {activeTab === 'matrimony' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h3 className="text-lg font-black text-[#14532D]">
                குறும்பர் சமுதாய வரன் சரிபார்ப்பு பலகை (Matrimony Moderation)
              </h3>
              <p className="text-xs text-[#64748B]">
                பதிவு செய்யப்பட்ட வரன்களின் சாதி சான்றிதழ் மற்றும் குடும்ப குல விவரங்களை சரிபார்த்து வெளியிடுக.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Dr. கார்த்திகேயன் (MBBS, MD)', gender: 'GROOM (மணமகன்)', age: '28 வயது', district: 'சேலம்', kulam: 'அத்தி குலம்', verified: true },
                { name: 'பிரியதர்ஷினி (B.E. Computer Science)', gender: 'BRIDE (மணமகள்)', age: '25 வயது', district: 'ஈரோடு', kulam: 'முல்லை குலம்', verified: true },
                { name: 'தினேஷ் குமார் (B.Tech Agri, MBA)', gender: 'GROOM (மணமகன்)', age: '29 வயது', district: 'திருப்பூர்', kulam: 'கண்ணங்குலம்', verified: false },
                { name: 'சௌமியா (M.Sc Maths, B.Ed)', gender: 'BRIDE (மணமகள்)', age: '24 வயது', district: 'தருமபுரி', kulam: 'செங்குலம்', verified: true },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF5] flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#14532D] text-sm block">{m.name}</span>
                    <span className="text-xs text-[#64748B] block mt-0.5">{m.gender} • {m.age}</span>
                    <span className="text-[11px] text-[#1E293B] block mt-1">
                      {m.district} • {m.kulam}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`வரன் ${m.name} சரிபார்க்கப்பட்டு அங்கீகரிக்கப்பட்டது.`)}
                    className="px-3 py-1.5 bg-[#15803D] hover:bg-[#14532D] text-white rounded-lg text-xs font-bold"
                  >
                    சரிபார் ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MARKETPLACE MODERATION */}
        {activeTab === 'marketplace' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h3 className="text-lg font-black text-[#14532D]">
                சந்தை & கைவினைப் பொருட்கள் அனுமதி (Artisans & Livestock Review)
              </h3>
              <p className="text-xs text-[#64748B]">
                பாரம்பரிய குறும்பர் கம்பளி தயாரிப்பாளர்கள் மற்றும் கால்நடை வளர்ப்போரின் விற்பனைப் பட்டியல்.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'பாரம்பரிய தூய கம்பளிப் போர்வை (Pure Wool Kambli)', seller: 'மா. பெரியசாமி', district: 'சேலம்', price: '₹ 3,200', category: 'கைத்தறி' },
                { title: 'செம்மறி ஆட்டுக்குட்டிகள் (Salem Native Sheep Flock)', seller: 'ஆர். பழனிசாமி', district: 'சேலம்', price: '₹ 8,500', category: 'கால்நடை' },
                { title: 'இயற்கை மலைத்தேன் (Forest Organic Honey - 1kg)', seller: 'செ. சக்திவேல்', district: 'தருமபுரி', price: '₹ 650', category: 'இயற்கை உணவு' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF5] flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#14532D] text-sm block">{item.title}</span>
                    <span className="text-xs text-[#64748B] block mt-0.5">விற்பனையாளர்: {item.seller} ({item.district})</span>
                    <span className="text-xs font-bold text-[#B45309] block mt-1">{item.price} • {item.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`பொருள் "${item.title}" தளத்தில் வெளியிட அனுமதிக்கப்பட்டது.`)}
                    className="px-3 py-1.5 bg-[#15803D] hover:bg-[#14532D] text-white rounded-lg text-xs font-bold"
                  >
                    அனுமதி ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BROADCASTS & WELFARE */}
        {activeTab === 'broadcast' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="border-b border-[#E2E8F0] pb-4">
              <h3 className="text-lg font-black text-[#14532D]">
                அரசு நலத்திட்டங்கள் & சமுதாய அறிவிப்புகள் (Official Broadcasts)
              </h3>
              <p className="text-xs text-[#64748B]">
                செயலிகள் மற்றும் இணையதளத்தில் உடனடியாக காண்பிக்க புதிய அறிவிப்புகளை இடுக.
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF5]">
                <h4 className="font-bold text-sm text-[#14532D]">
                  📢 2026 தமிழ்நாடு குறும்பர் சமுதாய மாநில மாநாடு அறிவிப்பு
                </h4>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  நவம்பர் 22, 2026 அன்று சேலத்தில் நடைபெறவுள்ள மாநில மாநாட்டில் அனைத்து மாவட்ட சமுதாய உறுப்பினர்களும் தவறாது கலந்து கொள்ளுமாறு கேட்டுக்கொள்ளப்படுகிறார்கள்.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF5]">
                <h4 className="font-bold text-sm text-[#14532D]">
                  🎓 குறும்பர் மாணவ/மாணவியருக்கான உயர்கல்வி கல்வி உதவித்தொகை விண்ணப்பங்கள்
                </h4>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  பொறியியல், மருத்துவம் மற்றும் அரசுப் போட்டித் தேர்வுகளுக்கு தயாராகும் குறும்பர் சமுதாய மாணவர்களுக்கு கல்வி உதவித்தொகை அறிவிப்பு வெளியிடப்பட்டுள்ளது.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Member Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-black text-base text-[#14532D]">
                விண்ணப்ப விவரம் • {selectedApp.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-[#64748B] hover:text-[#0F172A] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 bg-[#FAFAF5] p-4 rounded-2xl border border-[#E2E8F0]">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#15803D] shrink-0">
                <img src={selectedApp.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-base font-black text-[#14532D] block">{selectedApp.nameTa}</span>
                <span className="text-xs text-[#64748B] block">{selectedApp.nameEn}</span>
                <span className="text-xs font-bold text-[#1E293B] block mt-1">{selectedApp.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">மாவட்டம்:</span>
                <strong className="text-[#1E293B]">{selectedApp.district}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">குலம்:</span>
                <strong className="text-[#1E293B]">{selectedApp.kulam}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">ஆதார் குறியீடு:</span>
                <strong className="text-[#1E293B] font-mono">{selectedApp.aadhaarMasked}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] block">தற்போதைய நிலை:</span>
                <strong
                  className={
                    selectedApp.status === 'APPROVED'
                      ? 'text-[#15803D]'
                      : selectedApp.status === 'PENDING'
                      ? 'text-[#CA8A04]'
                      : 'text-red-600'
                  }
                >
                  {selectedApp.status}
                </strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {selectedApp.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')}
                    className="flex-1 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white rounded-xl text-xs font-bold"
                  >
                    அங்கீகரி (Approve)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                  >
                    மறுக்க (Reject)
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 border border-[#CBD5E1] rounded-xl text-xs font-bold"
              >
                மூடுக (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


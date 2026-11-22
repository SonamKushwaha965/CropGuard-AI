import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Search,
  Zap,
  Target,
  Leaf,
  Users,
  CloudUpload,
  ShieldCheck,
  Sprout,
  HelpCircle,
  Settings,
  CheckSquare,
  Layers,
  Smartphone,
  Mic,
  CloudSun,
  WifiOff,
  FlaskConical,
  Mail,
  Phone,
  MapPin,
  Volume2,
  VolumeX,
  Download,
  Camera,
  Globe,
  Wifi,
  Code2,
  Eye,
  ArrowDown,
  CheckCircle2,
  X,
  Shield,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Lock,
} from 'lucide-react';
import {
  LANGUAGES,
  LanguageCode,
  TRANSLATIONS,
} from './data/translations';
import {
  analyzeLeafOffline,
  ClientDiagnosisResult,
  generateHeroLeafArtDataUrl,
  generateSampleLeafDataUrl,
  SAMPLE_LEAF_PRESETS,
  SampleLeafKey,
} from './utils/offlineLeafAnalyzer';
import { BackendCodeModal } from './components/BackendCodeModal';
import { FarmerFeedbackSection } from './components/FarmerFeedbackSection';
import { PWAInstallButton } from './components/PWAInstallButton';
import { AuthModal } from './components/AuthModal';
import { AdminDatasetModal } from './components/AdminDatasetModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { UserProfile } from './types/auth';

const LOCAL_HISTORY_KEY = 'smart_crop_scan_history_v1';
const LOCAL_USER_KEY = 'smart_crop_current_user_v1';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const t = TRANSLATIONS[language];

  const [activeNav, setActiveNav] = useState<
    'home' | 'detect' | 'about' | 'future' | 'contact'
  >('home');

  // Offline connectivity & manual offline mode toggle
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [manualOfflineMode, setManualOfflineMode] = useState<boolean>(false);
  const isOffline = !browserOnline || manualOfflineMode;

  // Generated realistic visual assets
  const [heroArtUrl, setHeroArtUrl] = useState<string>('');
  const [sampleImages, setSampleImages] = useState<Record<SampleLeafKey, string>>({
    tomato_early_blight: '',
    potato_late_blight: '',
    rice_bacterial_blight: '',
    healthy_tomato: '',
  });

  // Current selected leaf image & preset (starts empty until user selects or uploads an image)
  const [selectedPreset, setSelectedPreset] = useState<SampleLeafKey | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [showLesionOverlay, setShowLesionOverlay] = useState<boolean>(false);
  const [selectionNotice, setSelectionNotice] = useState<string>('');

  // Current diagnosis result (only computed when user chooses or uploads an image)
  const [diagnosis, setDiagnosis] = useState<ClientDiagnosisResult | null>(null);

  // Scan History stored locally for offline availability
  const [scanHistory, setScanHistory] = useState<ClientDiagnosisResult[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Voice TTS state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Backend Code Modal state
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);

  // Camera Modal state
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLocation, setContactLocation] = useState('');
  const [contactCrop, setContactCrop] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // User Authentication & Admin Page View State
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    // When Admin logs in, open the new dedicated Admin Page immediately!
    if (user.role === 'admin') {
      setCurrentView('admin');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentView('main');
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch {
      // ignore
    }
  };

  // Register Service Worker & generate initial botanical canvas specimens
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            // Check for updates periodically
            registration.update().catch(() => {});
          })
          .catch((err) => {
            console.debug('ServiceWorker registration note:', err);
          });
      });
    }

    const heroUrl = generateHeroLeafArtDataUrl();
    setHeroArtUrl(heroUrl);

    const generatedSamples: Record<SampleLeafKey, string> = {
      tomato_early_blight: generateSampleLeafDataUrl('tomato_early_blight'),
      potato_late_blight: generateSampleLeafDataUrl('potato_late_blight'),
      rice_bacterial_blight: generateSampleLeafDataUrl('rice_bacterial_blight'),
      healthy_tomato: generateSampleLeafDataUrl('healthy_tomato'),
    };
    setSampleImages(generatedSamples);
    // User selects image only - start empty without auto-prefilling
  }, []);

  // Listen to online/offline events
  useEffect(() => {
    const onOnline = () => setBrowserOnline(true);
    const onOffline = () => setBrowserOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Update localized diagnosis when language changes if a sample preset is active and already analyzed
  useEffect(() => {
    if (selectedPreset && previewImageUrl && diagnosis) {
      analyzeLeafOffline(previewImageUrl, language, selectedPreset).then((res) => {
        setDiagnosis((prev) => {
          if (!prev) return null;
          return {
            ...res,
            mode: prev.mode,
          };
        });
      });
    }
  }, [language]);

  const scrollToSection = (
    sectionId: string,
    navKey: 'home' | 'detect' | 'about' | 'future' | 'contact'
  ) => {
    setActiveNav(navKey);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Farmer Registration Guard: Users must register/sign in before crop disease detection or leaf upload
  const requireUserRegistration = (): boolean => {
    if (!currentUser) {
      setAuthModalMode('signup');
      setIsAuthModalOpen(true);
      setSelectionNotice(
        'फसल रोग जांचने के लिए कृपया पहले पंजीकरण (Registration) करें। (Please register your farmer account first to test crops).'
      );
      return false;
    }
    return true;
  };

  const handleFileChange = (file: File | null | undefined) => {
    if (!requireUserRegistration()) return;
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedPreset(null);
        setPreviewImageUrl(reader.result);
        setSelectedFileName(file.name);
        setSelectionNotice('');
        // Clear previous diagnosis until user clicks Detect Disease on this selected leaf
        setDiagnosis(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (presetKey: SampleLeafKey, scrollIntoDetect = false) => {
    if (!requireUserRegistration()) return;
    setSelectedPreset(presetKey);
    const url = sampleImages[presetKey] || generateSampleLeafDataUrl(presetKey);
    setPreviewImageUrl(url);
    setSelectedFileName(`${presetKey}.jpg`);
    setSelectionNotice('');
    setDiagnosis(null);

    if (scrollIntoDetect) {
      scrollToSection('detect-disease', 'detect');
    }
  };

  const handleRunDetection = async () => {
    if (!requireUserRegistration()) return;
    if (!previewImageUrl) {
      setSelectionNotice(t.detect.pleaseSelectImage);
      const detectSection = document.getElementById('detect-disease');
      if (detectSection) {
        detectSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setSelectionNotice('');
    setIsDetecting(true);

    try {
      // First run client-side pixel metrics for lesion coordinates
      const localResult = await analyzeLeafOffline(previewImageUrl, language, selectedPreset);

      if (!isOffline) {
        const presetInfo = SAMPLE_LEAF_PRESETS.find((p) => p.key === selectedPreset);
        const response = await fetch('/api/detect-disease', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: previewImageUrl,
            mimeType: 'image/jpeg',
            language,
            cropHint: presetInfo ? presetInfo.cropHint : '',
          }),
        });

        if (response.ok) {
          const onlineData = await response.json();
          const merged: ClientDiagnosisResult = {
            ...onlineData,
            lesions: localResult.lesions,
            pixelMetrics: localResult.pixelMetrics,
            mode: 'online-ai',
          };
          setDiagnosis(merged);
          const updatedHistory = [merged, ...scanHistory.slice(0, 11)];
          setScanHistory(updatedHistory);
          try {
            localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updatedHistory));
          } catch {
            // ignore
          }
          setIsDetecting(false);
          const resultEl = document.getElementById('detection-result');
          if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // Fallback or explicit Offline Mode
      setDiagnosis(localResult);
      const updatedHistory = [localResult, ...scanHistory.slice(0, 11)];
      setScanHistory(updatedHistory);
      try {
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch {
        // ignore
      }
    } catch {
      const fallback = await analyzeLeafOffline(previewImageUrl, language, selectedPreset);
      setDiagnosis(fallback);
    } finally {
      setIsDetecting(false);
      const resultEl = document.getElementById('detection-result');
      if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Voice Assistance (Text-to-Speech)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window) || !diagnosis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const langConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
    const textToRead = `${diagnosis.cropName}. ${diagnosis.diseaseDetected}. ${diagnosis.confidence}% confidence. ${diagnosis.aboutDisease} ${diagnosis.suggestedAction}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = langConfig.speechLang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Save Offline Diagnostic Report
  const handleDownloadReport = () => {
    if (!diagnosis) return;
    const reportLines = [
      '====================================================',
      '   SMART CROP DISEASE DETECTION - FARMER REPORT     ',
      '====================================================',
      `Date & Time       : ${new Date(diagnosis.timestamp).toLocaleString()}`,
      `Analysis Mode     : ${diagnosis.mode === 'offline-edge' ? 'Offline Edge ML Model' : 'Online AI Vision Model'}`,
      `Crop Name         : ${diagnosis.cropName}`,
      `Disease Detected  : ${diagnosis.diseaseDetected} (${diagnosis.scientificName})`,
      `Confidence        : ${diagnosis.confidence}%`,
      `Health Status     : ${diagnosis.status}`,
      '',
      '--- ABOUT THE DISEASE ---',
      diagnosis.aboutDisease,
      '',
      '--- SUGGESTED ACTION ---',
      diagnosis.suggestedAction,
      '',
      '--- ORGANIC TREATMENT ---',
      diagnosis.organicTreatment,
      '',
      '--- CHEMICAL FUNGICIDE DOSAGE ---',
      diagnosis.chemicalTreatment,
      '',
      '--- FIELD HYGIENE & PREVENTION ---',
      ...diagnosis.preventiveMeasures.map((m, i) => `${i + 1}. ${m}`),
      '====================================================',
    ].join('\n');

    const blob = new Blob([reportLines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop_diagnosis_${diagnosis.cropName.toLowerCase()}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Camera capture handlers
  const openCamera = async () => {
    if (!requireUserRegistration()) return;
    setCameraError('');
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError(
        'Camera access is unavailable in this browser frame. Please use Choose Image or select a Sample Crop Leaf.'
      );
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedPreset(null);
      setPreviewImageUrl(dataUrl);
      setSelectedFileName(`camera_leaf_${Date.now()}.jpg`);
      setSelectionNotice('');
      setDiagnosis(null);
    }
    closeCamera();
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactMessage.trim()) return;

    try {
      if (!isOffline) {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contactName,
            phoneOrEmail: contactPhone,
            location: contactLocation,
            cropType: contactCrop,
            message: contactMessage,
          }),
        });
      }
    } catch {
      // Stored locally if offline
    }
    setContactSuccess(true);
    setContactName('');
    setContactPhone('');
    setContactMessage('');
  };

  // Dedicated Full-Page View for Administrator (All User Datasets & Surveillance)
  if (currentView === 'admin') {
    return (
      <AdminDashboardPage
        currentUser={currentUser}
        onBackToHome={() => setCurrentView('main')}
        onSignOut={() => {
          handleSignOut();
          setCurrentView('main');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] text-[#111827]">
      {/* =================================================================== */}
      {/* TOP NAVIGATION BAR (Strict 3-Zone Contract matching Reference UI)   */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 bg-white/95 backdrop-blur-xs px-4 sm:px-8 py-3.5 border-b border-slate-200/80 shadow-2xs">
        {/* Zone 1: Single Brand Wordmark - cropRS */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home', 'home');
          }}
          className="group flex items-center gap-2.5 whitespace-nowrap shrink-0 transition-transform active:scale-95"
          title="cropRS — AI Agricultural Diagnostics"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0a3818] via-[#15803d] to-[#22c55e] text-white shadow-md shadow-emerald-700/25 ring-1 ring-emerald-400/40 group-hover:shadow-emerald-600/35 transition-all">
            <Leaf className="h-5 w-5 text-white fill-emerald-200/50 transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-[#0a3818] transition-colors">
                crop<span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent font-black">RS</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-[#0f5123] border border-emerald-300/70 tracking-wider uppercase shadow-2xs">
                AI
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider hidden xs:block mt-0.5">
              Smart Crop Detection
            </span>
          </div>
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => scrollToSection('home', 'home')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'home'
                ? 'text-[#0f5123] border-b-2 border-[#15803d]'
                : 'hover:text-[#0f5123]'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('detect-disease', 'detect')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'detect'
                ? 'text-[#0f5123] border-b-2 border-[#15803d]'
                : 'hover:text-[#0f5123]'
            }`}
          >
            {t.nav.detect}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('about', 'about')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'about'
                ? 'text-[#0f5123] border-b-2 border-[#15803d]'
                : 'hover:text-[#0f5123]'
            }`}
          >
            {t.nav.about}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('future-scope', 'future')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeNav === 'future'
                ? 'text-[#0f5123] border-b-2 border-[#15803d]'
                : 'hover:text-[#0f5123]'
            }`}
          >
            {t.nav.futureScope}
          </button>
        </nav>

        {/* Zone 3: Admin Dataset & User Authentication (Only Sign In button) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Admin Dataset Portal Button */}
          <button
            type="button"
            onClick={() => {
              if (currentUser?.role === 'admin') {
                setCurrentView('admin');
              } else {
                setIsAdminModalOpen(true);
              }
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
              currentUser?.role === 'admin'
                ? 'bg-purple-700 text-white hover:bg-purple-800 ring-2 ring-purple-300'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
            }`}
            title="Admin Dataset View (सारे यूज़र का डेटासेट देखें - पासवर्ड संरक्षित)"
          >
            <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="hidden xs:inline">Admin Dataset</span>
            <span className="xs:hidden">Admin</span>
          </button>

          {/* User Profile or Single Sign In Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role} {currentUser.primaryCrop ? `· ${currentUser.primaryCrop}` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 hover:border-red-200 transition-colors whitespace-nowrap cursor-pointer"
                title="Sign Out / लॉग आउट"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0f5123]" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =================================================================== */}
      {/* ACCESSIBILITY & OFFLINE WORKSPACE BAR (Multilingual + Offline Mode) */}
      {/* =================================================================== */}
      <div className="bg-[#eef6ee] border-b border-emerald-900/10 px-4 sm:px-8 py-2">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
          {/* Language Switcher for Local Farmers */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5123] mr-1">
              <Globe className="h-3.5 w-3.5" />
              Farmer Language:
            </span>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  language === lang.code
                    ? 'bg-[#0f5123] text-white'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-emerald-50'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          {/* Right Controls: Offline Edge Mode Toggle + Backend Code Viewer */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setManualOfflineMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                isOffline
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-[#0f5123] border border-emerald-800/20 hover:bg-emerald-50'
              }`}
              title="Toggle between Online Gemini Vision AI and Offline Edge ML Engine"
            >
              {isOffline ? (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  {t.nav.offlineMode} (Edge ML Active)
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                  {t.nav.onlineMode} · Switch to Offline
                </>
              )}
            </button>

            <PWAInstallButton />

            <button
              type="button"
              onClick={() => setIsBackendModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5 text-[#0f5123]" />
              {t.nav.backendCode} (Flask / ML)
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. HOME PAGE: HERO SECTION & WHY CHOOSE OUR SYSTEM                  */}
      {/* =================================================================== */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#f8fbf8] via-[#eef6ee] to-[#dcefdc]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline, Description, CTAs, and 4-Stat Strip */}
            <div className="lg:col-span-7 space-y-5 z-10">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#e2f2e2] px-3.5 py-1.5 text-xs font-extrabold tracking-wide text-[#0f5123]">
                <Leaf className="h-3.5 w-3.5 text-[#15803d]" />
                {t.hero.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.12] tracking-tight text-balance">
                <span className="block text-[#111827]">{t.hero.titleLine1}</span>
                <span className="block text-[#0f5123] mt-1">{t.hero.titleLine2}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Two Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!requireUserRegistration()) return;
                    scrollToSection('detect-disease', 'detect');
                    setTimeout(() => fileInputRef.current?.click(), 350);
                  }}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#0f5123] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#14532d] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  {t.hero.uploadBtn}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!requireUserRegistration()) return;
                    scrollToSection('detect-disease', 'detect');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Search className="h-4 w-4 text-emerald-700" />
                  {t.hero.detectBtn}
                </button>
              </div>

              {/* 4-Metric White Stats Card (50+ Diseases, 20+ Crops, 95% Accuracy, 1000+ Farmers) */}
              <div className="mt-6 rounded-2xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 tabular-nums">
                  <div className="flex items-center gap-3 pr-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4e6] text-[#15803d]">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900">{t.hero.stat1Value}</div>
                      <div className="text-xs font-medium text-slate-600">{t.hero.stat1Label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:pl-4 pr-2 pt-3 sm:pt-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4e6] text-[#15803d]">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900">{t.hero.stat2Value}</div>
                      <div className="text-xs font-medium text-slate-600">{t.hero.stat2Label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:pl-4 pr-2 pt-3 sm:pt-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4e6] text-[#15803d]">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900">{t.hero.stat3Value}</div>
                      <div className="text-xs font-medium text-slate-600">{t.hero.stat3Label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:pl-4 pt-3 sm:pt-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4e6] text-[#15803d]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900">{t.hero.stat4Value}</div>
                      <div className="text-xs font-medium text-slate-600">{t.hero.stat4Label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hand Holding Crop Leaf with Glowing Detection Ring & 3 Floating Icons */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-[#e2f0df]">
                {heroArtUrl ? (
                  <img
                    src={heroArtUrl}
                    alt="Smart Crop Leaf AI Scanner"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="h-80 w-full bg-emerald-100 flex items-center justify-center">
                    <Leaf className="h-20 w-20 text-emerald-700" />
                  </div>
                )}

                {/* Floating Circular Agricultural Icon 1: Top-Left Sprout */}
                <div className="absolute top-10 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-[#15803d]">
                  <Sprout className="h-6 w-6" />
                </div>

                {/* Floating Circular Agricultural Icon 2: Middle-Right Magnifying Glass */}
                <div className="absolute top-20 right-7 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-[#15803d]">
                  <Search className="h-6 w-6" />
                </div>

                {/* Floating Circular Agricultural Icon 3: Bottom-Left Shield Check */}
                <div className="absolute bottom-14 left-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-[#15803d]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* WHY CHOOSE OUR SYSTEM? (4 Feature Cards matching Reference Design)  */}
        {/* =================================================================== */}
        <div className="bg-[#ebf5eb] py-12 px-4 sm:px-6 lg:px-8 border-t border-emerald-900/10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#111827] mb-8">
              {t.whyChoose.heading}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Fast Detection */}
              <div className="rounded-2xl bg-white p-6 text-center shadow-xs border border-slate-100 flex flex-col items-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                  <Zap className="h-7 w-7 fill-[#15803d]" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">
                  {t.whyChoose.card1Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.whyChoose.card1Desc}
                </p>
              </div>

              {/* Card 2: High Accuracy */}
              <div className="rounded-2xl bg-white p-6 text-center shadow-xs border border-slate-100 flex flex-col items-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">
                  {t.whyChoose.card2Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.whyChoose.card2Desc}
                </p>
              </div>

              {/* Card 3: Easy to Use */}
              <div className="rounded-2xl bg-white p-6 text-center shadow-xs border border-slate-100 flex flex-col items-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                  <Leaf className="h-7 w-7 fill-[#15803d]" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">
                  {t.whyChoose.card3Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.whyChoose.card3Desc}
                </p>
              </div>

              {/* Card 4: Farmer Friendly */}
              <div className="rounded-2xl bg-white p-6 text-center shadow-xs border border-slate-100 flex flex-col items-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">
                  {t.whyChoose.card4Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.whyChoose.card4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. DISEASE DETECTION PAGE (1. Upload Crop Image + 2. Image Preview) */}
      {/* =================================================================== */}
      <section id="detect-disease" className="bg-[#f4f7f4] py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2.5 mb-2">
              <Sprout className="h-7 w-7 text-[#16a34a]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.detect.heading}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              {t.detect.subtitle}
            </p>
          </div>

          {/* Farmer Registration / Login Required Gate Notice */}
          {!currentUser ? (
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0f5123] to-slate-900 p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <span>फसल जांच के लिए पहले पंजीकरण अनिवार्य है</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                      Registration Required
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                    फसल पत्ती की फोटो अपलोड करने और बीमारी की पहचान करने के लिए किसान का पंजीकरण अनिवार्य है। कृपया पहले अपना निःशुल्क खाता बनाएं या लॉग इन करें।
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#0f5123] hover:bg-emerald-50 text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#0f5123]" />
                  <span>साइन इन करें (Sign In / Register)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between gap-3 text-xs text-[#0f5123]">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  सत्यापित किसान (Logged In Farmer): <strong>{currentUser.name}</strong> ({currentUser.location || 'Local Farm'}) · फसल रोग जांच के लिए अधिकृत (Authorized)
                </span>
              </div>
              <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-emerald-100 text-[11px] font-bold uppercase">
                {currentUser.role}
              </span>
            </div>
          )}

          {/* Quick Sample Crop Leaves Bar for 1-Click Testing */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 mr-1">
                {t.detect.sampleLeavesLabel}
              </span>
              {SAMPLE_LEAF_PRESETS.map((sample) => (
                <button
                  key={sample.key}
                  type="button"
                  onClick={() => {
                    if (!requireUserRegistration()) return;
                    handleSelectSample(sample.key);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedPreset === sample.key
                      ? 'bg-[#0f5123] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-[#0f5123]'
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {isOffline && (
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <WifiOff className="h-3.5 w-3.5" />
                {t.detect.offlineBadgeNote}
              </span>
            )}
          </div>

          {/* 2-Column Upload & Image Preview Cards (Exact match to Page 2 of Screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Card: 1. Upload Crop Image */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">
                {t.detect.step1Title}
              </h3>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files?.[0];
                  handleFileChange(droppedFile);
                }}
                className={`flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-[#0f5123] bg-emerald-50/70'
                    : 'border-[#5ea36a] bg-[#f2f7f2]'
                }`}
              >
                <CloudUpload className="h-12 w-12 text-[#15803d] mb-3" />
                <p className="text-sm font-medium text-slate-700">{t.detect.dragDropText}</p>
                <p className="text-xs text-slate-500 my-1.5">{t.detect.orText}</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!requireUserRegistration()) return;
                      fileInputRef.current?.click();
                    }}
                    className="rounded-lg bg-[#0f5123] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#14532d] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    {t.detect.chooseImageBtn}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!requireUserRegistration()) return;
                      openCamera();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/25 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0f5123] hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    {t.detect.useCameraBtn}
                  </button>
                </div>

                <p className="text-xs text-slate-500">{t.detect.allowedFormats}</p>
              </div>
            </div>

            {/* Right Card: 2. Image Preview */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  {t.detect.step2Title}
                </h3>
                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                  {selectedFileName}
                </span>
              </div>

              <div className="relative flex-1 min-h-[240px] rounded-xl overflow-hidden bg-[#11240c] border border-slate-200 flex items-center justify-center">
                {previewImageUrl ? (
                  <img
                    src={previewImageUrl}
                    alt="Uploaded Crop Leaf Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full max-h-[280px] object-cover"
                  />
                ) : (
                  <div className="text-center text-emerald-100 p-6 flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/60 mb-2 border border-emerald-500/30">
                      <Leaf className="h-7 w-7 text-emerald-300 opacity-80" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">
                      No Crop Leaf Selected
                    </p>
                    <p className="text-xs text-emerald-200/80 max-w-xs">
                      {t.detect.noImageSelectedNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectionNotice && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{selectionNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!requireUserRegistration()) return;
                  fileInputRef.current?.click();
                }}
                className="rounded-lg bg-[#0f5123] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#14532d] transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.detect.chooseImageBtn}
              </button>
            </div>
          )}

          {/* Full-Width Detect Disease Action Bar / Registration Gate */}
          {!currentUser ? (
            <button
              type="button"
              onClick={requireUserRegistration}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-4 px-6 text-base font-extrabold text-white shadow-md transition-all cursor-pointer bg-gradient-to-r from-[#0f5123] to-[#15803d] hover:brightness-110"
            >
              <Lock className="h-5 w-5 text-amber-300" />
              <span>पंजीकरण करें और फसल रोग जांचें (Register to Detect Crop Disease)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRunDetection}
              disabled={isDetecting}
              className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-4 px-6 text-base font-extrabold text-white shadow-sm transition-colors cursor-pointer ${
                !previewImageUrl
                  ? 'bg-slate-400 hover:bg-slate-500'
                  : 'bg-[#0f5123] hover:bg-[#14532d]'
              } disabled:opacity-60`}
            >
              <Search className="h-5 w-5" />
              {isDetecting
                ? t.detect.detectingBtn
                : previewImageUrl
                  ? `${t.detect.detectActionBtn} (Selected Leaf)`
                  : t.detect.detectActionBtn}
            </button>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. RESULT PAGE: DETECTION RESULT + FARMER RETRAINING FEEDBACK       */}
      {/* =================================================================== */}
      <section id="detection-result" className="bg-[#f8faf8] py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-1.5">
              <Leaf className="h-6 w-6 text-[#16a34a] fill-[#4ade80]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.result.heading}
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {diagnosis ? t.result.subtitle : t.detect.pleaseSelectImage}
            </p>
          </div>

          {diagnosis ? (
            <>
              {/* Main Result Card matching "3. Result Page" of Reference Screenshot */}
              <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/90">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Leaf Image + Optional AI Lesion Highlight Overlay */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-[#11240c]">
                      {previewImageUrl && (
                        <img
                          src={previewImageUrl}
                          alt={diagnosis.diseaseDetected}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover"
                        />
                      )}

                      {/* Optional Computer Vision Lesion Highlight Circles */}
                      {showLesionOverlay &&
                        diagnosis.lesions &&
                        diagnosis.lesions.map((lesion, idx) => (
                          <div
                            key={idx}
                            style={{
                              left: `${lesion.x}%`,
                              top: `${lesion.y}%`,
                              width: `${lesion.r * 2}%`,
                              height: `${lesion.r * 2}%`,
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-red-500/20 pointer-events-none"
                          />
                        ))}
                    </div>

                    {/* Image Toolbar: Lesion Highlight Toggle + Voice Readout + Download Report */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {diagnosis.status === 'Infected' && (
                        <button
                          type="button"
                          onClick={() => setShowLesionOverlay((prev) => !prev)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            showLesionOverlay
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {showLesionOverlay ? 'Hide Lesion Spots' : 'Highlight Lesions'}
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleSpeech}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/20 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#0f5123] hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5 text-red-600" />
                              {t.result.stopAudioBtn}
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5" />
                              {t.result.listenAudioBtn}
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadReport}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {t.result.downloadReportBtn}
                        </button>
                      </div>
                    </div>

                    {/* Pixel Pathology Breakdown */}
                    {diagnosis.pixelMetrics && (
                      <div className="rounded-xl border border-slate-200/80 bg-[#f9fbf9] p-3.5 text-xs text-slate-600 tabular-nums">
                        <div className="font-bold text-slate-800 mb-1.5">
                          Leaf Spectral Analysis ({diagnosis.mode === 'offline-edge' ? 'Offline Edge ML' : 'AI Vision + HSV'})
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Healthy Chlorophyll Area:</span>
                          <span className="font-bold text-[#15803d]">
                            {diagnosis.pixelMetrics.healthyChlorophyllPct}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span>Necrotic Brown Lesion Area:</span>
                          <span className="font-bold text-red-600">
                            {diagnosis.pixelMetrics.necroticLesionPct}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span>Chlorotic Yellow Halo Area:</span>
                          <span className="font-bold text-amber-600">
                            {diagnosis.pixelMetrics.chloroticHaloPct}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Structured Table & About Disease / Suggested Action Box */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* 4-Row Key-Value Table matching Screenshot */}
                    <div className="rounded-xl border border-slate-200/90 bg-white divide-y divide-slate-200/80 tabular-nums">
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-bold text-slate-800">{t.result.cropName}</span>
                        <span className="text-sm font-extrabold text-red-700 flex items-center gap-1.5">
                          <span>{diagnosis.cropEmoji}</span>
                          <span>{diagnosis.cropName}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-bold text-slate-800">
                          {t.result.diseaseDetected}
                        </span>
                        <span
                          className={`text-sm font-extrabold ${
                            diagnosis.status === 'Healthy' ? 'text-[#16a34a]' : 'text-[#dc2626]'
                          }`}
                        >
                          {diagnosis.diseaseDetected}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-bold text-slate-800">{t.result.confidence}</span>
                        <span className="text-sm font-extrabold text-[#16a34a]">
                          {diagnosis.confidence} %
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-bold text-slate-800">{t.result.status}</span>
                        <span
                          className={`text-sm font-extrabold ${
                            diagnosis.status === 'Healthy' ? 'text-[#16a34a]' : 'text-[#dc2626]'
                          }`}
                        >
                          {diagnosis.status === 'Healthy' ? t.result.healthy : t.result.infected}
                        </span>
                      </div>
                    </div>

                    {/* About the Disease & Suggested Action Card (Exact match to Screenshot) */}
                    <div className="rounded-xl border border-slate-200/90 bg-[#fcfdfc] p-5 space-y-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1.5">
                          <Leaf className="h-4 w-4 text-[#16a34a]" />
                          {t.result.aboutDiseaseTitle}
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {diagnosis.aboutDisease}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/70">
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1.5">
                          <ShieldCheck className="h-4 w-4 text-[#16a34a]" />
                          {t.result.suggestedActionTitle}
                          <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {diagnosis.suggestedAction}
                        </p>
                      </div>

                      {/* Additional Practical Agronomy Recommendations (Organic + Fungicide Dosage) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/70 text-xs">
                        <div className="rounded-lg bg-[#f3f8f3] p-3 border border-emerald-900/10">
                          <div className="font-bold text-[#0f5123] mb-1">
                            {t.result.organicTreatmentTitle}
                          </div>
                          <p className="text-slate-700 leading-relaxed">{diagnosis.organicTreatment}</p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                          <div className="font-bold text-slate-900 mb-1">
                            {t.result.chemicalTreatmentTitle}
                          </div>
                          <p className="text-slate-700 leading-relaxed">{diagnosis.chemicalTreatment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* FARMER DIAGNOSIS & TREATMENT FEEDBACK MECHANISM (Retraining Store)  */}
              {/* =================================================================== */}
              <FarmerFeedbackSection currentDiagnosis={diagnosis} isOffline={isOffline} />
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-emerald-800/25 bg-white p-8 sm:p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#15803d]">
                <Leaf className="h-8 w-8 text-[#15803d]" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                Awaiting Crop Leaf Image
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                {t.detect.pleaseSelectImage}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('detect-disease', 'detect');
                    setTimeout(() => fileInputRef.current?.click(), 300);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f5123] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#14532d] transition-colors cursor-pointer shadow-xs"
                >
                  <Upload className="h-4 w-4" />
                  {t.detect.chooseImageBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('detect-disease', 'detect');
                    handleSelectSample('tomato_early_blight');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Sprout className="h-4 w-4 text-[#15803d]" />
                  Try Tomato Sample Leaf
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. ABOUT OUR PROJECT (Exact 4-Card Layout matching Screenshot)      */}
      {/* =================================================================== */}
      <section id="about" className="bg-[#f8faf8] py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.about.heading}
            </h2>
            <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-[#15803d]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Problem Statement (Red Circle Icon) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-2xs">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                {t.about.problemTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.about.problemDesc}
              </p>
            </div>

            {/* Card 2: Objectives (Green Circle Icon) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-2xs">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                {t.about.objectivesTitle}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 list-disc pl-4">
                {t.about.objectivesList.map((obj, idx) => (
                  <li key={idx} className="leading-snug">
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Working Process (Blue Circle Icon + Step-by-Step Vertical Flow) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xs">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                {t.about.workingTitle}
              </h3>

              <div className="flex flex-col items-start space-y-1.5 text-sm font-semibold text-slate-800">
                <div className="flex items-center gap-2.5">
                  <CloudUpload className="h-4 w-4 text-[#15803d]" />
                  <span>{t.about.stepUpload}</span>
                </div>
                <ArrowDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4 w-4 text-[#15803d]" />
                  <span>{t.about.stepProcess}</span>
                </div>
                <ArrowDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                <div className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-[#15803d]" />
                  <span>{t.about.stepDetect}</span>
                </div>
                <ArrowDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="h-4 w-4 text-[#15803d]" />
                  <span>{t.about.stepResult}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Technologies Used (Purple Circle Icon + Backend Code Inspector) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-2xs">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                  {t.about.techTitle}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-4">
                  {t.about.techList.map((tech, idx) => (
                    <li key={idx}>{tech}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setIsBackendModalOpen(true)}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-800/20 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#0f5123] hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Code2 className="h-3.5 w-3.5" />
                {t.about.viewBackendBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. FUTURE SCOPE PAGE (Exact 6-Card Row matching Reference Design)   */}
      {/* =================================================================== */}
      <section id="future-scope" className="bg-[#f2f6f2] py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.future.heading}
            </h2>
            <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-[#15803d]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 pt-4">
            {/* 1. Mobile Application */}
            <div className="relative rounded-2xl bg-white pt-10 pb-6 px-4 text-center shadow-xs border border-slate-200/70 flex flex-col items-center">
              <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md border-4 border-[#f2f6f2]">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {t.future.card1Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.future.card1Desc}
              </p>
            </div>

            {/* 2. Voice Assistance */}
            <div className="relative rounded-2xl bg-white pt-10 pb-6 px-4 text-center shadow-xs border border-slate-200/70 flex flex-col items-center">
              <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md border-4 border-[#f2f6f2]">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {t.future.card2Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.future.card2Desc}
              </p>
            </div>

            {/* 3. Multiple Crop Detection */}
            <div className="relative rounded-2xl bg-white pt-10 pb-6 px-4 text-center shadow-xs border border-slate-200/70 flex flex-col items-center">
              <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md border-4 border-[#f2f6f2]">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {t.future.card3Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.future.card3Desc}
              </p>
            </div>

            {/* 4. Weather Integration */}
            <div className="relative rounded-2xl bg-white pt-10 pb-6 px-4 text-center shadow-xs border border-slate-200/70 flex flex-col items-center">
              <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md border-4 border-[#f2f6f2]">
                <CloudSun className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {t.future.card4Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.future.card4Desc}
              </p>
            </div>

            {/* 5. Offline Detection */}
            <div className="relative rounded-2xl bg-white pt-10 pb-6 px-4 text-center shadow-xs border border-slate-200/70 flex flex-col items-center">
              <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md border-4 border-[#f2f6f2]">
                <WifiOff className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {t.future.card5Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.future.card5Desc}
              </p>
            </div>

            {/* 6. Treatment Recommendation */}
            <div className="relative rounded-2xl bg-white pt-10 pb-6 px-4 text-center shadow-xs border border-slate-200/70 flex flex-col items-center">
              <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-md border-4 border-[#f2f6f2]">
                <FlaskConical className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {t.future.card6Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.future.card6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CONTACT SECTION FOR LOCAL FARMERS                                   */}
      {/* =================================================================== */}
      <section id="contact" className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">{t.contact.heading}</h2>
            <p className="text-sm text-slate-600 mt-1">{t.contact.subtitle}</p>
          </div>

          <form
            onSubmit={handleContactSubmit}
            className="rounded-2xl border border-slate-200 bg-[#f9fbf9] p-6 sm:p-8 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.contact.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#15803d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.contact.phoneLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210 / farmer@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#15803d] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.contact.locationLabel}
                </label>
                <input
                  type="text"
                  value={contactLocation}
                  onChange={(e) => setContactLocation(e.target.value)}
                  placeholder="Pune, Maharashtra"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#15803d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.contact.cropLabel}
                </label>
                <input
                  type="text"
                  value={contactCrop}
                  onChange={(e) => setContactCrop(e.target.value)}
                  placeholder="Tomato, Rice, Potato"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#15803d] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.contact.messageLabel} *
              </label>
              <textarea
                rows={3}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Brown concentric spots appearing on lower tomato leaves after rain..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#15803d] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                className="rounded-xl bg-[#0f5123] px-6 py-3 text-sm font-bold text-white hover:bg-[#14532d] transition-colors cursor-pointer"
              >
                {t.contact.submitBtn}
              </button>

              {contactSuccess && (
                <span className="text-xs font-semibold text-[#15803d] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {t.contact.successMsg}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* =================================================================== */}
      {/* DARK FOREST GREEN FOOTER (Exact Match to Bottom Banner of Design)   */}
      {/* =================================================================== */}
      <footer className="bg-[#123c1f] text-white pt-10 pb-6 px-4 sm:px-8 mt-auto">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-emerald-800/60">
            {/* Brand + Tagline */}
            <div className="md:col-span-4 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Leaf className="h-6 w-6 text-[#4ade80] fill-[#4ade80]" />
                <div>
                  <div className="text-base font-extrabold tracking-tight leading-none">
                    SMART CROP
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-200 tracking-wider">
                    DISEASE DETECTION
                  </div>
                </div>
              </div>
              <p className="text-xs text-emerald-100/85 max-w-xs leading-relaxed">
                {t.footer.tagline}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="text-sm font-bold text-white">{t.footer.quickLinks}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-emerald-100/90">
                <button
                  type="button"
                  onClick={() => scrollToSection('home', 'home')}
                  className="hover:text-white cursor-pointer"
                >
                  {t.nav.home}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('detect-disease', 'detect')}
                  className="hover:text-white cursor-pointer"
                >
                  {t.nav.detect}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('about', 'about')}
                  className="hover:text-white cursor-pointer"
                >
                  {t.nav.about}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('future-scope', 'future')}
                  className="hover:text-white cursor-pointer"
                >
                  {t.nav.futureScope}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact', 'contact')}
                  className="hover:text-white cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </div>
            </div>

            {/* Contact Us */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="text-sm font-bold text-white">{t.footer.contactUs}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-emerald-100/90">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-300" />
                  email@example.com
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-300" />
                  +91 1234567890
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                  India
                </span>
              </div>
            </div>

            {/* Follow Us */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-sm font-bold text-white">{t.footer.followUs}</h4>
              <div className="flex items-center gap-2.5">
                <a
                  href="#contact"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877f2] text-xs font-bold text-white hover:opacity-90"
                >
                  f
                </a>
                <a
                  href="#contact"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-xs font-bold text-white hover:opacity-90"
                >
                  ig
                </a>
                <a
                  href="#contact"
                  aria-label="Twitter"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1da1f2] text-xs font-bold text-white hover:opacity-90"
                >
                  t
                </a>
                <a
                  href="#contact"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff0000] text-xs font-bold text-white hover:opacity-90"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>

          <div className="pt-5 flex items-center justify-between text-xs text-emerald-200/80">
            <p className="mx-auto">{t.footer.copyright}</p>
            <Leaf className="h-4 w-4 text-[#4ade80]" />
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* CAMERA CAPTURE MODAL                                                */}
      {/* =================================================================== */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Capture Crop Leaf Photo</h3>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
                {cameraError}
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              {!cameraError && (
                <button
                  type="button"
                  onClick={captureCameraFrame}
                  className="rounded-lg bg-[#0f5123] px-4 py-2 text-xs font-bold text-white hover:bg-[#14532d]"
                >
                  Capture Leaf
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PYTHON FLASK & ML BACKEND CODE MODAL                                */}
      {/* =================================================================== */}
      <BackendCodeModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />

      {/* =================================================================== */}
      {/* FARMER / USER AUTHENTICATION MODAL (SIGN IN & SIGN UP)              */}
      {/* =================================================================== */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
        onOpenAdminPanel={() => {
          setCurrentView('admin');
          setIsAuthModalOpen(false);
        }}
      />

      {/* =================================================================== */}
      {/* ADMIN DATASET SURVEILLANCE & ACTIVE LEARNING MODAL                  */}
      {/* =================================================================== */}
      <AdminDatasetModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        onAdminAuthenticated={(adminProfile) => {
          handleAuthSuccess(adminProfile);
          setCurrentView('admin');
          setIsAdminModalOpen(false);
        }}
        onLoadSampleIntoDetector={(sampleKey) => handleSelectSample(sampleKey, true)}
      />
    </div>
  );
}

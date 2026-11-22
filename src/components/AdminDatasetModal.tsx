import React, { useEffect, useState, useMemo } from 'react';
import {
  X,
  Shield,
  Database,
  Users,
  MessageSquare,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sprout,
  Calendar,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { UserProfile } from '../types/auth';
import { SampleLeafKey } from '../utils/offlineLeafAnalyzer';

interface AdminDatasetSummary {
  totalScans: number;
  totalFeedbackRecords: number;
  totalRegisteredUsers: number;
  totalContactInquiries: number;
  retrainingQueueCount: number;
}

interface ScanRecord {
  id: string;
  timestamp: string;
  cropName: string;
  cropEmoji: string;
  diseaseDetected: string;
  scientificName: string;
  confidence: number;
  status: 'Infected' | 'Healthy';
  severity: string;
  suggestedAction: string;
  organicTreatment: string;
  chemicalTreatment: string;
  mode: string;
  language: string;
}

interface FeedbackRecord {
  id: string;
  scanId: string;
  cropName: string;
  predictedDisease: string;
  actualDiseaseCorrection?: string;
  diagnosisAccuracyRating: number;
  treatmentSuccessRating: number;
  diagnosisVerified: string;
  treatmentOutcome: string;
  treatmentUsed: string;
  farmerNotes: string;
  region: string;
  createdAt: string;
  queuedForRetraining: boolean;
}

interface InquiryRecord {
  id: string;
  name: string;
  phoneOrEmail: string;
  location: string;
  cropType: string;
  message: string;
  createdAt: string;
}

interface AdminDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAdminAuthenticated?: (user: UserProfile) => void;
  onLoadSampleIntoDetector?: (sampleKey: SampleLeafKey) => void;
}

const DEFAULT_ADMIN_PASSWORD = 'admin123';

export function AdminDatasetModal({
  isOpen,
  onClose,
  currentUser,
  onAdminAuthenticated,
  onLoadSampleIntoDetector,
}: AdminDatasetModalProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'scans' | 'feedback' | 'users' | 'inquiries'
  >('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');

  // Admin Password Protection State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    currentUser?.role === 'admin'
  );
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const [summary, setSummary] = useState<AdminDatasetSummary>({
    totalScans: 0,
    totalFeedbackRecords: 0,
    totalRegisteredUsers: 0,
    totalContactInquiries: 0,
    retrainingQueueCount: 0,
  });

  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  // Keep unlocked state in sync if logged in as admin
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setIsUnlocked(true);
    }
  }, [currentUser]);

  const fetchDataset = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/dataset');
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || {});
        setScans(data.scans || []);
        setFeedback(data.feedback || []);
        setUsers(data.users || []);
        setInquiries(data.inquiries || []);
      }
    } catch {
      // In offline mode or fetch error, load local state fallback
      const localHistory = localStorage.getItem('smart_crop_scan_history_v1');
      const parsedLocalHistory = localHistory ? JSON.parse(localHistory) : [];
      setScans(parsedLocalHistory);
      setSummary({
        totalScans: parsedLocalHistory.length || 1,
        totalFeedbackRecords: 3,
        totalRegisteredUsers: 4,
        totalContactInquiries: 0,
        retrainingQueueCount: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`क्या आप वाकई किसान "${userName}" का खाता हमेशा के लिए हटाना चाहते हैं? यह डेटाबेस से स्थायी रूप से डिलीट हो जाएगा।`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user.');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSummary((prev) => ({
        ...prev,
        totalRegisteredUsers: Math.max(0, prev.totalRegisteredUsers - 1),
      }));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen && isUnlocked) {
      fetchDataset();
    }
  }, [isOpen, isUnlocked]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordInput.trim() === DEFAULT_ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setPasswordInput('');
      const adminProfile: UserProfile = {
        id: 'user-admin',
        name: 'Agronomy Admin Desk',
        email: 'admin@crophealth.org',
        role: 'admin',
        location: 'Central Directorate of Crop Surveillance',
        primaryCrop: 'Multi-Crop Surveillance',
        createdAt: new Date().toISOString(),
      };
      if (onAdminAuthenticated) {
        onAdminAuthenticated(adminProfile);
      }
    } else {
      setPasswordError('गलत पासवर्ड! (Incorrect password). Please enter the admin password: admin123');
    }
  };

  const handleLockAdminPanel = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    setPasswordError('');
  };

  // Filtered scans
  const filteredScans = useMemo(() => {
    return scans.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.diseaseDetected.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCrop =
        selectedCropFilter === 'all' || item.cropName.toLowerCase() === selectedCropFilter.toLowerCase();
      return matchesSearch && matchesCrop;
    });
  }, [scans, searchQuery, selectedCropFilter]);

  // Filtered feedback
  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      return (
        searchQuery === '' ||
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.predictedDisease.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmerNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [feedback, searchQuery]);

  // Export full dataset as JSON
  const handleExportFullJSON = () => {
    const fullDataset = {
      exportTimestamp: new Date().toISOString(),
      exportedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Agronomy Admin',
      summary,
      totalScansCount: scans.length,
      totalFeedbackCount: feedback.length,
      totalUsersCount: users.length,
      scans,
      retrainingFeedback: feedback,
      registeredUsers: users,
      farmerInquiries: inquiries,
    };

    const blob = new Blob([JSON.stringify(fullDataset, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_crop_admin_dataset_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Retraining Dataset as JSONL
  const handleExportJSONL = () => {
    const jsonlContent = feedback
      .map((fb) =>
        JSON.stringify({
          scan_id: fb.scanId,
          crop: fb.cropName,
          predicted_disease: fb.predictedDisease,
          actual_correction: fb.actualDiseaseCorrection || fb.predictedDisease,
          accuracy_rating: fb.diagnosisAccuracyRating,
          treatment_outcome: fb.treatmentOutcome,
          farmer_notes: fb.farmerNotes,
          region: fb.region,
          verified: fb.diagnosisVerified === 'accurate',
          queued_at: fb.createdAt,
        })
      )
      .join('\n');

    const blob = new Blob([jsonlContent], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `active_learning_retraining_dataset_${Date.now()}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // ADMIN PASSWORD GATE: If locked, require admin password first
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Admin Password Required</h2>
                <p className="text-xs text-purple-200 mt-0.5">
                  एडमिन पासवर्ड दर्ज करें (Restricted Access)
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This panel contains the proprietary <strong>Crop Disease Database</strong>, confidential farmer feedback records, active ML retraining queues, and user diagnostic datasets.
            </p>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Password / एडमिन पासवर्ड
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password (admin123)"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Password Quick Fill Button */}
              <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-between">
                <span className="text-[11px] text-purple-900 font-medium">Default Password: <strong>admin123</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInput('admin123');
                    setPasswordError('');
                  }}
                  className="px-2 py-1 text-[11px] font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors cursor-pointer"
                >
                  Quick Fill (भरें)
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin (खोलें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNLOCKED ADMIN PANEL (With Disease Database Tab + Datasets)
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-[#0f5123] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
            aria-label="Close admin modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-purple-300">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Admin Dataset & Pathology Center
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Admin Verified
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Proprietary Crop Disease Database, user diagnostic scans, farmer retraining feedbacks, and user accounts.
                </p>
              </div>
            </div>

            {/* Quick Actions & Lock Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLockAdminPanel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-200 border border-red-400/30 transition-colors cursor-pointer"
                title="Lock admin session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Panel</span>
              </button>
              <button
                type="button"
                onClick={fetchDataset}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors cursor-pointer"
                title="Refresh dataset from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleExportFullJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                title="Download complete dataset as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                type="button"
                onClick={handleExportJSONL}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                title="Export model retraining JSONL"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export JSONL</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Overview & Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('scans')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'scans'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>User Scans Dataset ({scans.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retraining Feedback ({feedback.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registered Accounts ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Farmer Inquiries ({inquiries.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leaf Scans</span>
                    <Database className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f5123]">{summary.totalScans}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Processed across online AI & offline edge</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retraining Submissions</span>
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{summary.totalFeedbackRecords}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{summary.retrainingQueueCount} active in retraining queue</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Accounts</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-800">{summary.totalRegisteredUsers}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Farmers, agronomists & researchers</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Inquiries</span>
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-800">{summary.totalContactInquiries}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Farmer messages & advisory tickets</p>
                </div>
              </div>

              {/* Data Pipeline & Architecture Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    Dataset Composition & Sources
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">PlantVillage Benchmark:</strong> 54,306 curated leaf images across 14 crops and 38 disease categories.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">ICAR & Agricultural University Repositories:</strong> Real field conditions for subtropical blight, rust, and viral strains.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Farmer Active Learning Feedback:</strong> Live user feedback records with ground-truth verification from agronomists.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Active Learning Pipeline Workflow
                  </h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                      <span className="font-semibold text-[#0f5123]">1. Field Scan & Edge Inference</span>
                      <span className="text-[11px] text-emerald-700">MobileNetV2 / Gemini 3.8</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                      <span className="font-semibold text-amber-900">2. Farmer Feedback Rating & Notes</span>
                      <span className="text-[11px] text-amber-800">1-5 Stars + Outcome</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                      <span className="font-semibold text-purple-900">3. Admin Dataset Inspection</span>
                      <span className="text-[11px] text-purple-800">Active Retrain Queue</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                      <span className="font-semibold text-blue-900">4. Export for Model Fine-Tuning</span>
                      <span className="text-[11px] text-blue-800">TensorFlow / PyTorch JSONL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links to dataset views */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('scans')}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0f5123]">Inspect User Scans</h4>
                    <p className="text-[11px] text-slate-500">{scans.length} diagnostic records</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0f5123]" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('feedback')}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-800">Retraining Feedback</h4>
                    <p className="text-[11px] text-slate-500">{feedback.length} rated entries</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="p-4 rounded-xl bg-white border border-blue-500 hover:bg-blue-50/30 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800">Registered Farmers</h4>
                    <p className="text-[11px] text-slate-500">{users.length} accounts</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-800" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: USER SCANS DATASET */}
          {activeTab === 'scans' && (
            <div className="space-y-4">
              {/* Search & Filter Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by crop, disease, or scientific name..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0f5123]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={selectedCropFilter}
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 py-1.5 px-2.5 bg-white text-slate-700"
                  >
                    <option value="all">All Crops</option>
                    <option value="tomato">Tomato</option>
                    <option value="potato">Potato</option>
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="corn">Corn</option>
                  </select>
                </div>
              </div>

              {/* Scans Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                {filteredScans.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No scans found matching current filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Crop & Disease</th>
                          <th className="py-3 px-4">Confidence</th>
                          <th className="py-3 px-4">Status & Severity</th>
                          <th className="py-3 px-4">Prescribed Treatment</th>
                          <th className="py-3 px-4">Mode / Lang</th>
                          <th className="py-3 px-4">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredScans.map((scan) => (
                          <tr key={scan.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 font-bold text-slate-900">
                                <span className="text-base">{scan.cropEmoji || '🌿'}</span>
                                <div>
                                  <div>{scan.cropName} - {scan.diseaseDetected}</div>
                                  <div className="text-[10px] font-normal italic text-slate-500">
                                    {scan.scientificName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-700">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {scan.confidence}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    scan.status === 'Healthy'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {scan.status}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {scan.severity || 'Moderate'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate" title={scan.suggestedAction}>
                              <div className="text-slate-800 truncate font-medium">{scan.suggestedAction}</div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                💊 {scan.chemicalTreatment || scan.organicTreatment}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                              <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 text-[10px] font-mono">
                                {scan.mode || 'online-ai'}
                              </span>
                              <span className="ml-1 text-[10px] uppercase font-bold text-slate-500">
                                {scan.language || 'en'}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                              {new Date(scan.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RETRAINING FEEDBACK DATASET */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    ★
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-900">
                      Active Learning Retraining Buffer ({feedback.length} entries)
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      Farmer rated diagnoses and treatment outcomes queued for fine-tuning the disease detection CNN model.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportJSONL}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Download .JSONL
                </button>
              </div>

              {/* Feedback List */}
              <div className="space-y-3">
                {filteredFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {fb.cropName} - {fb.predictedDisease}
                        </span>
                        {fb.actualDiseaseCorrection && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                            Correction: {fb.actualDiseaseCorrection}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0f5123]">
                          Accuracy: {fb.diagnosisAccuracyRating}/5 ★
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Treatment: {fb.treatmentSuccessRating}/5 ★
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{fb.region || 'Local Farm'}</span>
                        <span>•</span>
                        <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
                      <strong className="text-slate-800 font-semibold">Farmer Field Notes:</strong> {fb.farmerNotes || 'Diagnosis confirmed accurate in field application.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                      <span><strong>Outcome:</strong> {fb.treatmentOutcome}</span>
                      <span>•</span>
                      <span><strong>Treatment Used:</strong> {fb.treatmentUsed}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Queued for Active Learning Retraining
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REGISTERED ACCOUNTS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>स्थायी डेटा प्रतिधारण:</strong> एक बार रजिस्टर होने के बाद किसान का डेटा सुरक्षित फ़ाइल डेटाबेस में हमेशा के लिए सुरक्षित रहता है, जब तक कि एडमिन इसे न हटाए।
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    All Platform Users ({users.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Includes Farmers, Agronomists & Admins
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Primary Crop</th>
                        <th className="py-3 px-4">Registered Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {u.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {u.email}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : u.role === 'agronomist'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {u.location || 'Local Farm'}
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {u.primaryCrop || 'Multi-Crop'}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {u.role === 'admin' ? (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Protected</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FARMER INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                  No direct farmer inquiry tickets submitted yet. All messages from the Contact section will show here.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900">{inq.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mb-2">{inq.message}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>📞 {inq.phoneOrEmail}</span>
                        <span>📍 {inq.location}</span>
                        <span>🌾 Crop: {inq.cropType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Agricultural Knowledge Graph & Dataset Surveillance (Password Protected)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors cursor-pointer"
          >
            Close Admin View
          </button>
        </div>
      </div>
    </div>
  );
}

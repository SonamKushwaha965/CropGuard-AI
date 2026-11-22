import React, { useEffect, useState } from 'react';
import { Star, CheckCircle2, Database, Download, Send, RefreshCw } from 'lucide-react';
import { ClientDiagnosisResult } from '../utils/offlineLeafAnalyzer';

export interface FeedbackEntry {
  id: string;
  scanId: string;
  cropName: string;
  predictedDisease: string;
  actualDiseaseCorrection?: string;
  diagnosisAccuracyRating: number;
  treatmentSuccessRating: number;
  diagnosisVerified: 'accurate' | 'partially_accurate' | 'incorrect';
  treatmentOutcome: 'recovered' | 'improving' | 'no_change' | 'not_applied_yet';
  treatmentUsed: 'organic' | 'chemical' | 'both';
  farmerNotes: string;
  region: string;
  createdAt: string;
  queuedForRetraining: boolean;
}

interface FarmerFeedbackSectionProps {
  currentDiagnosis: ClientDiagnosisResult;
  isOffline: boolean;
}

const LOCAL_FEEDBACK_KEY = 'smart_crop_farmer_feedback_v1';

const INITIAL_FALLBACK_FEEDBACK: FeedbackEntry[] = [
  {
    id: 'fb-101',
    scanId: 'init-1',
    cropName: 'Tomato',
    predictedDisease: 'Early Blight',
    diagnosisAccuracyRating: 5,
    treatmentSuccessRating: 5,
    diagnosisVerified: 'accurate',
    treatmentOutcome: 'recovered',
    treatmentUsed: 'both',
    farmerNotes:
      'Removed lower spotted leaves and sprayed Mancozeb 2.5g/L followed by neem oil after 7 days. New foliage emerged healthy.',
    region: 'Nashik, Maharashtra',
    createdAt: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
    queuedForRetraining: true,
  },
  {
    id: 'fb-102',
    scanId: 'scan-potato-2',
    cropName: 'Potato',
    predictedDisease: 'Late Blight',
    diagnosisAccuracyRating: 5,
    treatmentSuccessRating: 4,
    diagnosisVerified: 'accurate',
    treatmentOutcome: 'improving',
    treatmentUsed: 'chemical',
    farmerNotes:
      'Early detection saved 80% of our potato plot during foggy weather. Systemic fungicide halted lesion spread within 4 days.',
    region: 'Jalandhar, Punjab',
    createdAt: new Date(Date.now() - 86400 * 1000 * 4).toISOString(),
    queuedForRetraining: true,
  },
];

export const FarmerFeedbackSection: React.FC<FarmerFeedbackSectionProps> = ({
  currentDiagnosis,
  isOffline,
}) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_FEEDBACK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_FALLBACK_FEEDBACK;
  });

  const [accuracyRating, setAccuracyRating] = useState<number>(5);
  const [treatmentRating, setTreatmentRating] = useState<number>(5);
  const [diagnosisVerified, setDiagnosisVerified] = useState<
    'accurate' | 'partially_accurate' | 'incorrect'
  >('accurate');
  const [actualDiseaseCorrection, setActualDiseaseCorrection] = useState<string>('');
  const [treatmentOutcome, setTreatmentOutcome] = useState<
    'recovered' | 'improving' | 'no_change' | 'not_applied_yet'
  >('improving');
  const [treatmentUsed, setTreatmentUsed] = useState<'organic' | 'chemical' | 'both'>('both');
  const [region, setRegion] = useState<string>('');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedBanner, setSubmittedBanner] = useState<boolean>(false);

  useEffect(() => {
    if (isOffline) return;
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.feedback) && data.feedback.length > 0) {
          setFeedbackList(data.feedback);
          try {
            localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(data.feedback));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Keep local feedback list when offline
      });
  }, [isOffline]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmittedBanner(false);

    const payload = {
      scanId: currentDiagnosis.id,
      cropName: currentDiagnosis.cropName,
      predictedDisease: currentDiagnosis.diseaseDetected,
      actualDiseaseCorrection:
        diagnosisVerified !== 'accurate' ? actualDiseaseCorrection.trim() : undefined,
      diagnosisAccuracyRating: accuracyRating,
      treatmentSuccessRating: treatmentRating,
      diagnosisVerified,
      treatmentOutcome,
      treatmentUsed,
      farmerNotes:
        farmerNotes.trim() ||
        `Validated ${currentDiagnosis.cropName} (${currentDiagnosis.diseaseDetected}) diagnosis and treatment plan.`,
      region: region.trim() || 'Local Agricultural Plot',
    };

    try {
      if (!isOffline) {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.entry) {
            const updated = [data.entry, ...feedbackList];
            setFeedbackList(updated);
            localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
            setSubmittedBanner(true);
            setFarmerNotes('');
            setActualDiseaseCorrection('');
            setSubmitting(false);
            return;
          }
        }
      }
    } catch {
      // Fall through to offline local storage queue
    }

    const offlineEntry: FeedbackEntry = {
      id: `fb-local-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      queuedForRetraining: true,
    };
    const updated = [offlineEntry, ...feedbackList];
    setFeedbackList(updated);
    try {
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSubmittedBanner(true);
    setFarmerNotes('');
    setActualDiseaseCorrection('');
    setSubmitting(false);
  };

  const handleExportRetrainingDataset = () => {
    const jsonlContent = feedbackList.map((entry) => JSON.stringify(entry)).join('\n');
    const blob = new Blob([jsonlContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop_disease_retraining_feedback_${new Date().toISOString().slice(0, 10)}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCount = feedbackList.length;
  const avgAccuracy =
    totalCount > 0
      ? (
          feedbackList.reduce((sum, item) => sum + item.diagnosisAccuracyRating, 0) / totalCount
        ).toFixed(1)
      : '5.0';
  const avgTreatment =
    totalCount > 0
      ? (
          feedbackList.reduce((sum, item) => sum + item.treatmentSuccessRating, 0) / totalCount
        ).toFixed(1)
      : '4.8';

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-[#15803d]" />
            Farmer Diagnosis & Treatment Feedback (ML Retraining Pipeline)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Rate the accuracy of the current{' '}
            <span className="font-semibold text-slate-900">
              {currentDiagnosis.cropName} — {currentDiagnosis.diseaseDetected}
            </span>{' '}
            diagnosis and the field effectiveness of suggested treatments to improve future model retraining.
          </p>
        </div>

        {/* Summary Metrics & Dataset Export */}
        <div className="flex flex-wrap items-center gap-4 shrink-0 tabular-nums">
          <div className="text-xs text-slate-600">
            <div>
              Diagnosis Rating: <span className="font-bold text-slate-900">{avgAccuracy} / 5.0</span>
            </div>
            <div>
              Treatment Success: <span className="font-bold text-[#15803d]">{avgTreatment} / 5.0</span>
            </div>
            <div>
              Retraining Samples: <span className="font-bold text-slate-900">{totalCount}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportRetrainingDataset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5 text-[#15803d]" />
            Export Retraining JSONL
          </button>
        </div>
      </div>

      {/* Feedback Form + Recent Retraining Logs Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Rating & Verification Form */}
        <form onSubmit={handleSubmitFeedback} className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Diagnosis Accuracy Star Rating */}
            <div className="rounded-xl border border-slate-200 bg-[#f9fcf9] p-4">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Rate Diagnosis Accuracy ({accuracyRating}/5)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAccuracyRating(star)}
                    aria-label={`Rate diagnosis accuracy ${star} out of 5`}
                    className="p-1 rounded hover:bg-emerald-50 transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= accuracyRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Target: {currentDiagnosis.cropEmoji} {currentDiagnosis.diseaseDetected} ({currentDiagnosis.confidence}%)
              </p>
            </div>

            {/* 2. Suggested Treatment Success Rating */}
            <div className="rounded-xl border border-slate-200 bg-[#f9fcf9] p-4">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                2. Rate Treatment Effectiveness ({treatmentRating}/5)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTreatmentRating(star)}
                    aria-label={`Rate treatment success ${star} out of 5`}
                    className="p-1 rounded hover:bg-emerald-50 transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= treatmentRating
                          ? 'fill-emerald-500 text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                How well did the fungicide or bio-remedy work?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diagnosis Verification
              </label>
              <select
                value={diagnosisVerified}
                onChange={(e) =>
                  setDiagnosisVerified(
                    e.target.value as 'accurate' | 'partially_accurate' | 'incorrect'
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                <option value="accurate">Accurate Match</option>
                <option value="partially_accurate">Partially Accurate</option>
                <option value="incorrect">Incorrect Diagnosis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Recovery Outcome
              </label>
              <select
                value={treatmentOutcome}
                onChange={(e) =>
                  setTreatmentOutcome(
                    e.target.value as 'recovered' | 'improving' | 'no_change' | 'not_applied_yet'
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                <option value="recovered">Fully Recovered</option>
                <option value="improving">Improving Steadily</option>
                <option value="no_change">No Change Observed</option>
                <option value="not_applied_yet">Just Applied Today</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Treatment Regimen Used
              </label>
              <select
                value={treatmentUsed}
                onChange={(e) =>
                  setTreatmentUsed(e.target.value as 'organic' | 'chemical' | 'both')
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                <option value="both">Integrated (Organic + Chemical)</option>
                <option value="organic">Organic / Bio Remedy Only</option>
                <option value="chemical">Recommended Fungicide Only</option>
              </select>
            </div>
          </div>

          {diagnosisVerified !== 'accurate' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corrected Ground-Truth Disease Label (for Supervised Model Retraining)
              </label>
              <input
                type="text"
                value={actualDiseaseCorrection}
                onChange={(e) => setActualDiseaseCorrection(e.target.value)}
                placeholder="Enter actual disease name observed in the field (e.g., Septoria Leaf Spot)"
                className="w-full rounded-lg border border-amber-300 bg-amber-50/40 px-3 py-2 text-xs text-slate-900 focus:border-[#15803d] focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farm Location / District
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Nashik, Maharashtra"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#15803d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field Observation & Dosage Notes
              </label>
              <input
                type="text"
                value={farmerNotes}
                onChange={(e) => setFarmerNotes(e.target.value)}
                placeholder="e.g., Lesions stopped spreading 4 days after Mancozeb spray"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#15803d] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f5123] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#14532d] transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving to Retraining Store...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Feedback for Model Retraining
                </>
              )}
            </button>

            {submittedBanner && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803d]">
                <CheckCircle2 className="h-4 w-4" />
                Feedback recorded & queued for active learning retraining!
              </span>
            )}
          </div>
        </form>

        {/* Right: Collected Farmer Feedback Log */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-[#f9fbf9] p-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800">
                Recent Retraining Feedback Queue ({feedbackList.length})
              </h4>
              <span className="text-xs text-slate-500">Active Learning Log</span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {feedbackList.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200/90 bg-white p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      {item.cropName}: {item.predictedDisease}
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      Acc: <strong className="text-amber-600">{item.diagnosisAccuracyRating}★</strong> ·
                      Tx: <strong className="text-[#15803d]">{item.treatmentSuccessRating}★</strong>
                    </span>
                  </div>
                  {item.actualDiseaseCorrection && (
                    <div className="text-amber-700 font-medium">
                      Correction Label: {item.actualDiseaseCorrection}
                    </div>
                  )}
                  <p className="text-slate-600 leading-snug">{item.farmerNotes}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                    <span>{item.region}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{item.treatmentOutcome.replace(/_/g, ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>Queued for Retraining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

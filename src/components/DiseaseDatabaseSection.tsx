import React, { useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sprout,
  MapPin,
  ShieldCheck,
  Microscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CROP_DISEASE_DATABASE,
  ALL_CROP_TYPES,
  ALL_SYMPTOMS,
  ALL_PLANT_PARTS,
  ALL_GEOGRAPHIES,
  CropDiseaseEntry,
} from '../data/cropDiseaseDatabase';
import { SampleLeafKey } from '../utils/offlineLeafAnalyzer';

interface DiseaseDatabaseSectionProps {
  onLoadSampleIntoDetector: (sampleKey: SampleLeafKey) => void;
}

type SortKey = 'prevalence_desc' | 'treatment_desc' | 'name_asc' | 'crop_asc';

export const DiseaseDatabaseSection: React.FC<DiseaseDatabaseSectionProps> = ({
  onLoadSampleIntoDetector,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('All Symptoms');
  const [selectedPlantPart, setSelectedPlantPart] = useState<string>('All Plant Parts');
  const [selectedGeography, setSelectedGeography] = useState<string>('All Regions');
  const [sortBy, setSortBy] = useState<SortKey>('prevalence_desc');
  const [expandedId, setExpandedId] = useState<string | null>('db-tomato-early-blight');

  const filteredAndSortedDiseases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = CROP_DISEASE_DATABASE.filter((entry) => {
      const matchesCrop = selectedCrop === 'All Crops' || entry.cropType === selectedCrop;
      const matchesSymptom =
        selectedSymptom === 'All Symptoms' || entry.symptoms.includes(selectedSymptom);
      const matchesPart =
        selectedPlantPart === 'All Plant Parts' ||
        entry.affectedParts.includes(selectedPlantPart as CropDiseaseEntry['affectedParts'][number]);
      const matchesGeo =
        selectedGeography === 'All Regions' ||
        entry.geographicalPrevalence.includes(
          selectedGeography as CropDiseaseEntry['geographicalPrevalence'][number]
        );

      if (!matchesCrop || !matchesSymptom || !matchesPart || !matchesGeo) {
        return false;
      }

      if (!q) return true;

      return (
        entry.name.toLowerCase().includes(q) ||
        entry.scientificName.toLowerCase().includes(q) ||
        entry.cropType.toLowerCase().includes(q) ||
        entry.symptomSummary.toLowerCase().includes(q) ||
        entry.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        entry.affectedParts.some((p) => p.toLowerCase().includes(q)) ||
        entry.geographicalPrevalence.some((g) => g.toLowerCase().includes(q)) ||
        entry.organicTreatment.toLowerCase().includes(q) ||
        entry.chemicalTreatment.toLowerCase().includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'prevalence_desc') return b.prevalenceScore - a.prevalenceScore;
      if (sortBy === 'treatment_desc') return b.treatmentSuccessRate - a.treatmentSuccessRate;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'crop_asc') return a.cropType.localeCompare(b.cropType);
      return 0;
    });
  }, [searchQuery, selectedCrop, selectedSymptom, selectedPlantPart, selectedGeography, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCrop('All Crops');
    setSelectedSymptom('All Symptoms');
    setSelectedPlantPart('All Plant Parts');
    setSelectedGeography('All Regions');
    setSortBy('prevalence_desc');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCrop !== 'All Crops' ||
    selectedSymptom !== 'All Symptoms' ||
    selectedPlantPart !== 'All Plant Parts' ||
    selectedGeography !== 'All Regions';

  return (
    <section id="disease-database" className="bg-[#f3f8f3] py-14 px-4 sm:px-6 lg:px-8 border-t border-emerald-900/10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2.5 mb-2">
            <Sprout className="h-6 w-6 text-[#15803d]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Crop Disease Pathology Database
            </h2>
          </div>
          <div className="mx-auto h-1 w-14 rounded-full bg-[#15803d] mb-3" />
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Search and filter agricultural diseases by crop type, visual symptoms, affected plant parts, and regional geographical prevalence.
          </p>
        </div>

        {/* Search & Multi-Facet Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs mb-6">
          {/* Top Row: Keyword Search + Sort By + Reset */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-4">
            <div className="lg:col-span-7 relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by disease name, symptom, pathogen (e.g. Alternaria, blight, yellow halo, Mancozeb)..."
                aria-label="Search crop diseases"
                className="w-full rounded-xl border border-slate-200 bg-[#f9fbf9] pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#15803d] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="lg:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                aria-label="Sort diseases by"
                className="w-full rounded-xl border border-slate-200 bg-[#f9fbf9] px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                <option value="prevalence_desc">Sort: Highest Prevalence</option>
                <option value="treatment_desc">Sort: Treatment Recovery %</option>
                <option value="name_asc">Sort: Disease Name (A–Z)</option>
                <option value="crop_asc">Sort: Crop Type (A–Z)</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex items-center justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-45 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Second Row: 4 Structured Agricultural Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                1. Crop Type
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                aria-label="Filter by Crop Type"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                {ALL_CROP_TYPES.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                2. Visual Symptoms
              </label>
              <select
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                aria-label="Filter by Symptoms"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                {ALL_SYMPTOMS.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                3. Affected Plant Parts
              </label>
              <select
                value={selectedPlantPart}
                onChange={(e) => setSelectedPlantPart(e.target.value)}
                aria-label="Filter by Affected Plant Parts"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                {ALL_PLANT_PARTS.map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                4. Geographical Prevalence
              </label>
              <select
                value={selectedGeography}
                onChange={(e) => setSelectedGeography(e.target.value)}
                aria-label="Filter by Geographical Prevalence"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#15803d] focus:outline-none"
              >
                {ALL_GEOGRAPHIES.map((geo) => (
                  <option key={geo} value={geo}>
                    {geo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Crop Filter Segmented Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Quick Crop:
              </span>
              {(['All Crops', 'Tomato', 'Potato', 'Rice', 'Wheat', 'Corn', 'Cotton', 'Chili'] as const).map(
                (crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                      selectedCrop === crop
                        ? 'bg-[#0f5123] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {crop}
                  </button>
                )
              )}
            </div>

            <div className="text-xs font-medium text-slate-500 tabular-nums">
              Showing <span className="font-bold text-[#0f5123]">{filteredAndSortedDiseases.length}</span> of{' '}
              {CROP_DISEASE_DATABASE.length} cataloged crop diseases
            </div>
          </div>
        </div>

        {/* Sortable & Filterable Disease List */}
        {filteredAndSortedDiseases.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-base font-bold text-slate-800 mb-1">
              No matching crop diseases found for the selected filters.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Try clearing one of the symptom, plant part, or regional filters to broaden results.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f5123] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532d]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Show All Diseases
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedDiseases.map((disease) => {
              const isExpanded = expandedId === disease.id;
              return (
                <div
                  key={disease.id}
                  className="rounded-xl border border-slate-200 bg-white transition-colors hover:border-emerald-700/30"
                >
                  {/* Summary Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-base font-bold text-slate-900">
                          {disease.cropEmoji} {disease.cropType}: {disease.name}
                        </span>
                        <span className="text-xs italic text-slate-500">
                          ({disease.scientificName})
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-xs font-medium text-slate-600">
                          {disease.pathogenType} Pathogen
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            disease.severityLevel === 'High'
                              ? 'text-red-600'
                              : disease.severityLevel === 'Moderate'
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                          }`}
                        >
                          {disease.severityLevel} Risk
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                        {disease.symptomSummary}
                      </p>

                      {/* Unboxed Metadata Line for Symptoms, Plant Parts & Geography */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          Parts: {disease.affectedParts.join(', ')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Symptoms: {disease.symptoms.join(', ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                          <MapPin className="h-3 w-3" />
                          {disease.geographicalPrevalence.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Right Metrics + Expand / Load Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right tabular-nums">
                        <div className="text-xs text-slate-500">
                          Prevalence Index:{' '}
                          <span className="font-bold text-slate-900">{disease.prevalenceScore}/100</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Field Recovery:{' '}
                          <span className="font-bold text-[#15803d]">{disease.treatmentSuccessRate}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {disease.sampleKey && (
                          <button
                            type="button"
                            onClick={() => onLoadSampleIntoDetector(disease.sampleKey!)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f5123] px-3 py-2 text-xs font-semibold text-white hover:bg-[#14532d] transition-colors whitespace-nowrap"
                          >
                            <Microscope className="h-3.5 w-3.5" />
                            Test Specimen
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : disease.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
                        >
                          {isExpanded ? (
                            <>
                              Hide Guide
                              <ChevronUp className="h-3.5 w-3.5" />
                            </>
                          ) : (
                            <>
                              Treatment Guide
                              <ChevronDown className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Advisory Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-[#f9fcf9] px-4 py-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="rounded-lg border border-slate-200/80 bg-white p-3.5">
                        <div className="font-bold text-[#0f5123] mb-1 flex items-center gap-1.5">
                          <Sprout className="h-3.5 w-3.5" />
                          Organic & Bio-Control Treatment
                        </div>
                        <p className="text-slate-700 leading-relaxed">{disease.organicTreatment}</p>
                      </div>

                      <div className="rounded-lg border border-slate-200/80 bg-white p-3.5">
                        <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#15803d]" />
                          Recommended Chemical Dosage
                        </div>
                        <p className="text-slate-700 leading-relaxed">{disease.chemicalTreatment}</p>
                      </div>

                      <div className="rounded-lg border border-slate-200/80 bg-white p-3.5">
                        <div className="font-bold text-slate-900 mb-1">
                          Field Hygiene & Favorable Weather
                        </div>
                        <p className="text-slate-700 leading-relaxed mb-1.5">
                          {disease.preventiveHygiene}
                        </p>
                        <p className="text-slate-500">
                          <span className="font-semibold">Weather Trigger:</span> {disease.favorableConditions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

import { SampleLeafKey } from '../utils/offlineLeafAnalyzer';

export interface CropDiseaseEntry {
  id: string;
  name: string;
  scientificName: string;
  cropType: 'Tomato' | 'Potato' | 'Rice' | 'Wheat' | 'Corn' | 'Cotton' | 'Chili' | 'Soybean' | 'Sugarcane' | 'Apple';
  cropEmoji: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Oomycete';
  symptoms: string[];
  symptomSummary: string;
  affectedParts: Array<'Leaves' | 'Stems' | 'Fruit / Pods' | 'Roots / Tubers' | 'Whole Plant'>;
  geographicalPrevalence: Array<
    | 'Pan-India & Tropics'
    | 'North & Central Plains'
    | 'South & Coastal Humid'
    | 'Western Semi-Arid'
    | 'Eastern Paddy Belt'
    | 'Global Temperate'
  >;
  favorableConditions: string;
  severityLevel: 'High' | 'Moderate' | 'Low';
  prevalenceScore: number; // 1-100 for sorting
  treatmentSuccessRate: number; // percentage
  organicTreatment: string;
  chemicalTreatment: string;
  preventiveHygiene: string;
  sampleKey?: SampleLeafKey;
}

export const CROP_DISEASE_DATABASE: CropDiseaseEntry[] = [
  {
    id: 'db-tomato-early-blight',
    name: 'Early Blight',
    scientificName: 'Alternaria solani',
    cropType: 'Tomato',
    cropEmoji: '🍅',
    pathogenType: 'Fungal',
    symptoms: ['Dark Brown Spots', 'Yellow Halo / Chlorosis'],
    symptomSummary:
      'Concentric bullseye dark brown rings on older lower leaves surrounded by bright yellow chlorotic halos; causes premature defoliation.',
    affectedParts: ['Leaves', 'Stems', 'Fruit / Pods'],
    geographicalPrevalence: ['Pan-India & Tropics', 'Western Semi-Arid', 'South & Coastal Humid'],
    favorableConditions: 'Warm temperatures (24–29°C) with alternating humid nights and morning dew.',
    severityLevel: 'Moderate',
    prevalenceScore: 95,
    treatmentSuccessRate: 94,
    organicTreatment: 'Neem oil (5ml/L) or Trichoderma viride (5g/L) foliar application every 7 days.',
    chemicalTreatment: 'Mancozeb 75% WP (2.5g/L water) or Azoxystrobin 23% SC (1ml/L water).',
    preventiveHygiene: 'Prune lower leaves, use drip irrigation, and practice 2-year crop rotation.',
    sampleKey: 'tomato_early_blight',
  },
  {
    id: 'db-potato-late-blight',
    name: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    cropType: 'Potato',
    cropEmoji: '🥔',
    pathogenType: 'Oomycete',
    symptoms: ['Water-Soaked Lesions', 'Dark Brown Spots', 'White Powdery Growth'],
    symptomSummary:
      'Water-soaked dark green to black blotches along leaf tips and margins with white cottony sporangia on the underside during cool mornings.',
    affectedParts: ['Leaves', 'Stems', 'Roots / Tubers'],
    geographicalPrevalence: ['North & Central Plains', 'Global Temperate', 'Eastern Paddy Belt'],
    favorableConditions: 'Cool cloudy days (12–20°C) with relative humidity > 85% and fog.',
    severityLevel: 'High',
    prevalenceScore: 98,
    treatmentSuccessRate: 91,
    organicTreatment: 'Bordeaux mixture (1%) or Copper Oxychloride (3g/L) protective spray.',
    chemicalTreatment: 'Metalaxyl 8% + Mancozeb 64% WP (2.5g/L water) or Cymoxanil + Mancozeb.',
    preventiveHygiene: 'Plant certified disease-free tubers and hill up soil around stems.',
    sampleKey: 'potato_late_blight',
  },
  {
    id: 'db-rice-bacterial-blight',
    name: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    cropType: 'Rice',
    cropEmoji: '🌾',
    pathogenType: 'Bacterial',
    symptoms: ['Bacterial Streak', 'Yellow Halo / Chlorosis', 'Wilting / Stem Rot'],
    symptomSummary:
      'Water-soaked yellowish-orange wavy marginal streaks starting from leaf tips, turning straw-colored and drying out paddy foliage.',
    affectedParts: ['Leaves', 'Whole Plant'],
    geographicalPrevalence: ['Eastern Paddy Belt', 'South & Coastal Humid', 'Pan-India & Tropics'],
    favorableConditions: 'Monsoon rains, strong winds, warm temperatures (25–34°C), and high nitrogen.',
    severityLevel: 'High',
    prevalenceScore: 93,
    treatmentSuccessRate: 88,
    organicTreatment: 'Pseudomonas fluorescens (10g/L) foliar spray and draining stagnant field water.',
    chemicalTreatment: 'Copper Hydroxide 77% WP (2g/L water) and balanced potash application.',
    preventiveHygiene: 'Avoid excess urea top-dressing during active tillering; keep bunds weed-free.',
    sampleKey: 'rice_bacterial_blight',
  },
  {
    id: 'db-wheat-yellow-rust',
    name: 'Stripe (Yellow) Rust',
    scientificName: 'Puccinia striiformis',
    cropType: 'Wheat',
    cropEmoji: '🌾',
    pathogenType: 'Fungal',
    symptoms: ['Rust Pustules', 'Yellow Halo / Chlorosis'],
    symptomSummary:
      'Parallel rows of bright yellow-to-orange powdery pustules arranged lengthwise along wheat leaf blades.',
    affectedParts: ['Leaves', 'Stems'],
    geographicalPrevalence: ['North & Central Plains', 'Global Temperate'],
    favorableConditions: 'Cool winter temperatures (10–18°C) with intermittent light rain and morning dew.',
    severityLevel: 'High',
    prevalenceScore: 91,
    treatmentSuccessRate: 95,
    organicTreatment: 'Sour buttermilk + neem leaf extract spray (5%) at initial stripe appearance.',
    chemicalTreatment: 'Propiconazole 25% EC (1ml/L water) or Tebuconazole 25.9% EC (1ml/L).',
    preventiveHygiene: 'Grow rust-resistant wheat cultivars and avoid late sowing.',
  },
  {
    id: 'db-tomato-leaf-curl',
    name: 'Tomato Yellow Leaf Curl Virus',
    scientificName: 'Begomovirus (TYLCV)',
    cropType: 'Tomato',
    cropEmoji: '🍅',
    pathogenType: 'Viral',
    symptoms: ['Leaf Curl / Mosaic', 'Yellow Halo / Chlorosis'],
    symptomSummary:
      'Upward curling and cupping of young leaves, thick leathery texture, interveinal yellowing, and stunted bushy plant growth.',
    affectedParts: ['Leaves', 'Whole Plant'],
    geographicalPrevalence: ['Western Semi-Arid', 'South & Coastal Humid', 'Pan-India & Tropics'],
    favorableConditions: 'Dry warm weather favoring whitefly (Bemisia tabaci) vector multiplication.',
    severityLevel: 'High',
    prevalenceScore: 89,
    treatmentSuccessRate: 85,
    organicTreatment: 'Install yellow sticky traps (15/acre) and spray Neem Seed Kernel Extract (NSKE 5%).',
    chemicalTreatment: 'Control whitefly vectors with Imidacloprid 17.8% SL (0.5ml/L) or Diafenthiuron.',
    preventiveHygiene: 'Use 40-mesh insect-proof nylon net in nursery and uproot infected plants early.',
  },
  {
    id: 'db-corn-common-rust',
    name: 'Common Maize Rust',
    scientificName: 'Puccinia sorghi',
    cropType: 'Corn',
    cropEmoji: '🌽',
    pathogenType: 'Fungal',
    symptoms: ['Rust Pustules', 'Dark Brown Spots'],
    symptomSummary:
      'Circular to elongated cinnamon-brown powdery pustules scattered across both upper and lower leaf surfaces.',
    affectedParts: ['Leaves', 'Stems'],
    geographicalPrevalence: ['North & Central Plains', 'South & Coastal Humid', 'Global Temperate'],
    favorableConditions: 'Moderate temperatures (16–24°C) and high atmospheric humidity.',
    severityLevel: 'Moderate',
    prevalenceScore: 82,
    treatmentSuccessRate: 93,
    organicTreatment: 'Trichoderma harzianum bio-formulation spray (5g/L water).',
    chemicalTreatment: 'Mancozeb 75% WP (2.5g/L) or Hexaconazole 5% EC (2ml/L).',
    preventiveHygiene: 'Plant resistant hybrids and plow under maize stubble after harvest.',
  },
  {
    id: 'db-cotton-bacterial-blight',
    name: 'Angular Leaf Spot (Black Arm)',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    cropType: 'Cotton',
    cropEmoji: '🌿',
    pathogenType: 'Bacterial',
    symptoms: ['Water-Soaked Lesions', 'Dark Brown Spots', 'Wilting / Stem Rot'],
    symptomSummary:
      'Angular water-soaked dark brown spots bounded by small leaf veins, progressing to black stem lesions ("black arm") and boll rot.',
    affectedParts: ['Leaves', 'Stems', 'Fruit / Pods'],
    geographicalPrevalence: ['Western Semi-Arid', 'North & Central Plains'],
    favorableConditions: 'Warm humid weather (28–32°C) with wind-driven rain splashes.',
    severityLevel: 'Moderate',
    prevalenceScore: 84,
    treatmentSuccessRate: 89,
    organicTreatment: 'Seed treatment with Pseudomonas fluorescens (10g/kg seed) + foliar neem spray.',
    chemicalTreatment: 'Copper Oxychloride 50% WP (2.5g/L water) at 15-day intervals.',
    preventiveHygiene: 'Delint cotton seeds and remove crop residues before next season.',
  },
  {
    id: 'db-chili-anthracnose',
    name: 'Anthracnose (Die-Back & Fruit Rot)',
    scientificName: 'Colletotrichum capsici',
    cropType: 'Chili',
    cropEmoji: '🌶️',
    pathogenType: 'Fungal',
    symptoms: ['Dark Brown Spots', 'Wilting / Stem Rot'],
    symptomSummary:
      'Necrotic sunken circular lesions with concentric black acervuli dots on leaves and ripening pods; twigs wither from tip backward.',
    affectedParts: ['Leaves', 'Stems', 'Fruit / Pods'],
    geographicalPrevalence: ['South & Coastal Humid', 'Western Semi-Arid', 'Pan-India & Tropics'],
    favorableConditions: 'High humidity (>80%) and temperatures around 27–30°C during fruiting.',
    severityLevel: 'Moderate',
    prevalenceScore: 87,
    treatmentSuccessRate: 92,
    organicTreatment: 'Seed & foliar treatment with Trichoderma viride (5g/L) + garlic-chili bio-extract.',
    chemicalTreatment: 'Carbendazim 12% + Mancozeb 63% WP (2g/L) or Tebuconazole + Trifloxystrobin.',
    preventiveHygiene: 'Harvest ripe pods promptly and collect seeds only from spotless healthy fruits.',
  },
  {
    id: 'db-soybean-powdery-mildew',
    name: 'Powdery Mildew',
    scientificName: 'Microsphaera diffusa',
    cropType: 'Soybean',
    cropEmoji: '🌱',
    pathogenType: 'Fungal',
    symptoms: ['White Powdery Growth', 'Yellow Halo / Chlorosis'],
    symptomSummary:
      'Superficial white talcum-like powdery fungal patches covering upper leaf surfaces, hindering photosynthesis.',
    affectedParts: ['Leaves', 'Stems'],
    geographicalPrevalence: ['North & Central Plains', 'Western Semi-Arid'],
    favorableConditions: 'Dry warm days with cool nights and moderate canopy humidity.',
    severityLevel: 'Low',
    prevalenceScore: 76,
    treatmentSuccessRate: 96,
    organicTreatment: 'Wettable Sulfur 80% WP (2g/L) or Potassium Bicarbonate (5g/L) foliar spray.',
    chemicalTreatment: 'Hexaconazole 5% EC (1ml/L) or Dinocap 48% EC (1ml/L).',
    preventiveHygiene: 'Avoid dense planting to maintain sunlight penetration through the canopy.',
  },
  {
    id: 'db-sugarcane-red-rot',
    name: 'Red Rot of Sugarcane',
    scientificName: 'Colletotrichum falcatum',
    cropType: 'Sugarcane',
    cropEmoji: '🎋',
    pathogenType: 'Fungal',
    symptoms: ['Dark Brown Spots', 'Wilting / Stem Rot', 'Yellow Halo / Chlorosis'],
    symptomSummary:
      'Reddish elongated lesions along the leaf midrib, yellowing of crown leaves, and internal red rotting of cane stalks with white cross-bands.',
    affectedParts: ['Leaves', 'Stems', 'Whole Plant'],
    geographicalPrevalence: ['North & Central Plains', 'Eastern Paddy Belt', 'South & Coastal Humid'],
    favorableConditions: 'Waterlogged fields and high humidity during monsoon months.',
    severityLevel: 'High',
    prevalenceScore: 90,
    treatmentSuccessRate: 86,
    organicTreatment: 'Sett treatment with Trichoderma viride culture (10g/L) for 30 minutes before planting.',
    chemicalTreatment: 'Dip cane setts in Carbendazim 50% WP (1g/L water) prior to planting.',
    preventiveHygiene: 'Use healthy seed setts, improve field drainage, and rogue out affected clumps.',
  },
  {
    id: 'db-apple-scab',
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    cropType: 'Apple',
    cropEmoji: '🍎',
    pathogenType: 'Fungal',
    symptoms: ['Dark Brown Spots', 'Yellow Halo / Chlorosis'],
    symptomSummary:
      'Olive-green to velvety dark brown circular lesions on leaves and developing fruit, leading to corky scabs and leaf drop.',
    affectedParts: ['Leaves', 'Fruit / Pods'],
    geographicalPrevalence: ['Global Temperate', 'North & Central Plains'],
    favorableConditions: 'Cool wet spring weather (14–22°C) with prolonged leaf wetness.',
    severityLevel: 'Moderate',
    prevalenceScore: 85,
    treatmentSuccessRate: 94,
    organicTreatment: 'Lime-sulfur spray or 5% urea spray on fallen autumn leaves to speed decomposition.',
    chemicalTreatment: 'Captan 50% WP (2.5g/L) or Dodine 65% WP (0.75g/L) at petal fall stage.',
    preventiveHygiene: 'Rake and compost fallen orchard leaves in autumn; prune trees for open canopy.',
  },
];

export const ALL_CROP_TYPES = [
  'All Crops',
  'Tomato',
  'Potato',
  'Rice',
  'Wheat',
  'Corn',
  'Cotton',
  'Chili',
  'Soybean',
  'Sugarcane',
  'Apple',
] as const;

export const ALL_SYMPTOMS = [
  'All Symptoms',
  'Dark Brown Spots',
  'Yellow Halo / Chlorosis',
  'Water-Soaked Lesions',
  'White Powdery Growth',
  'Rust Pustules',
  'Leaf Curl / Mosaic',
  'Wilting / Stem Rot',
  'Bacterial Streak',
] as const;

export const ALL_PLANT_PARTS = [
  'All Plant Parts',
  'Leaves',
  'Stems',
  'Fruit / Pods',
  'Roots / Tubers',
  'Whole Plant',
] as const;

export const ALL_GEOGRAPHIES = [
  'All Regions',
  'Pan-India & Tropics',
  'North & Central Plains',
  'South & Coastal Humid',
  'Western Semi-Arid',
  'Eastern Paddy Belt',
  'Global Temperate',
] as const;

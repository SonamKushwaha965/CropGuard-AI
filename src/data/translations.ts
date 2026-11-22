export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  speechLang: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', speechLang: 'en-IN' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', speechLang: 'hi-IN' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', speechLang: 'mr-IN' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', speechLang: 'ta-IN' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', speechLang: 'te-IN' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', speechLang: 'es-ES' },
];

export interface UIStrings {
  nav: {
    home: string;
    detect: string;
    about: string;
    futureScope: string;
    contact: string;
    getStarted: string;
    backendCode: string;
    offlineMode: string;
    onlineMode: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    uploadBtn: string;
    detectBtn: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
  };
  whyChoose: {
    heading: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
  };
  detect: {
    heading: string;
    subtitle: string;
    step1Title: string;
    step2Title: string;
    dragDropText: string;
    orText: string;
    chooseImageBtn: string;
    useCameraBtn: string;
    allowedFormats: string;
    detectActionBtn: string;
    detectingBtn: string;
    sampleLeavesLabel: string;
    offlineBadgeNote: string;
    pleaseSelectImage: string;
    noImageSelectedNote: string;
  };
  result: {
    heading: string;
    subtitle: string;
    cropName: string;
    diseaseDetected: string;
    confidence: string;
    status: string;
    infected: string;
    healthy: string;
    aboutDiseaseTitle: string;
    suggestedActionTitle: string;
    organicTreatmentTitle: string;
    chemicalTreatmentTitle: string;
    preventionTitle: string;
    listenAudioBtn: string;
    stopAudioBtn: string;
    downloadReportBtn: string;
    recentScansTitle: string;
  };
  about: {
    heading: string;
    problemTitle: string;
    problemDesc: string;
    objectivesTitle: string;
    objectivesList: string[];
    workingTitle: string;
    stepUpload: string;
    stepProcess: string;
    stepDetect: string;
    stepResult: string;
    techTitle: string;
    techList: string[];
    viewBackendBtn: string;
  };
  future: {
    heading: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    card5Title: string;
    card5Desc: string;
    card6Title: string;
    card6Desc: string;
  };
  contact: {
    heading: string;
    subtitle: string;
    nameLabel: string;
    phoneLabel: string;
    locationLabel: string;
    cropLabel: string;
    messageLabel: string;
    submitBtn: string;
    successMsg: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    contactUs: string;
    followUs: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, UIStrings> = {
  en: {
    nav: {
      home: 'Home',
      detect: 'Detect Disease',
      about: 'About',
      futureScope: 'Future Scope',
      contact: 'Contact',
      getStarted: 'Get Started',
      backendCode: 'Backend Code',
      offlineMode: 'Offline Mode',
      onlineMode: 'Online AI',
    },
    hero: {
      badge: 'AI POWERED SOLUTION',
      titleLine1: 'Smart Crop',
      titleLine2: 'Disease Detection',
      subtitle:
        'Upload an image of your crop leaf and our AI model will detect the disease and provide helpful information and suggestions.',
      uploadBtn: 'Upload Crop Image',
      detectBtn: 'Detect Disease',
      stat1Value: '50+',
      stat1Label: 'Diseases Detected',
      stat2Value: '20+',
      stat2Label: 'Crops Supported',
      stat3Value: '95%',
      stat3Label: 'Accuracy',
      stat4Value: '1000+',
      stat4Label: 'Happy Farmers',
    },
    whyChoose: {
      heading: 'Why Choose Our System?',
      card1Title: 'Fast Detection',
      card1Desc: 'Get instant results within seconds.',
      card2Title: 'High Accuracy',
      card2Desc: 'AI model with high accuracy and reliability.',
      card3Title: 'Easy to Use',
      card3Desc: 'Simple and user-friendly interface for everyone.',
      card4Title: 'Farmer Friendly',
      card4Desc: 'Designed especially for farmers and agriculture.',
    },
    detect: {
      heading: 'Detect Crop Disease',
      subtitle: 'Upload a clear image of crop leaf to detect disease',
      step1Title: '1. Upload Crop Image',
      step2Title: '2. Image Preview',
      dragDropText: 'Drag & drop an image here',
      orText: 'or',
      chooseImageBtn: 'Choose Image',
      useCameraBtn: 'Capture Photo',
      allowedFormats: 'JPG, PNG, JPEG allowed (Max. 5MB)',
      detectActionBtn: 'Detect Disease',
      detectingBtn: 'Analyzing Leaf Specimen...',
      sampleLeavesLabel: 'Test with Sample Crop Leaves:',
      offlineBadgeNote: 'Running Offline Edge ML Engine — works without internet',
      pleaseSelectImage: 'Please upload or choose a crop leaf image first to detect diseases.',
      noImageSelectedNote: 'No crop leaf selected. Please choose or capture an image to analyze.',
    },
    result: {
      heading: 'Detection Result',
      subtitle: 'Here is the prediction result',
      cropName: 'Crop Name',
      diseaseDetected: 'Disease Detected',
      confidence: 'Confidence',
      status: 'Status',
      infected: 'Infected',
      healthy: 'Healthy',
      aboutDiseaseTitle: 'About the Disease',
      suggestedActionTitle: 'Suggested Action',
      organicTreatmentTitle: 'Organic & Bio Remedy',
      chemicalTreatmentTitle: 'Fungicide / Chemical Dosage',
      preventionTitle: 'Field Hygiene & Prevention',
      listenAudioBtn: 'Listen in Voice',
      stopAudioBtn: 'Stop Voice',
      downloadReportBtn: 'Save Report Offline',
      recentScansTitle: 'Saved Farmer Scan History (Available Offline)',
    },
    about: {
      heading: 'About Our Project',
      problemTitle: 'Problem Statement',
      problemDesc:
        'Farmers face difficulties in identifying crop diseases at early stage. Late detection may affect the crop yield and quality.',
      objectivesTitle: 'Objectives',
      objectivesList: [
        'Detect crop diseases early',
        'Provide accurate using AI',
        'Save time and reduce loss of crops',
        'Help farmers with treatment suggestions',
      ],
      workingTitle: 'Working Process',
      stepUpload: 'Upload Image',
      stepProcess: 'Process Image',
      stepDetect: 'Detect Disease',
      stepResult: 'Show Result',
      techTitle: 'Technologies Used',
      techList: ['HTML', 'CSS', 'JavaScript', 'Python', 'Machine Learning', 'Flask (Backend)'],
      viewBackendBtn: 'Inspect Backend Code',
    },
    future: {
      heading: 'Future Scope',
      card1Title: 'Mobile Application',
      card1Desc: 'Make the system available on Android & iOS.',
      card2Title: 'Voice Assistance',
      card2Desc: 'Add voice input and information support.',
      card3Title: 'Multiple Crop Detection',
      card3Desc: 'Support more crops and their diseases.',
      card4Title: 'Weather Integration',
      card4Desc: 'Provide weather updates and alerts.',
      card5Title: 'Offline Detection',
      card5Desc: 'Work without internet using optimized model.',
      card6Title: 'Treatment Recommendation',
      card6Desc: 'Give best treatment and pesticide suggestions.',
    },
    contact: {
      heading: 'Contact Agriculture Support',
      subtitle: 'Have questions about a crop infection or local treatment? Reach our agronomy team.',
      nameLabel: 'Farmer Full Name',
      phoneLabel: 'Phone Number or Email',
      locationLabel: 'Village / District / State',
      cropLabel: 'Primary Crop Grown',
      messageLabel: 'Describe Symptoms or Question',
      submitBtn: 'Send Farmer Inquiry',
      successMsg: 'Your inquiry has been saved and shared with the agricultural advisory desk.',
    },
    footer: {
      tagline: 'Smart technology for healthy crops and better tomorrow.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      followUs: 'Follow Us',
      copyright: '© 2024 Smart Crop Disease Detection. All rights reserved.',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      detect: 'रोग पहचानें',
      about: 'परिचय',
      futureScope: 'भविष्य की योजना',
      contact: 'संपर्क करें',
      getStarted: 'शुरू करें',
      backendCode: 'बैकएंड कोड',
      offlineMode: 'ऑफलाइन मोड',
      onlineMode: 'ऑनलाइन AI',
    },
    hero: {
      badge: 'एआई आधारित समाधान',
      titleLine1: 'स्मार्ट फसल',
      titleLine2: 'रोग पहचान प्रणाली',
      subtitle:
        'अपनी फसल की पत्ती का चित्र अपलोड करें और हमारा AI मॉडल तुरंत रोग की पहचान कर उपचार और सुझाव प्रदान करेगा।',
      uploadBtn: 'पत्ती का फोटो अपलोड करें',
      detectBtn: 'रोग की जांच करें',
      stat1Value: '50+',
      stat1Label: 'पहचाने गए रोग',
      stat2Value: '20+',
      stat2Label: 'समर्थित फसलें',
      stat3Value: '95%',
      stat3Label: 'सटीकता',
      stat4Value: '1000+',
      stat4Label: 'खुशहाल किसान',
    },
    whyChoose: {
      heading: 'हमारी प्रणाली क्यों चुनें?',
      card1Title: 'तेज़ पहचान',
      card1Desc: 'कुछ ही सेकंड में तुरंत परिणाम प्राप्त करें।',
      card2Title: 'उच्च सटीकता',
      card2Desc: 'उच्च सटीकता और विश्वसनीयता वाला AI मॉडल।',
      card3Title: 'उपयोग में आसान',
      card3Desc: 'सभी किसानों के लिए सरल और सहज इंटरफ़ेस।',
      card4Title: 'किसान हितैषी',
      card4Desc: 'विशेष रूप से किसानों और कृषि के लिए डिज़ाइन किया गया।',
    },
    detect: {
      heading: 'फसल रोग की पहचान करें',
      subtitle: 'रोग का पता लगाने के लिए फसल की पत्ती का स्पष्ट चित्र अपलोड करें',
      step1Title: '1. फसल का चित्र अपलोड करें',
      step2Title: '2. चित्र पूर्वावलोकन (Preview)',
      dragDropText: 'यहाँ चित्र खींचें और छोड़ें',
      orText: 'या',
      chooseImageBtn: 'चित्र चुनें',
      useCameraBtn: 'कैमरा फोटो',
      allowedFormats: 'JPG, PNG, JPEG मान्य (अधिकतम 5MB)',
      detectActionBtn: 'रोग की पहचान करें',
      detectingBtn: 'पत्ती का विश्लेषण हो रहा है...',
      sampleLeavesLabel: 'नमूना पत्तियों से परीक्षण करें:',
      offlineBadgeNote: 'ऑफलाइन एज ML इंजन सक्रिय — बिना इंटरनेट के काम करता है',
      pleaseSelectImage: 'रोग का पता लगाने के लिए कृपया पहले अपनी फसल की पत्ती का चित्र चुनें या अपलोड करें।',
      noImageSelectedNote: 'कोई पत्ती नहीं चुनी गई है। विश्लेषण के लिए कृपया चित्र अपलोड या कैप्चर करें।',
    },
    result: {
      heading: 'जांच का परिणाम',
      subtitle: 'यहाँ आपकी फसल की भविष्यवाणी का परिणाम है',
      cropName: 'फसल का नाम',
      diseaseDetected: 'पहचाना गया रोग',
      confidence: 'सटीकता विश्वास',
      status: 'स्थिति',
      infected: 'संक्रमित (Infected)',
      healthy: 'स्वस्थ (Healthy)',
      aboutDiseaseTitle: 'रोग के बारे में जानकारी',
      suggestedActionTitle: 'सुझाया गया उपचार और कदम',
      organicTreatmentTitle: 'जैविक एवं घरेलू उपचार',
      chemicalTreatmentTitle: 'कवकनाशी / रासायनिक मात्रा',
      preventionTitle: 'खेत की स्वच्छता और बचाव',
      listenAudioBtn: 'आवाज़ में सुनें',
      stopAudioBtn: 'आवाज़ रोकें',
      downloadReportBtn: 'रिपोर्ट ऑफलाइन सहेजें',
      recentScansTitle: 'सहेजे गए किसान जांच इतिहास (ऑफलाइन उपलब्ध)',
    },
    about: {
      heading: 'हमारे प्रोजेक्ट के बारे में',
      problemTitle: 'समस्या विवरण',
      problemDesc:
        'किसानों को शुरुआती चरण में फसल रोगों की पहचान करने में कठिनाई होती है। देर से पता चलने पर उपज और गुणवत्ता प्रभावित होती है।',
      objectivesTitle: 'मुख्य उद्देश्य',
      objectivesList: [
        'फसल रोगों की शीघ्र पहचान करना',
        'AI की मदद से सटीक निदान देना',
        'समय बचाना और फसल नुकसान कम करना',
        'किसानों को उपचार सुझावों से सहायता देना',
      ],
      workingTitle: 'कार्य प्रणाली',
      stepUpload: 'फोटो अपलोड करें',
      stepProcess: 'इमेज प्रोसेसिंग',
      stepDetect: 'रोग पहचानें',
      stepResult: 'परिणाम दिखाएं',
      techTitle: 'प्रयुक्त तकनीकें',
      techList: ['HTML', 'CSS', 'JavaScript', 'Python', 'Machine Learning', 'Flask (Backend)'],
      viewBackendBtn: 'बैकएंड कोड देखें',
    },
    future: {
      heading: 'भविष्य की संभावनाएं (Future Scope)',
      card1Title: 'मोबाइल एप्लिकेशन',
      card1Desc: 'सिस्टम को Android और iOS पर उपलब्ध कराना।',
      card2Title: 'वॉयस असिस्टेंस',
      card2Desc: 'आवाज़ द्वारा इनपुट और जानकारी सहायता जोड़ना।',
      card3Title: 'अनेक फसलों की जांच',
      card3Desc: 'अधिक फसलों और उनके रोगों का समर्थन करना।',
      card4Title: 'मौसम एकीकरण',
      card4Desc: 'मौसम अपडेट और रोग चेतावनी प्रदान करना।',
      card5Title: 'ऑफलाइन पहचान',
      card5Desc: 'अनुकूलित मॉडल का उपयोग कर बिना इंटरनेट काम करना।',
      card6Title: 'उपचार अनुशंसा',
      card6Desc: 'सर्वोत्तम उपचार और कीटनाशक सुझाव देना।',
    },
    contact: {
      heading: 'कृषि सहायता से संपर्क करें',
      subtitle: 'फसल संक्रमण या स्थानीय उपचार के बारे में प्रश्न हैं? हमारी कृषि टीम से जुड़ें।',
      nameLabel: 'किसान का पूरा नाम',
      phoneLabel: 'फ़ोन नंबर या ईमेल',
      locationLabel: 'गाँव / जिला / राज्य',
      cropLabel: 'मुख्य उगाई जाने वाली फसल',
      messageLabel: 'लक्षण या प्रश्न लिखें',
      submitBtn: 'संदेश भेजें',
      successMsg: 'आपका प्रश्न सहेज लिया गया है और कृषि सलाहकार केंद्र को भेज दिया गया है।',
    },
    footer: {
      tagline: 'स्वस्थ फसलों और बेहतर कल के लिए स्मार्ट तकनीक।',
      quickLinks: 'त्वरित लिंक',
      contactUs: 'संपर्क करें',
      followUs: 'हमें फॉलो करें',
      copyright: '© 2024 स्मार्ट फसल रोग पहचान। सर्वाधिकार सुरक्षित।',
    },
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      detect: 'रोग ओळखा',
      about: 'प्रकल्पाविषयी',
      futureScope: 'भविष्यातील व्याप्ती',
      contact: 'संपर्क',
      getStarted: 'सुरू करा',
      backendCode: 'बॅकएंड कोड',
      offlineMode: 'ऑफलाइन मोड',
      onlineMode: 'ऑनलाइन AI',
    },
    hero: {
      badge: 'एआय आधारित उपाय',
      titleLine1: 'स्मार्ट पीक',
      titleLine2: 'रोग निदान प्रणाली',
      subtitle:
        'तुमच्या पिकाच्या पानाचा फोटो अपलोड करा आणि आमचे AI मॉडेल रोगाचे निदान करून उपयुक्त माहिती व उपाय सुचवेल.',
      uploadBtn: 'पीक फोटो अपलोड करा',
      detectBtn: 'रोग तपासा',
      stat1Value: '50+',
      stat1Label: 'ओळखलेले रोग',
      stat2Value: '20+',
      stat2Label: 'समर्थित पिके',
      stat3Value: '95%',
      stat3Label: 'अचूकता',
      stat4Value: '1000+',
      stat4Label: 'समाधानी शेतकरी',
    },
    whyChoose: {
      heading: 'आमची प्रणाली का निवडावी?',
      card1Title: 'जलद निदान',
      card1Desc: 'काही सेकंदात त्वरित निकाल मिळवा.',
      card2Title: 'उच्च अचूकता',
      card2Desc: 'उच्च अचूकता आणि विश्वासार्हतेसह AI मॉडेल.',
      card3Title: 'वापरण्यास सोपे',
      card3Desc: 'प्रत्येकासाठी सोपा आणि सुलभ इंटरफेस.',
      card4Title: 'शेतकरी अनुकूल',
      card4Desc: 'विशेषतः शेतकरी आणि शेतीसाठी डिझाइन केलेले.',
    },
    detect: {
      heading: 'पीक रोग ओळखा',
      subtitle: 'रोगाचे निदान करण्यासाठी पिकाच्या पानाचा स्पष्ट फोटो अपलोड करा',
      step1Title: '1. पिकाचा फोटो अपलोड करा',
      step2Title: '2. फोटो पूर्वावलोकन',
      dragDropText: 'येथे फोटो ड्रॅग आणि ड्रॉप करा',
      orText: 'किंवा',
      chooseImageBtn: 'फोटो निवडा',
      useCameraBtn: 'कॅमेरा फोटो',
      allowedFormats: 'JPG, PNG, JPEG परवानगी (कमाल 5MB)',
      detectActionBtn: 'रोगाचे निदान करा',
      detectingBtn: 'पानाचे विश्लेषण सुरू आहे...',
      sampleLeavesLabel: 'नमुना पानांवर चाचणी करा:',
      offlineBadgeNote: 'ऑफलाइन एज ML इंजिन सुरू — इंटरनेटशिवाय कार्य करते',
      pleaseSelectImage: 'रोग ओळखण्यासाठी कृपया आधी पिकाच्या पानाचा फोटो निवडा किंवा अपलोड करा.',
      noImageSelectedNote: 'कोणतेही पान निवडलेले नाही. विश्लेषणासाठी कृपया फोटो निवडा.',
    },
    result: {
      heading: 'निदान निकाल',
      subtitle: 'येथे तुमच्या पिकाचा तपासणी निकाल आहे',
      cropName: 'पिकाचे नाव',
      diseaseDetected: 'आढळलेला रोग',
      confidence: 'अचूकता प्रमाण',
      status: 'स्थिती',
      infected: 'बाधित (Infected)',
      healthy: 'निरोगी (Healthy)',
      aboutDiseaseTitle: 'रोगाविषयी माहिती',
      suggestedActionTitle: 'सुचवलेली कृती आणि उपाय',
      organicTreatmentTitle: 'सेंद्रिय व जैविक उपाय',
      chemicalTreatmentTitle: 'बुरशीनाशक / रासायनिक प्रमाण',
      preventionTitle: 'शेतातील स्वच्छता आणि प्रतिबंध',
      listenAudioBtn: 'आवाजात ऐका',
      stopAudioBtn: 'आवाज थांबवा',
      downloadReportBtn: 'अहवाल जतन करा',
      recentScansTitle: 'मागील पीक तपासणी इतिहास (ऑफलाइन उपलब्ध)',
    },
    about: {
      heading: 'आमच्या प्रकल्पाविषयी',
      problemTitle: 'समस्या विधान',
      problemDesc:
        'शेतकऱ्यांना सुरुवातीच्या टप्प्यात पिकांचे रोग ओळखण्यात अडचणी येतात. उशिरा निदान झाल्यास उत्पन्न आणि गुणवत्तेवर परिणाम होतो.',
      objectivesTitle: 'उद्दिष्टे',
      objectivesList: [
        'पिकांचे रोग लवकर ओळखणे',
        'AI वापरून अचूक माहिती देणे',
        'वेळ वाचवणे आणि पिकांचे नुकसान टाळणे',
        'शेतकऱ्यांना उपचारांच्या सूचना देणे',
      ],
      workingTitle: 'कार्यपद्धती',
      stepUpload: 'फोटो अपलोड करा',
      stepProcess: 'फोटो प्रक्रिया',
      stepDetect: 'रोग ओळखा',
      stepResult: 'निकाल दाखवा',
      techTitle: 'वापरलेले तंत्रज्ञान',
      techList: ['HTML', 'CSS', 'JavaScript', 'Python', 'Machine Learning', 'Flask (Backend)'],
      viewBackendBtn: 'बॅकएंड कोड पहा',
    },
    future: {
      heading: 'भविष्यातील व्याप्ती',
      card1Title: 'मोबाईल अ‍ॅप्लिकेशन',
      card1Desc: 'Android आणि iOS वर प्रणाली उपलब्ध करणे.',
      card2Title: 'व्हॉइस असिस्टन्स',
      card2Desc: 'आवाज इनपुट आणि माहिती समर्थन जोडणे.',
      card3Title: 'बहु-पीक निदान',
      card3Desc: 'अधिक पिके आणि त्यांच्या रोगांना समर्थन देणे.',
      card4Title: 'हवामान एकत्रीकरण',
      card4Desc: 'हवामान अपडेट्स आणि सूचना देणे.',
      card5Title: 'ऑफलाइन निदान',
      card5Desc: 'इंटरनेटशिवाय ऑप्टिमाइझ मॉडेलसह कार्य करणे.',
      card6Title: 'उपचार शिफारस',
      card6Desc: 'उत्तम उपचार आणि कीटकनाशक सूचना देणे.',
    },
    contact: {
      heading: 'कृषी सहाय्याशी संपर्क साधा',
      subtitle: 'पीक संसर्ग किंवा उपचारांबद्दल प्रश्न आहेत? आमच्या कृषी तज्ञांशी संपर्क साधा.',
      nameLabel: 'शेतकऱ्याचे पूर्ण नाव',
      phoneLabel: 'फोन नंबर किंवा ईमेल',
      locationLabel: 'गाव / जिल्हा / राज्य',
      cropLabel: 'मुख्य पीक',
      messageLabel: 'लक्षणे किंवा प्रश्न लिहा',
      submitBtn: 'चौकशी पाठवा',
      successMsg: 'तुमचा संदेश जतन केला गेला आहे.',
    },
    footer: {
      tagline: 'निरोगी पिके आणि उज्ज्वल भविष्यासाठी स्मार्ट तंत्रज्ञान.',
      quickLinks: 'महत्त्वाचे दुवे',
      contactUs: 'संपर्क करा',
      followUs: 'फॉलो करा',
      copyright: '© 2024 स्मार्ट पीक रोग निदान. सर्व हक्क राखीव.',
    },
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      detect: 'நோய் கண்டறிதல்',
      about: 'பற்றி',
      futureScope: 'எதிர்கால திட்டம்',
      contact: 'தொடர்புக்கு',
      getStarted: 'தொடங்கவும்',
      backendCode: 'பின்புல குறியீடு',
      offlineMode: 'ஆஃப்லைன் முறை',
      onlineMode: 'ஆன்லைன் AI',
    },
    hero: {
      badge: 'AI மூலம் இயங்கும் தீர்வு',
      titleLine1: 'ஸ்மார்ட் பயிர்',
      titleLine2: 'நோய் கண்டறிதல்',
      subtitle:
        'உங்கள் பயிர் இலையின் படத்தை பதிவேற்றவும்; எங்கள் AI மாதிரி நோயைக் கண்டறிந்து சிகிச்சை மற்றும் ஆலோசனைகளை வழங்கும்.',
      uploadBtn: 'பயிர் படத்தை பதிவேற்று',
      detectBtn: 'நோயைக் கண்டறி',
      stat1Value: '50+',
      stat1Label: 'கண்டறியப்பட்ட நோய்கள்',
      stat2Value: '20+',
      stat2Label: 'பயிர்கள் ஆதரவு',
      stat3Value: '95%',
      stat3Label: 'துல்லியம்',
      stat4Value: '1000+',
      stat4Label: 'மகிழ்ச்சியான விவசாயிகள்',
    },
    whyChoose: {
      heading: 'எங்கள் அமைப்பை ஏன் தேர்வு செய்ய வேண்டும்?',
      card1Title: 'வேகமான கண்டறிதல்',
      card1Desc: 'சில நொடிகளில் உடனடி முடிவுகளைப் பெறுங்கள்.',
      card2Title: 'உயர் துல்லியம்',
      card2Desc: 'உயர் துல்லியம் மற்றும் நம்பகத்தன்மை கொண்ட AI.',
      card3Title: 'பயன்படுத்த எளிதானது',
      card3Desc: 'அனைவருக்கும் எளிமையான மற்றும் நட்பு இடைமுகம்.',
      card4Title: 'விவசாயி நட்பு',
      card4Desc: 'விவசாயிகள் மற்றும் விவசாயத்திற்காக வடிவமைக்கப்பட்டது.',
    },
    detect: {
      heading: 'பயிர் நோயைக் கண்டறியவும்',
      subtitle: 'நோயைக் கண்டறிய பயிர் இலையின் தெளிவான படத்தை பதிவேற்றவும்',
      step1Title: '1. பயிர் படத்தை பதிவேற்றவும்',
      step2Title: '2. பட முன்னோட்டம்',
      dragDropText: 'படத்தை இங்கே இழுத்து விடவும்',
      orText: 'அல்லது',
      chooseImageBtn: 'படத்தைத் தேர்ந்தெடு',
      useCameraBtn: 'கேமரா படம்',
      allowedFormats: 'JPG, PNG, JPEG அனுமதிக்கப்படும் (அதிகபட்சம் 5MB)',
      detectActionBtn: 'நோயைக் கண்டறி',
      detectingBtn: 'இலை பகுப்பாய்வு செய்யப்படுகிறது...',
      sampleLeavesLabel: 'மாதிரி இலைகளுடன் சோதிக்கவும்:',
      offlineBadgeNote: 'ஆஃப்லைன் ML இயந்திரம் — இணையம் இல்லாமல் இயங்கும்',
      pleaseSelectImage: 'நோயைக் கண்டறிய முதலில் உங்கள் பயிர் இலை படத்தை தேர்ந்தெடுக்கவும் அல்லது பதிவேற்றவும்.',
      noImageSelectedNote: 'பயிர் இலை படம் தேர்ந்தெடுக்கப்படவில்லை. பகுப்பாய்வு செய்ய படத்தை தேர்ந்தெடுக்கவும்.',
    },
    result: {
      heading: 'கண்டறிதல் முடிவு',
      subtitle: 'இதோ கணிப்பு முடிவு',
      cropName: 'பயிர் பெயர்',
      diseaseDetected: 'கண்டறியப்பட்ட நோய்',
      confidence: 'நம்பிக்கை அளவு',
      status: 'நிலை',
      infected: 'பாதிக்கப்பட்டது (Infected)',
      healthy: 'ஆரோக்கியமானது (Healthy)',
      aboutDiseaseTitle: 'நோயைப் பற்றி',
      suggestedActionTitle: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை',
      organicTreatmentTitle: 'இயற்கை & உயிரி சிகிச்சை',
      chemicalTreatmentTitle: 'பூஞ்சைக்கொல்லி / மருந்து அளவு',
      preventionTitle: 'வயல் சுகாதாரம் & தடுப்பு',
      listenAudioBtn: 'குரலில் கேட்க',
      stopAudioBtn: 'நிறுத்து',
      downloadReportBtn: 'அறிக்கையை சேமி',
      recentScansTitle: 'சேமிக்கப்பட்ட பரிசோதனை வரலாறு (ஆஃப்லைன்)',
    },
    about: {
      heading: 'எங்கள் திட்டம் பற்றி',
      problemTitle: 'பிரச்சனை விளக்கம்',
      problemDesc:
        'ஆரம்ப கட்டத்தில் பயிர் நோய்களை அடையாளம் காண்பதில் விவசாயிகள் சிரமப்படுகின்றனர். தாமதமான கண்டறிதல் விளைச்சலை பாதிக்கும்.',
      objectivesTitle: 'நோக்கங்கள்',
      objectivesList: [
        'பயிர் நோய்களை ஆரம்பத்திலேயே கண்டறிதல்',
        'AI மூலம் துல்லியமான தகவல் வழங்குதல்',
        'நேரத்தை மிச்சப்படுத்தி பயிர் இழப்பைக் குறைத்தல்',
        'சிகிச்சை பரிந்துரைகள் மூலம் விவசாயிகளுக்கு உதவுதல்',
      ],
      workingTitle: 'செயல்முறை',
      stepUpload: 'படம் பதிவேற்று',
      stepProcess: 'படம் செயலாக்கம்',
      stepDetect: 'நோய் கண்டறிதல்',
      stepResult: 'முடிவைக் காட்டு',
      techTitle: 'பயன்படுத்தப்பட்ட தொழில்நுட்பங்கள்',
      techList: ['HTML', 'CSS', 'JavaScript', 'Python', 'Machine Learning', 'Flask (Backend)'],
      viewBackendBtn: 'பின்புல குறியீட்டைப் பார்',
    },
    future: {
      heading: 'எதிர்கால திட்டம்',
      card1Title: 'மொபைல் செயலி',
      card1Desc: 'Android & iOS இல் கிடைக்கச் செய்தல்.',
      card2Title: 'குரல் உதவி',
      card2Desc: 'குரல் உள்ளீடு மற்றும் தகவல் ஆதரவைச் சேர்த்தல்.',
      card3Title: 'பல பயிர் கண்டறிதல்',
      card3Desc: 'மேலும் பல பயிர்கள் மற்றும் நோய்களை ஆதரித்தல்.',
      card4Title: 'வானிலை இணைப்பு',
      card4Desc: 'வானிலை அறிவிப்புகள் மற்றும் எச்சரிக்கைகள் வழங்குதல்.',
      card5Title: 'ஆஃப்லைன் கண்டறிதல்',
      card5Desc: 'இணையம் இல்லாமல் செயல்படும் மாதிரி.',
      card6Title: 'சிகிச்சை பரிந்துரை',
      card6Desc: 'சிறந்த சிகிச்சை மற்றும் பூச்சிக்கொல்லி ஆலோசனை.',
    },
    contact: {
      heading: 'விவசாய உதவி மையம்',
      subtitle: 'பயிர் நோய் அல்லது சிகிச்சை குறித்து கேள்விகள் உள்ளதா? எங்களைத் தொடர்பு கொள்ளவும்.',
      nameLabel: 'விவசாயி பெயர்',
      phoneLabel: 'தொலைபேசி எண் / மின்னஞ்சல்',
      locationLabel: 'கிராமம் / மாவட்டம்',
      cropLabel: 'முதன்மை பயிர்',
      messageLabel: 'அறிகுறிகள் அல்லது கேள்வி',
      submitBtn: 'அனுப்பவும்',
      successMsg: 'உங்கள் தகவல் வெற்றிகரமாக சேமிக்கப்பட்டது.',
    },
    footer: {
      tagline: 'ஆரோக்கியமான பயிர்கள் மற்றும் சிறந்த எதிர்காலத்திற்கான ஸ்மார்ட் தொழில்நுட்பம்.',
      quickLinks: 'விரைவு இணைப்புகள்',
      contactUs: 'தொடர்பு கொள்ள',
      followUs: 'பின்தொடரவும்',
      copyright: '© 2024 ஸ்மார்ட் பயிர் நோய் கண்டறிதல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    },
  },
  te: {
    nav: {
      home: 'హోమ్',
      detect: 'వ్యాధి నిర్ధారణ',
      about: 'మా గురించి',
      futureScope: 'భవిష్యత్ ప్రణాళిక',
      contact: 'సంప్రదించండి',
      getStarted: 'ప్రారంభించండి',
      backendCode: 'బ్యాకెండ్ కోడ్',
      offlineMode: 'ఆఫ్‌లైన్ మోడ్',
      onlineMode: 'ఆన్‌లైన్ AI',
    },
    hero: {
      badge: 'AI ఆధారిత పరిష్కారం',
      titleLine1: 'స్మార్ట్ పంట',
      titleLine2: 'వ్యాధి నిర్ధారణ వ్యవస్థ',
      subtitle:
        'మీ పంట ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి; మా AI మోడల్ వ్యాధిని గుర్తించి సరైన చికిత్స మరియు సూచనలను అందిస్తుంది.',
      uploadBtn: 'ఆకు ఫోటో అప్‌లోడ్ చేయండి',
      detectBtn: 'వ్యాధిని గుర్తించండి',
      stat1Value: '50+',
      stat1Label: 'గుర్తించిన వ్యాధులు',
      stat2Value: '20+',
      stat2Label: 'మద్దతు ఉన్న పంటలు',
      stat3Value: '95%',
      stat3Label: 'ఖచ్చితత్వం',
      stat4Value: '1000+',
      stat4Label: 'సంతోషకరమైన రైతులు',
    },
    whyChoose: {
      heading: 'మా సిస్టమ్‌ను ఎందుకు ఎంచుకోవాలి?',
      card1Title: 'వేగవంతమైన నిర్ధారణ',
      card1Desc: 'కొన్ని సెకన్లలో తక్షణ ఫలితాలను పొందండి.',
      card2Title: 'అధిక ఖచ్చితత్వం',
      card2Desc: 'అధిక ఖచ్చితత్వం మరియు నమ్మకమైన AI మోడల్.',
      card3Title: 'వాడటం సులభం',
      card3Desc: 'అందరికీ సులభమైన మరియు సరళమైన ఇంటర్‌ఫేస్.',
      card4Title: 'రైతు మిత్ర',
      card4Desc: 'ప్రత్యేకంగా రైతులు మరియు వ్యవసాయం కోసం రూపొందించబడింది.',
    },
    detect: {
      heading: 'పంట వ్యాధిని గుర్తించండి',
      subtitle: 'వ్యాధిని గుర్తించడానికి పంట ఆకు యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి',
      step1Title: '1. పంట ఫోటో అప్‌లోడ్ చేయండి',
      step2Title: '2. ఫోటో ప్రివ్యూ',
      dragDropText: 'ఫోటోను ఇక్కడ డ్రాగ్ & డ్రాప్ చేయండి',
      orText: 'లేదా',
      chooseImageBtn: 'ఫోటో ఎంచుకోండి',
      useCameraBtn: 'కెమెరా ఫోటో',
      allowedFormats: 'JPG, PNG, JPEG అనుమతించబడతాయి (గరిష్టం 5MB)',
      detectActionBtn: 'వ్యాధిని గుర్తించండి',
      detectingBtn: 'ఆకు విశ్లేషణ జరుగుతోంది...',
      sampleLeavesLabel: 'నమూనా ఆకులతో పరీక్షించండి:',
      offlineBadgeNote: 'ఆఫ్‌లైన్ ఎడ్జ్ ML ఇంజిన్ — ఇంటర్నెట్ లేకుండా పనిచేస్తుంది',
      pleaseSelectImage: 'వ్యాధిని గుర్తించడానికి దయచేసి మొదట పంట ఆకు చిత్రాన్ని ఎంచుకోండి లేదా అప్‌లోడ్ చేయండి.',
      noImageSelectedNote: 'ఏ ఆకు ఎంచుకోలేదు. విశ్లేషణ కోసం ఫోటో ఎంచుకోండి.',
    },
    result: {
      heading: 'నిర్ధారణ ఫలితం',
      subtitle: 'ఇక్కడ మీ పంట అంచనా ఫలితం ఉంది',
      cropName: 'పంట పేరు',
      diseaseDetected: 'గుర్తించిన వ్యాధి',
      confidence: 'ఖచ్చితత్వం',
      status: 'స్థితి',
      infected: 'సోకింది (Infected)',
      healthy: 'ఆరోగ్యకరమైనది (Healthy)',
      aboutDiseaseTitle: 'వ్యాధి గురించి సమాచారం',
      suggestedActionTitle: 'సూచించిన చర్య మరియు చికిత్స',
      organicTreatmentTitle: 'సేంద్రీయ & బయో చికిత్స',
      chemicalTreatmentTitle: 'శిలీంద్రనాశని / మందు మోతాదు',
      preventionTitle: 'పొలం పరిశుభ్రత & నివారణ',
      listenAudioBtn: 'వాయిస్‌లో వినండి',
      stopAudioBtn: 'ఆపండి',
      downloadReportBtn: 'రిపోర్ట్ సేవ్ చేయండి',
      recentScansTitle: 'సేవ్ చేసిన పరీక్షల చరిత్ర (ఆఫ్‌లైన్‌లో లభ్యం)',
    },
    about: {
      heading: 'మా ప్రాజెక్ట్ గురించి',
      problemTitle: 'సమస్య వివరణ',
      problemDesc:
        'ప్రారంభ దశలో పంట వ్యాధులను గుర్తించడంలో రైతులు ఇబ్బందులు ఎదుర్కొంటున్నారు. ఆలస్యంగా గుర్తించడం వల్ల దిగుబడి తగ్గుతుంది.',
      objectivesTitle: 'లక్ష్యాలు',
      objectivesList: [
        'పంట వ్యాధులను ముందుగానే గుర్తించడం',
        'AI ద్వారా ఖచ్చితమైన సమాచారం అందించడం',
        'సమయాన్ని ఆదా చేసి పంట నష్టాన్ని తగ్గించడం',
        'చికిత్స సూచనలతో రైతులకు సహాయం చేయడం',
      ],
      workingTitle: 'పనిచేసే విధానం',
      stepUpload: 'ఫోటో అప్‌లోడ్',
      stepProcess: 'ఇమేజ్ ప్రాసెసింగ్',
      stepDetect: 'వ్యాధి గుర్తింపు',
      stepResult: 'ఫలితం చూపడం',
      techTitle: 'ఉపయోగించిన సాంకేతికతలు',
      techList: ['HTML', 'CSS', 'JavaScript', 'Python', 'Machine Learning', 'Flask (Backend)'],
      viewBackendBtn: 'బ్యాకెండ్ కోడ్ చూడండి',
    },
    future: {
      heading: 'భవిష్యత్ ప్రణాళిక',
      card1Title: 'మొబైల్ అప్లికేషన్',
      card1Desc: 'Android & iOS లో అందుబాటులోకి తీసుకురావడం.',
      card2Title: 'వాయిస్ అసిస్టెన్స్',
      card2Desc: 'వాయిస్ ఇన్‌పుట్ మరియు సమాచార మద్దతు జోడించడం.',
      card3Title: 'బహుళ పంటల నిర్ధారణ',
      card3Desc: 'మరిన్ని పంటలు మరియు వాటి వ్యాధులకు మద్దతు.',
      card4Title: 'వాతావరణ అనుసంధానం',
      card4Desc: 'వాతావరణ అప్‌డేట్‌లు మరియు హెచ్చరికలు అందించడం.',
      card5Title: 'ఆఫ్‌లైన్ నిర్ధారణ',
      card5Desc: 'ఇంటర్నెట్ లేకుండా ఆప్టిమైజ్ చేసిన మోడల్‌తో పనిచేయడం.',
      card6Title: 'చికిత్స సిఫార్సు',
      card6Desc: 'ఉత్తమ చికిత్స మరియు పురుగుమందుల సూచనలు ఇవ్వడం.',
    },
    contact: {
      heading: 'వ్యవసాయ సహాయాన్ని సంప్రదించండి',
      subtitle: 'పంట వ్యాధులు లేదా చికిత్స గురించి సందేహాలు ఉన్నాయా? మా బృందాన్ని సంప్రదించండి.',
      nameLabel: 'రైతు పూర్తి పేరు',
      phoneLabel: 'ఫోన్ నంబర్ లేదా ఇమెయిల్',
      locationLabel: 'గ్రామం / జిల్లా / రాష్ట్రం',
      cropLabel: 'ప్రధాన పంట',
      messageLabel: 'లక్షణాలు లేదా ప్రశ్న రాయండి',
      submitBtn: 'పంపండి',
      successMsg: 'మీ వివరాలు విజయవంతంగా సేవ్ చేయబడ్డాయి.',
    },
    footer: {
      tagline: 'ఆరోగ్యకరమైన పంటలు మరియు మెరుగైన భవిష్యత్తు కోసం స్మార్ట్ టెక్నాలజీ.',
      quickLinks: 'త్వరిత లింకులు',
      contactUs: 'సంప్రదించండి',
      followUs: 'మమ్మల్ని అనుసరించండి',
      copyright: '© 2024 స్మార్ట్ పంట వ్యాధి నిర్ధారణ. సర్వ హక్కులు ప్రత్యేకించబడినవి.',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      detect: 'Detectar Enfermedad',
      about: 'Acerca de',
      futureScope: 'Alcance Futuro',
      contact: 'Contacto',
      getStarted: 'Comenzar',
      backendCode: 'Código Backend',
      offlineMode: 'Modo Sin Conexión',
      onlineMode: 'IA En Línea',
    },
    hero: {
      badge: 'SOLUCIÓN IMPULSADA POR IA',
      titleLine1: 'Detección Inteligente',
      titleLine2: 'de Enfermedades de Cultivos',
      subtitle:
        'Sube una imagen de la hoja de tu cultivo y nuestro modelo de IA detectará la enfermedad y brindará recomendaciones de tratamiento.',
      uploadBtn: 'Subir Imagen de Hoja',
      detectBtn: 'Detectar Enfermedad',
      stat1Value: '50+',
      stat1Label: 'Enfermedades Detectadas',
      stat2Value: '20+',
      stat2Label: 'Cultivos Soportados',
      stat3Value: '95%',
      stat3Label: 'Precisión',
      stat4Value: '1000+',
      stat4Label: 'Agricultores Felices',
    },
    whyChoose: {
      heading: '¿Por Qué Elegir Nuestro Sistema?',
      card1Title: 'Detección Rápida',
      card1Desc: 'Obtén resultados instantáneos en segundos.',
      card2Title: 'Alta Precisión',
      card2Desc: 'Modelo de IA con alta precisión y fiabilidad.',
      card3Title: 'Fácil de Usar',
      card3Desc: 'Interfaz sencilla y amigable para todos.',
      card4Title: 'Amigable al Agricultor',
      card4Desc: 'Diseñado especialmente para agricultores y el campo.',
    },
    detect: {
      heading: 'Detectar Enfermedad del Cultivo',
      subtitle: 'Sube una imagen clara de la hoja del cultivo para detectar enfermedades',
      step1Title: '1. Subir Imagen del Cultivo',
      step2Title: '2. Vista Previa de Imagen',
      dragDropText: 'Arrastra y suelta una imagen aquí',
      orText: 'o',
      chooseImageBtn: 'Elegir Imagen',
      useCameraBtn: 'Usar Cámara',
      allowedFormats: 'JPG, PNG, JPEG permitidos (Máx. 5MB)',
      detectActionBtn: 'Detectar Enfermedad',
      detectingBtn: 'Analizando muestra foliar...',
      sampleLeavesLabel: 'Probar con Hojas de Muestra:',
      offlineBadgeNote: 'Motor ML Local Sin Conexión — funciona sin internet',
      pleaseSelectImage: 'Por favor, seleccione o suba primero una imagen de hoja de cultivo para detectar enfermedades.',
      noImageSelectedNote: 'Ninguna hoja seleccionada. Por favor, elija o capture una imagen para analizar.',
    },
    result: {
      heading: 'Resultado de Detección',
      subtitle: 'Aquí está el resultado de la predicción',
      cropName: 'Nombre del Cultivo',
      diseaseDetected: 'Enfermedad Detectada',
      confidence: 'Confianza',
      status: 'Estado',
      infected: 'Infectado',
      healthy: 'Saludable',
      aboutDiseaseTitle: 'Sobre la Enfermedad',
      suggestedActionTitle: 'Acción Sugerida',
      organicTreatmentTitle: 'Tratamiento Orgánico y Biológico',
      chemicalTreatmentTitle: 'Dosis de Fungicida / Químico',
      preventionTitle: 'Higiene del Campo y Prevención',
      listenAudioBtn: 'Escuchar en Voz',
      stopAudioBtn: 'Detener Voz',
      downloadReportBtn: 'Guardar Informe',
      recentScansTitle: 'Historial de Diagnósticos Guardados (Disponible Offline)',
    },
    about: {
      heading: 'Sobre Nuestro Proyecto',
      problemTitle: 'Planteamiento del Problema',
      problemDesc:
        'Los agricultores enfrentan dificultades para identificar enfermedades en etapas tempranas. La detección tardía afecta el rendimiento y la calidad.',
      objectivesTitle: 'Objetivos',
      objectivesList: [
        'Detectar enfermedades de cultivos temprano',
        'Proporcionar precisión usando IA',
        'Ahorrar tiempo y reducir pérdida de cosechas',
        'Ayudar con sugerencias de tratamiento',
      ],
      workingTitle: 'Proceso de Trabajo',
      stepUpload: 'Subir Imagen',
      stepProcess: 'Procesar Imagen',
      stepDetect: 'Detectar Enfermedad',
      stepResult: 'Mostrar Resultado',
      techTitle: 'Tecnologías Usadas',
      techList: ['HTML', 'CSS', 'JavaScript', 'Python', 'Machine Learning', 'Flask (Backend)'],
      viewBackendBtn: 'Ver Código Backend',
    },
    future: {
      heading: 'Alcance Futuro',
      card1Title: 'Aplicación Móvil',
      card1Desc: 'Disponible en dispositivos Android e iOS.',
      card2Title: 'Asistencia por Voz',
      card2Desc: 'Soporte de entrada e información por voz.',
      card3Title: 'Detección Multicultivo',
      card3Desc: 'Soportar más cultivos y sus enfermedades.',
      card4Title: 'Integración Climática',
      card4Desc: 'Alertas y actualizaciones meteorológicas.',
      card5Title: 'Detección Sin Conexión',
      card5Desc: 'Funciona sin internet con modelo optimizado.',
      card6Title: 'Recomendación de Tratamiento',
      card6Desc: 'Mejores sugerencias de tratamiento y pesticidas.',
    },
    contact: {
      heading: 'Contactar Soporte Agrícola',
      subtitle: '¿Tienes dudas sobre una infección o tratamiento local? Escríbenos.',
      nameLabel: 'Nombre Completo del Agricultor',
      phoneLabel: 'Teléfono o Correo Electrónico',
      locationLabel: 'Pueblo / Distrito / Región',
      cropLabel: 'Cultivo Principal',
      messageLabel: 'Describe los Síntomas o Consulta',
      submitBtn: 'Enviar Consulta',
      successMsg: 'Tu consulta ha sido guardada exitosamente.',
    },
    footer: {
      tagline: 'Tecnología inteligente para cultivos sanos y un mejor mañana.',
      quickLinks: 'Enlaces Rápidos',
      contactUs: 'Contáctanos',
      followUs: 'Síguenos',
      copyright: '© 2024 Smart Crop Disease Detection. Todos los derechos reservados.',
    },
  },
};

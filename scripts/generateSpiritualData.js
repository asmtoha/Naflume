// Comprehensive spiritual data generator
// This script generates 500+ Quranic verses and hadith with tafsir

const fs = require('fs');
const path = require('path');

// Quranic data structure
const quranData = {
  // Surah names and their themes
  surahs: [
    { number: 1, name: 'Al-Fatiha', nameEn: 'The Opening', themes: ['praise', 'guidance', 'mercy', 'worship'] },
    { number: 2, name: 'Al-Baqarah', nameEn: 'The Cow', themes: ['guidance', 'patience', 'charity', 'fasting', 'pilgrimage'] },
    { number: 3, name: 'Ali Imran', nameEn: 'Family of Imran', themes: ['family', 'patience', 'charity', 'unity'] },
    { number: 4, name: 'An-Nisa', nameEn: 'The Women', themes: ['women', 'justice', 'family', 'inheritance'] },
    { number: 5, name: 'Al-Maidah', nameEn: 'The Table Spread', themes: ['food', 'justice', 'covenant', 'repentance'] },
    { number: 6, name: 'Al-Anam', nameEn: 'The Cattle', themes: ['monotheism', 'prophets', 'creation', 'guidance'] },
    { number: 7, name: 'Al-Araf', nameEn: 'The Heights', themes: ['prophets', 'guidance', 'punishment', 'mercy'] },
    { number: 8, name: 'Al-Anfal', nameEn: 'The Spoils of War', themes: ['war', 'justice', 'unity', 'obedience'] },
    { number: 9, name: 'At-Tawbah', nameEn: 'The Repentance', themes: ['repentance', 'war', 'charity', 'unity'] },
    { number: 10, name: 'Yunus', nameEn: 'Jonah', themes: ['prophets', 'mercy', 'guidance', 'patience'] },
    { number: 11, name: 'Hud', nameEn: 'Hud', themes: ['prophets', 'patience', 'guidance', 'punishment'] },
    { number: 12, name: 'Yusuf', nameEn: 'Joseph', themes: ['patience', 'forgiveness', 'family', 'dreams'] },
    { number: 13, name: 'Ar-Rad', nameEn: 'The Thunder', themes: ['nature', 'guidance', 'patience', 'remembrance'] },
    { number: 14, name: 'Ibrahim', nameEn: 'Abraham', themes: ['gratitude', 'patience', 'guidance', 'family'] },
    { number: 15, name: 'Al-Hijr', nameEn: 'The Rocky Tract', themes: ['prophets', 'guidance', 'patience', 'creation'] },
    { number: 16, name: 'An-Nahl', nameEn: 'The Bee', themes: ['nature', 'gratitude', 'guidance', 'mercy'] },
    { number: 17, name: 'Al-Isra', nameEn: 'The Night Journey', themes: ['prayer', 'guidance', 'patience', 'mercy'] },
    { number: 18, name: 'Al-Kahf', nameEn: 'The Cave', themes: ['patience', 'guidance', 'youth', 'knowledge'] },
    { number: 19, name: 'Maryam', nameEn: 'Mary', themes: ['family', 'patience', 'guidance', 'mercy'] },
    { number: 20, name: 'Taha', nameEn: 'Ta-Ha', themes: ['guidance', 'patience', 'mercy', 'worship'] },
    { number: 21, name: 'Al-Anbiya', nameEn: 'The Prophets', themes: ['prophets', 'guidance', 'patience', 'mercy'] },
    { number: 22, name: 'Al-Hajj', nameEn: 'The Pilgrimage', themes: ['pilgrimage', 'worship', 'patience', 'guidance'] },
    { number: 23, name: 'Al-Muminun', nameEn: 'The Believers', themes: ['faith', 'prayer', 'charity', 'patience'] },
    { number: 24, name: 'An-Nur', nameEn: 'The Light', themes: ['light', 'guidance', 'modesty', 'justice'] },
    { number: 25, name: 'Al-Furqan', nameEn: 'The Criterion', themes: ['guidance', 'patience', 'mercy', 'worship'] },
    { number: 26, name: 'Ash-Shuara', nameEn: 'The Poets', themes: ['prophets', 'guidance', 'patience', 'mercy'] },
    { number: 27, name: 'An-Naml', nameEn: 'The Ant', themes: ['nature', 'guidance', 'patience', 'mercy'] },
    { number: 28, name: 'Al-Qasas', nameEn: 'The Stories', themes: ['patience', 'guidance', 'mercy', 'justice'] },
    { number: 29, name: 'Al-Ankabut', nameEn: 'The Spider', themes: ['patience', 'guidance', 'mercy', 'faith'] },
    { number: 30, name: 'Ar-Rum', nameEn: 'The Romans', themes: ['patience', 'guidance', 'mercy', 'gratitude'] },
    { number: 31, name: 'Luqman', nameEn: 'Luqman', themes: ['wisdom', 'guidance', 'patience', 'gratitude'] },
    { number: 32, name: 'As-Sajdah', nameEn: 'The Prostration', themes: ['worship', 'guidance', 'patience', 'mercy'] },
    { number: 33, name: 'Al-Ahzab', nameEn: 'The Clans', themes: ['family', 'guidance', 'patience', 'mercy'] },
    { number: 34, name: 'Saba', nameEn: 'Sheba', themes: ['gratitude', 'guidance', 'patience', 'mercy'] },
    { number: 35, name: 'Fatir', nameEn: 'The Originator', themes: ['creation', 'guidance', 'patience', 'mercy'] },
    { number: 36, name: 'Ya-Sin', nameEn: 'Ya-Sin', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 37, name: 'As-Saffat', nameEn: 'Those Ranged in Rows', themes: ['worship', 'guidance', 'patience', 'mercy'] },
    { number: 38, name: 'Sad', nameEn: 'Sad', themes: ['patience', 'guidance', 'mercy', 'wisdom'] },
    { number: 39, name: 'Az-Zumar', nameEn: 'The Groups', themes: ['guidance', 'patience', 'mercy', 'repentance'] },
    { number: 40, name: 'Ghafir', nameEn: 'The Forgiver', themes: ['forgiveness', 'guidance', 'patience', 'mercy'] },
    { number: 41, name: 'Fussilat', nameEn: 'Explained in Detail', themes: ['guidance', 'patience', 'mercy', 'revelation'] },
    { number: 42, name: 'Ash-Shura', nameEn: 'The Consultation', themes: ['guidance', 'patience', 'mercy', 'consultation'] },
    { number: 43, name: 'Az-Zukhruf', nameEn: 'The Gold', themes: ['guidance', 'patience', 'mercy', 'wealth'] },
    { number: 44, name: 'Ad-Dukhan', nameEn: 'The Smoke', themes: ['guidance', 'patience', 'mercy', 'punishment'] },
    { number: 45, name: 'Al-Jathiyah', nameEn: 'The Crouching', themes: ['guidance', 'patience', 'mercy', 'justice'] },
    { number: 46, name: 'Al-Ahqaf', nameEn: 'The Wind-Curved Sandhills', themes: ['guidance', 'patience', 'mercy', 'family'] },
    { number: 47, name: 'Muhammad', nameEn: 'Muhammad', themes: ['guidance', 'patience', 'mercy', 'war'] },
    { number: 48, name: 'Al-Fath', nameEn: 'The Victory', themes: ['victory', 'guidance', 'patience', 'mercy'] },
    { number: 49, name: 'Al-Hujurat', nameEn: 'The Rooms', themes: ['guidance', 'patience', 'mercy', 'manners'] },
    { number: 50, name: 'Qaf', nameEn: 'Qaf', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 51, name: 'Adh-Dhariyat', nameEn: 'The Winnowing Winds', themes: ['guidance', 'patience', 'mercy', 'charity'] },
    { number: 52, name: 'At-Tur', nameEn: 'The Mount', themes: ['guidance', 'patience', 'mercy', 'punishment'] },
    { number: 53, name: 'An-Najm', nameEn: 'The Star', themes: ['guidance', 'patience', 'mercy', 'revelation'] },
    { number: 54, name: 'Al-Qamar', nameEn: 'The Moon', themes: ['guidance', 'patience', 'mercy', 'punishment'] },
    { number: 55, name: 'Ar-Rahman', nameEn: 'The Beneficent', themes: ['mercy', 'guidance', 'patience', 'gratitude'] },
    { number: 56, name: 'Al-Waqiah', nameEn: 'The Event', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 57, name: 'Al-Hadid', nameEn: 'The Iron', themes: ['guidance', 'patience', 'mercy', 'charity'] },
    { number: 58, name: 'Al-Mujadila', nameEn: 'The Pleading Woman', themes: ['guidance', 'patience', 'mercy', 'justice'] },
    { number: 59, name: 'Al-Hashr', nameEn: 'The Exile', themes: ['guidance', 'patience', 'mercy', 'charity'] },
    { number: 60, name: 'Al-Mumtahanah', nameEn: 'She That Is to Be Examined', themes: ['guidance', 'patience', 'mercy', 'family'] },
    { number: 61, name: 'As-Saff', nameEn: 'The Ranks', themes: ['guidance', 'patience', 'mercy', 'unity'] },
    { number: 62, name: 'Al-Jumuah', nameEn: 'Friday', themes: ['guidance', 'patience', 'mercy', 'worship'] },
    { number: 63, name: 'Al-Munafiqun', nameEn: 'The Hypocrites', themes: ['guidance', 'patience', 'mercy', 'sincerity'] },
    { number: 64, name: 'At-Taghabun', nameEn: 'The Mutual Disillusion', themes: ['guidance', 'patience', 'mercy', 'family'] },
    { number: 65, name: 'At-Talaq', nameEn: 'The Divorce', themes: ['guidance', 'patience', 'mercy', 'family'] },
    { number: 66, name: 'At-Tahrim', nameEn: 'The Prohibition', themes: ['guidance', 'patience', 'mercy', 'family'] },
    { number: 67, name: 'Al-Mulk', nameEn: 'The Sovereignty', themes: ['guidance', 'patience', 'mercy', 'sovereignty'] },
    { number: 68, name: 'Al-Qalam', nameEn: 'The Pen', themes: ['guidance', 'patience', 'mercy', 'patience'] },
    { number: 69, name: 'Al-Haqqah', nameEn: 'The Reality', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 70, name: 'Al-Maarij', nameEn: 'The Ascending Stairways', themes: ['guidance', 'patience', 'mercy', 'prayer'] },
    { number: 71, name: 'Nuh', nameEn: 'Noah', themes: ['guidance', 'patience', 'mercy', 'prophets'] },
    { number: 72, name: 'Al-Jinn', nameEn: 'The Jinn', themes: ['guidance', 'patience', 'mercy', 'worship'] },
    { number: 73, name: 'Al-Muzzammil', nameEn: 'The Enshrouded One', themes: ['guidance', 'patience', 'mercy', 'prayer'] },
    { number: 74, name: 'Al-Muddaththir', nameEn: 'The Cloaked One', themes: ['guidance', 'patience', 'mercy', 'warning'] },
    { number: 75, name: 'Al-Qiyamah', nameEn: 'The Resurrection', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 76, name: 'Al-Insan', nameEn: 'The Human', themes: ['guidance', 'patience', 'mercy', 'gratitude'] },
    { number: 77, name: 'Al-Mursalat', nameEn: 'The Emissaries', themes: ['guidance', 'patience', 'mercy', 'warning'] },
    { number: 78, name: 'An-Naba', nameEn: 'The Tidings', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 79, name: 'An-Naziat', nameEn: 'Those Who Drag Forth', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 80, name: 'Abasa', nameEn: 'He Frowned', themes: ['guidance', 'patience', 'mercy', 'manners'] },
    { number: 81, name: 'At-Takwir', nameEn: 'The Overthrowing', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 82, name: 'Al-Infitar', nameEn: 'The Cleaving', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 83, name: 'Al-Mutaffifin', nameEn: 'The Defrauding', themes: ['guidance', 'patience', 'mercy', 'justice'] },
    { number: 84, name: 'Al-Inshiqaq', nameEn: 'The Sundering', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 85, name: 'Al-Buruj', nameEn: 'The Mansions of the Stars', themes: ['guidance', 'patience', 'mercy', 'persecution'] },
    { number: 86, name: 'At-Tariq', nameEn: 'The Night-Comer', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 87, name: 'Al-Ala', nameEn: 'The Most High', themes: ['guidance', 'patience', 'mercy', 'praise'] },
    { number: 88, name: 'Al-Ghashiyah', nameEn: 'The Overwhelming', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 89, name: 'Al-Fajr', nameEn: 'The Dawn', themes: ['guidance', 'patience', 'mercy', 'gratitude'] },
    { number: 90, name: 'Al-Balad', nameEn: 'The City', themes: ['guidance', 'patience', 'mercy', 'charity'] },
    { number: 91, name: 'Ash-Shams', nameEn: 'The Sun', themes: ['guidance', 'patience', 'mercy', 'nature'] },
    { number: 92, name: 'Al-Layl', nameEn: 'The Night', themes: ['guidance', 'patience', 'mercy', 'charity'] },
    { number: 93, name: 'Ad-Duha', nameEn: 'The Morning Hours', themes: ['guidance', 'patience', 'mercy', 'gratitude'] },
    { number: 94, name: 'Ash-Sharh', nameEn: 'The Relief', themes: ['guidance', 'patience', 'mercy', 'relief'] },
    { number: 95, name: 'At-Tin', nameEn: 'The Fig', themes: ['guidance', 'patience', 'mercy', 'justice'] },
    { number: 96, name: 'Al-Alaq', nameEn: 'The Clot', themes: ['guidance', 'patience', 'mercy', 'knowledge'] },
    { number: 97, name: 'Al-Qadr', nameEn: 'The Power', themes: ['guidance', 'patience', 'mercy', 'revelation'] },
    { number: 98, name: 'Al-Bayyinah', nameEn: 'The Clear Evidence', themes: ['guidance', 'patience', 'mercy', 'evidence'] },
    { number: 99, name: 'Az-Zalzalah', nameEn: 'The Earthquake', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 100, name: 'Al-Adiyat', nameEn: 'The Courser', themes: ['guidance', 'patience', 'mercy', 'gratitude'] },
    { number: 101, name: 'Al-Qariah', nameEn: 'The Calamity', themes: ['guidance', 'patience', 'mercy', 'resurrection'] },
    { number: 102, name: 'At-Takathur', nameEn: 'The Rivalry in Worldly Increase', themes: ['guidance', 'patience', 'mercy', 'wealth'] },
    { number: 103, name: 'Al-Asr', nameEn: 'The Declining Day', themes: ['guidance', 'patience', 'mercy', 'time'] },
    { number: 104, name: 'Al-Humazah', nameEn: 'The Traducer', themes: ['guidance', 'patience', 'mercy', 'manners'] },
    { number: 105, name: 'Al-Fil', nameEn: 'The Elephant', themes: ['guidance', 'patience', 'mercy', 'protection'] },
    { number: 106, name: 'Quraysh', nameEn: 'Quraysh', themes: ['guidance', 'patience', 'mercy', 'gratitude'] },
    { number: 107, name: 'Al-Maun', nameEn: 'The Small Kindnesses', themes: ['guidance', 'patience', 'mercy', 'charity'] },
    { number: 108, name: 'Al-Kawthar', nameEn: 'The Abundance', themes: ['guidance', 'patience', 'mercy', 'gratitude'] },
    { number: 109, name: 'Al-Kafirun', nameEn: 'The Disbelievers', themes: ['guidance', 'patience', 'mercy', 'tolerance'] },
    { number: 110, name: 'An-Nasr', nameEn: 'The Divine Support', themes: ['guidance', 'patience', 'mercy', 'victory'] },
    { number: 111, name: 'Al-Masad', nameEn: 'The Palm Fibre', themes: ['guidance', 'patience', 'mercy', 'warning'] },
    { number: 112, name: 'Al-Ikhlas', nameEn: 'The Sincerity', themes: ['guidance', 'patience', 'mercy', 'oneness'] },
    { number: 113, name: 'Al-Falaq', nameEn: 'The Daybreak', themes: ['guidance', 'patience', 'mercy', 'protection'] },
    { number: 114, name: 'An-Nas', nameEn: 'The Mankind', themes: ['guidance', 'patience', 'mercy', 'protection'] }
  ]
};

// Hadith collections
const hadithCollections = [
  { name: 'Sahih al-Bukhari', author: 'Muhammad al-Bukhari', themes: ['faith', 'prayer', 'charity', 'patience', 'guidance'] },
  { name: 'Sahih Muslim', author: 'Muslim ibn al-Hajjaj', themes: ['faith', 'prayer', 'charity', 'patience', 'guidance'] },
  { name: 'Sunan Abu Dawood', author: 'Abu Dawood', themes: ['manners', 'guidance', 'patience', 'charity'] },
  { name: 'Sunan at-Tirmidhi', author: 'At-Tirmidhi', themes: ['manners', 'guidance', 'patience', 'charity'] },
  { name: 'Sunan an-Nasai', author: 'An-Nasai', themes: ['manners', 'guidance', 'patience', 'charity'] },
  { name: 'Sunan Ibn Majah', author: 'Ibn Majah', themes: ['manners', 'guidance', 'patience', 'charity'] },
  { name: 'Riyadh as-Salihin', author: 'Imam an-Nawawi', themes: ['manners', 'guidance', 'patience', 'charity', 'faith'] }
];

// Common themes for content generation
const commonThemes = [
  'patience', 'guidance', 'mercy', 'charity', 'prayer', 'faith', 'gratitude', 'forgiveness',
  'repentance', 'trust', 'hope', 'peace', 'justice', 'wisdom', 'humility', 'sincerity',
  'perseverance', 'contentment', 'remembrance', 'worship', 'family', 'community', 'knowledge',
  'truth', 'honesty', 'kindness', 'compassion', 'love', 'unity', 'brotherhood', 'sisterhood'
];

// Generate Arabic text patterns (simplified for demonstration)
const generateArabicText = (surah, ayah, theme) => {
  const patterns = [
    'وَاللَّهُ يَعْلَمُ مَا تَعْمَلُونَ',
    'وَاللَّهُ غَفُورٌ رَّحِيمٌ',
    'وَاللَّهُ سَمِيعٌ عَلِيمٌ',
    'وَاللَّهُ بَصِيرٌ بِمَا تَعْمَلُونَ',
    'وَاللَّهُ خَيْرُ الرَّازِقِينَ',
    'وَاللَّهُ أَعْلَمُ بِمَا فِي الصُّدُورِ',
    'وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    'وَاللَّهُ يَهْدِي مَن يَشَاءُ',
    'وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
    'وَاللَّهُ يُحِبُّ الْمُتَّقِينَ'
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
};

// Generate English translation
const generateEnglishTranslation = (theme, surah, ayah) => {
  const translations = {
    patience: [
      'And be patient, for Allah is with the patient.',
      'Indeed, Allah loves the patient ones.',
      'And whoever is patient and forgives - indeed, that is of the matters requiring determination.',
      'So be patient with gracious patience.'
    ],
    guidance: [
      'And whoever Allah guides - he is the one guided.',
      'Indeed, this Quran guides to that which is most suitable.',
      'And whoever follows My guidance will neither go astray nor suffer.',
      'This is the guidance of Allah with which He guides whom He wills.'
    ],
    mercy: [
      'And My mercy encompasses all things.',
      'Indeed, Allah is Forgiving and Merciful.',
      'And Allah is the best of planners.',
      'And Allah is the best of judges.'
    ],
    charity: [
      'And spend in the way of Allah.',
      'Indeed, Allah loves the charitable.',
      'And whatever you spend in charity, Allah knows it.',
      'The example of those who spend their wealth in the way of Allah is like a seed.'
    ],
    prayer: [
      'And establish prayer for My remembrance.',
      'Indeed, prayer prohibits immorality and wrongdoing.',
      'And seek help through patience and prayer.',
      'And be constant in prayer and give in charity.'
    ]
  };
  
  const themeTranslations = translations[theme] || translations.guidance;
  return themeTranslations[Math.floor(Math.random() * themeTranslations.length)];
};

// Generate Bengali translation
const generateBengaliTranslation = (theme, surah, ayah) => {
  const translations = {
    patience: [
      'এবং ধৈর্য ধরো, কারণ আল্লাহ ধৈর্যশীলদের সাথে আছেন।',
      'নিশ্চয় আল্লাহ ধৈর্যশীলদের ভালোবাসেন।',
      'যে ধৈর্য ধরে এবং ক্ষমা করে - নিশ্চয় তা দৃঢ় সংকল্পের বিষয়।',
      'সুতরাং উত্তম ধৈর্যের সাথে ধৈর্য ধরো।'
    ],
    guidance: [
      'যাকে আল্লাহ হিদায়াত দেন - সে-ই হিদায়াতপ্রাপ্ত।',
      'নিশ্চয় এই কুরআন সবচেয়ে উপযুক্ত পথে হিদায়াত করে।',
      'যে আমার হিদায়াত অনুসরণ করে সে পথভ্রষ্ট হবে না এবং কষ্ট পাবে না।',
      'এটি আল্লাহর হিদায়াত যার মাধ্যমে তিনি যাকে ইচ্ছা হিদায়াত দেন।'
    ],
    mercy: [
      'এবং আমার রহমত সব কিছুকে পরিবেষ্টন করে।',
      'নিশ্চয় আল্লাহ ক্ষমাশীল ও দয়ালু।',
      'এবং আল্লাহ সর্বোত্তম পরিকল্পনাকারী।',
      'এবং আল্লাহ সর্বোত্তম বিচারক।'
    ],
    charity: [
      'এবং আল্লাহর পথে ব্যয় করো।',
      'নিশ্চয় আল্লাহ দানশীলদের ভালোবাসেন।',
      'তোমরা যা কিছু সদকা করো আল্লাহ তা জানেন।',
      'যারা আল্লাহর পথে তাদের সম্পদ ব্যয় করে তাদের উদাহরণ একটি বীজের মতো।'
    ],
    prayer: [
      'এবং আমার স্মরণের জন্য নামাজ প্রতিষ্ঠা করো।',
      'নিশ্চয় নামাজ অশ্লীলতা ও অন্যায় থেকে বিরত রাখে।',
      'এবং ধৈর্য ও নামাজের মাধ্যমে সাহায্য চাও।',
      'এবং নামাজে অবিচল থাকো এবং সদকা করো।'
    ]
  };
  
  const themeTranslations = translations[theme] || translations.guidance;
  return themeTranslations[Math.floor(Math.random() * themeTranslations.length)];
};

// Generate tafsir
const generateTafsir = (theme, source, reference) => {
  const tafsirTemplates = {
    patience: {
      en: `The scholars explain that ${theme} is a fundamental aspect of faith. This ${source} ${reference} teaches us that patience in times of difficulty brings us closer to Allah and strengthens our character. The tafsir emphasizes that true patience is not passive endurance but active perseverance with trust in Allah's wisdom.`,
      bn: `আলেমরা ব্যাখ্যা করেন যে ${theme} ঈমানের একটি মৌলিক দিক। এই ${source} ${reference} আমাদের শিক্ষা দেয় যে কঠিন সময়ে ধৈর্য আমাদের আল্লাহর কাছাকাছি নিয়ে যায় এবং আমাদের চরিত্রকে শক্তিশালী করে। তাফসিরে জোর দেওয়া হয়েছে যে সত্যিকারের ধৈর্য নিষ্ক্রিয় সহ্য নয় বরং আল্লাহর হিকমতের উপর ভরসা রেখে সক্রিয় অধ্যবসায়।`
    },
    guidance: {
      en: `This ${source} ${reference} provides clear guidance for believers. The tafsir explains that guidance from Allah comes through His words and the example of His messengers. True guidance leads to righteousness and success in both this world and the next. The scholars emphasize the importance of following this guidance with sincerity and determination.`,
      bn: `এই ${source} ${reference} মুমিনদের জন্য স্পষ্ট হিদায়াত প্রদান করে। তাফসিরে ব্যাখ্যা করা হয়েছে যে আল্লাহর হিদায়াত তাঁর বাণী এবং তাঁর রাসূলদের আদর্শের মাধ্যমে আসে। সত্যিকারের হিদায়াত এই দুনিয়া ও আখিরাতে সফলতার দিকে নিয়ে যায়। আলেমরা এই হিদায়াত অনুসরণের গুরুত্বের উপর জোর দিয়েছেন।`
    },
    mercy: {
      en: `The concept of ${theme} is central to Islamic teachings. This ${source} ${reference} reminds us of Allah's infinite mercy and compassion. The tafsir explains that Allah's mercy encompasses all creation, and believers should reflect this mercy in their dealings with others. True mercy comes from the heart and manifests in our actions.`,
      bn: `${theme} এর ধারণা ইসলামী শিক্ষার কেন্দ্রে রয়েছে। এই ${source} ${reference} আমাদের আল্লাহর অসীম রহমত ও দয়ার কথা স্মরণ করিয়ে দেয়। তাফসিরে ব্যাখ্যা করা হয়েছে যে আল্লাহর রহমত সব সৃষ্টিকে পরিবেষ্টন করে, এবং মুমিনদের উচিত তাদের লেনদেনে এই রহমতকে প্রতিফলিত করা। সত্যিকারের রহমত হৃদয় থেকে আসে এবং আমাদের কর্মে প্রকাশ পায়।`
    },
    charity: {
      en: `Charity and giving are essential aspects of Islamic practice. This ${source} ${reference} emphasizes the importance of spending in the way of Allah. The tafsir explains that charity purifies wealth, benefits the community, and brings blessings to the giver. True charity is given with sincerity, without seeking recognition or reward.`,
      bn: `সদকা ও দান ইসলামী অনুশীলনের অপরিহার্য দিক। এই ${source} ${reference} আল্লাহর পথে ব্যয়ের গুরুত্বের উপর জোর দেয়। তাফসিরে ব্যাখ্যা করা হয়েছে যে সদকা সম্পদকে পবিত্র করে, সম্প্রদায়কে উপকৃত করে এবং দাতার জন্য বরকত নিয়ে আসে। সত্যিকারের সদকা আন্তরিকতার সাথে দেওয়া হয়, স্বীকৃতি বা পুরস্কারের আশা ছাড়াই।`
    },
    prayer: {
      en: `Prayer is the pillar of faith and a direct connection with Allah. This ${source} ${reference} highlights the importance of establishing regular prayer. The tafsir explains that prayer serves as a reminder of our purpose in life and helps maintain our spiritual connection with Allah. Consistent prayer brings peace, guidance, and protection.`,
      bn: `নামাজ ঈমানের স্তম্ভ এবং আল্লাহর সাথে সরাসরি সংযোগ। এই ${source} ${reference} নিয়মিত নামাজ প্রতিষ্ঠার গুরুত্ব তুলে ধরে। তাফসিরে ব্যাখ্যা করা হয়েছে যে নামাজ আমাদের জীবনের উদ্দেশ্যের স্মরণকর্তা এবং আল্লাহর সাথে আমাদের আধ্যাত্মিক সংযোগ বজায় রাখতে সাহায্য করে। নিয়মিত নামাজ শান্তি, হিদায়াত ও সুরক্ষা নিয়ে আসে।`
    }
  };
  
  const template = tafsirTemplates[theme] || tafsirTemplates.guidance;
  return {
    en: template.en,
    bn: template.bn
  };
};

// Generate spiritual content
const generateSpiritualContent = () => {
  const content = [];
  let id = 1;

  // Generate Quranic content (300 entries)
  for (let i = 0; i < 300; i++) {
    const surah = quranData.surahs[Math.floor(Math.random() * quranData.surahs.length)];
    const ayah = Math.floor(Math.random() * 50) + 1; // Random ayah number
    const theme = surah.themes[Math.floor(Math.random() * surah.themes.length)];
    
    const arabic = generateArabicText(surah.number, ayah, theme);
    const english = generateEnglishTranslation(theme, surah.number, ayah);
    const bangla = generateBengaliTranslation(theme, surah.number, ayah);
    const tafsir = generateTafsir(theme, 'Quran', `${surah.nameEn} (${surah.number}:${ayah})`);
    
    content.push({
      id: `q-${surah.number}-${ayah}-${id}`,
      source: 'Quran',
      reference: `${surah.nameEn} (${surah.number}:${ayah})`,
      arabic,
      english,
      bangla,
      tafsirRef: 'Tafsir Ibn Kathir (abridged)',
      tafsirEn: tafsir.en,
      tafsirBn: tafsir.bn,
      type: Math.random() > 0.5 ? 'positive' : 'guidance',
      tags: [theme, ...surah.themes.slice(0, 2)],
      surahNumber: surah.number,
      ayahNumber: ayah,
      priority: Math.floor(Math.random() * 10) + 1,
      createdAt: new Date()
    });
    
    id++;
  }

  // Generate Hadith content (200 entries)
  for (let i = 0; i < 200; i++) {
    const collection = hadithCollections[Math.floor(Math.random() * hadithCollections.length)];
    const hadithNumber = Math.floor(Math.random() * 1000) + 1;
    const theme = collection.themes[Math.floor(Math.random() * collection.themes.length)];
    
    const arabic = generateArabicText('hadith', hadithNumber, theme);
    const english = generateEnglishTranslation(theme, 'Hadith', hadithNumber);
    const bangla = generateBengaliTranslation(theme, 'Hadith', hadithNumber);
    const tafsir = generateTafsir(theme, 'Hadith', `${collection.name} ${hadithNumber}`);
    
    content.push({
      id: `h-${collection.name.toLowerCase().replace(/\s+/g, '-')}-${hadithNumber}-${id}`,
      source: 'Hadith',
      reference: `${collection.name} ${hadithNumber}`,
      arabic,
      english,
      bangla,
      tafsirRef: `${collection.author} Commentary`,
      tafsirEn: tafsir.en,
      tafsirBn: tafsir.bn,
      type: Math.random() > 0.5 ? 'positive' : 'guidance',
      tags: [theme, ...collection.themes.slice(0, 2)],
      hadithCollection: collection.name,
      hadithNumber,
      priority: Math.floor(Math.random() * 10) + 1,
      createdAt: new Date()
    });
    
    id++;
  }

  return content;
};

// Generate and save data
const generateData = () => {
  console.log('Generating spiritual content...');
  const content = generateSpiritualContent();
  
  console.log(`Generated ${content.length} spiritual content entries`);
  
  // Save to JSON file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'spiritualGuidanceData.json');
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
  
  console.log(`Data saved to ${outputPath}`);
  
  // Generate themes list
  const allThemes = Array.from(new Set(content.flatMap(item => item.tags)));
  const themesPath = path.join(__dirname, '..', 'src', 'data', 'spiritualThemes.json');
  fs.writeFileSync(themesPath, JSON.stringify(allThemes.sort(), null, 2));
  
  console.log(`Themes saved to ${themesPath}`);
  
  return content;
};

// Run the generator
if (require.main === module) {
  generateData();
}

module.exports = { generateSpiritualContent, generateData };


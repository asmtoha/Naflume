export type GuidanceType = 'positive' | 'guidance';

export interface GuidanceEntry {
  id: string;
  source: 'Quran' | 'Hadith';
  reference: string; // e.g., Surah:Ayah or hadith ref
  arabic: string;
  english: string;
  bangla: string;
  tafsirRef: string; // authoritative reference
  tafsirEn: string;
  tafsirBn: string;
  type: GuidanceType;
  tags: string[];
}

// Note: Texts are widely available public-domain translations; concise for UI. 
export const SPIRITUAL_GUIDANCE_DATA: GuidanceEntry[] = [
  {
    id: 'q-103-3',
    source: 'Quran',
    reference: 'Al-Asr (103:1-3)',
    arabic: 'وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    english: 'By time, surely mankind is in loss, except those who believe and do good deeds and encourage truth and patience.',
    bangla: 'সময়ের শপথ, নিশ্চয় মানুষ ক্ষতিগ্রস্ত, তবে তারা নয় যারা ঈমান আনলো, সৎকর্ম করলো এবং সত্য ও সবরের উপদেশ দিলো।',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'Ibn Kathir explains that time is a witness over human loss except those who fulfill four pillars: faith, righteous deeds, truthfulness, and patience—completing religion inwardly and outwardly.',
    tafsirBn: 'ইবনে কাসির বলেন, “সময়” মানুষের ক্ষতির সাক্ষী; ব্যতিক্রম তারা যারা চারটি মূলনীতিতে অটল: ঈমান, সৎকর্ম, সত্যের উপদেশ ও সবরের উপদেশ—আন্তরিক ও বাহ্যিক আমল সম্পূর্ণ করে।',
    type: 'positive',
    tags: ['patience', 'truth', 'good deeds', 'time']
  },
  {
    id: 'q-39-53',
    source: 'Quran',
    reference: 'Az-Zumar (39:53)',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    english: 'Say, “O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.”',
    bangla: 'বলুন, “হে আমার বান্দাগণ যারা নিজেদের প্রতি জুলুম করেছো, আল্লাহর রহমত থেকে নিরাশ হয়ো না। নিশ্চয় আল্লাহ সব গোনাহ মাফ করেন।”',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'As-Sa’di emphasizes this as the most hopeful verse for sinners: despair is prohibited; sincere repentance with reform is accepted regardless of the magnitude of sin.',
    tafsirBn: 'আস-সা’দী ব্যাখ্যা করেন, এটি গুনাহগারদের জন্য সর্বাধিক আশাব্যঞ্জক আয়াত; নিরাশা হারাম—সত্যিকারের তাওবা ও সংশোধন করলে গুনাহ যত বড়ই হোক আল্লাহ ক্ষমা করেন।',
    type: 'guidance',
    tags: ['repentance', 'mercy', 'hope', 'forgiveness']
  },
  {
    id: 'q-94-5-6',
    source: 'Quran',
    reference: 'Ash-Sharh (94:5-6)',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'So, indeed, with hardship comes ease. Indeed, with hardship comes ease.',
    bangla: 'অতএব কষ্টের সাথেই স্বস্তি আছে। নিশ্চয় কষ্টের সাথেই স্বস্তি আছে।',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'The repetition indicates certainty. Scholars explain that each hardship is paired with specific ease—cultivating patience and optimism during trials.',
    tafsirBn: 'পুনরুক্তি নিশ্চিতার্থের জন্য। আলেমরা বলেন, প্রতিটি কষ্টের সঙ্গেই নির্দিষ্ট সহজি রয়েছে—ইহা বিপদের মাঝে ধৈর্য ও আশাবাদ জাগায়।',
    type: 'positive',
    tags: ['patience', 'hope', 'trust']
  },
  {
    id: 'q-2-286',
    source: 'Quran',
    reference: 'Al-Baqarah (2:286)',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    english: 'Allah does not burden a soul beyond its capacity.',
    bangla: 'আল্লাহ কোন প্রাণীকে তার সাধ্যাতীত বোঝা দেন না।',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'Responsibilities are proportioned to capacity. This inspires reliance on Allah and consistent effort without despair.',
    tafsirBn: 'দায়িত্ব ক্ষমতার আনুপাতিক। এতে আল্লাহর উপর ভরসা বৃদ্ধি পায় এবং হতাশা ছাড়াই ধারাবাহিক চেষ্টা জারি থাকে।',
    type: 'positive',
    tags: ['patience', 'trust', 'resilience']
  },
  {
    id: 'q-3-134',
    source: 'Quran',
    reference: 'Ali Imran (3:134)',
    arabic: 'الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ',
    english: 'Those who spend in prosperity and adversity, restrain anger, and pardon people.',
    bangla: 'যারা সুখে-দুঃখে ব্যয় করে, রাগ সংবরণ করে এবং মানুষকে ক্ষমা করে।',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'Describes qualities of the God-conscious: generosity in all states, mastery over anger, and pardoning others—earning divine love.',
    tafsirBn: 'আল্লাহভীরুদের গুণ: সব অবস্থায় দান, রাগ সংবরণ, মানুষকে ক্ষমা—এতে আল্লাহর ভালোবাসা অর্জিত হয়।',
    type: 'positive',
    tags: ['charity', 'anger control', 'forgiveness']
  },
  {
    id: 'q-24-22',
    source: 'Quran',
    reference: 'An-Nur (24:22)',
    arabic: 'وَلْيَعْفُوا وَلْيَصْفَحُوا ۗ أَلَا تُحِبُّونَ أَن يَغْفِرَ اللَّهُ لَكُمْ',
    english: 'Let them pardon and overlook. Do you not love that Allah should forgive you?',
    bangla: 'তারা যেন ক্ষমা করে এবং উপেক্ষা করে। তোমরা কি পছন্দ কর না যে আল্লাহ তোমাদের ক্ষমা করুন?',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'Encourages forgiveness even when wronged, linking pardoning people to attaining Allah’s forgiveness and harmony in society.',
    tafsirBn: 'অন্যায়ের শিকার হলেও ক্ষমা করতে উদ্বুদ্ধ করে; মানুষকে ক্ষমা করা আল্লাহর ক্ষমা ও সামাজিক সম্প্রীতির পথ।',
    type: 'guidance',
    tags: ['forgiveness', 'mercy', 'relationships']
  },
  {
    id: 'h-bukhari-13',
    source: 'Hadith',
    reference: 'Sahih al-Bukhari',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    english: 'Actions are only by intentions.',
    bangla: 'কর্মের ফল নিয়তের উপর নির্ভরশীল।',
    tafsirRef: 'Sharh An-Nawawi (commentary)',
    tafsirEn: 'Centrality of intention: sincerity transforms mundane into worship; rewards align with what one intended.',
    tafsirBn: 'নিয়তের কেন্দ্রিকতা: খাঁটি নিয়ত সাধারণ কাজকেও ইবাদতে রূপ দেয়; প্রতিফল নিয়তের অনুপাতে।',
    type: 'positive',
    tags: ['intention', 'sincerity']
  },
  {
    id: 'h-muslim-2749',
    source: 'Hadith',
    reference: 'Sahih Muslim',
    arabic: 'اللَّهُ أَفْرَحُ بِتَوْبَةِ عَبْدِهِ',
    english: 'Allah is more pleased with the repentance of His servant...',
    bangla: 'বান্দার তাওবায় আল্লাহ অধিক আনন্দিত হন...',
    tafsirRef: 'Riyadh as-Salihin Commentary',
    tafsirEn: 'Illustrates divine joy at a servant’s return; the door of repentance remains open—act promptly with remorse and reform.',
    tafsirBn: 'বান্দার প্রত্যাবর্তনে রবের আনন্দের দৃষ্টান্ত; তওবার দ্বার খোলা—অনুশোচনা ও সংশোধনসহ দ্রুত ফিরে আসো।',
    type: 'guidance',
    tags: ['repentance', 'mercy', 'hope']
  },
  {
    id: 'q-14-7',
    source: 'Quran',
    reference: 'Ibrahim (14:7)',
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    english: 'If you are grateful, I will surely increase you.',
    bangla: 'তোমরা যদি কৃতজ্ঞ হও, তবে অবশ্যই আমি তোমাদেরকে বাড়িয়ে দেব।',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'Gratitude acknowledges the Giver, increases blessings, and guards the heart from arrogance and ingratitude.',
    tafsirBn: 'কৃতজ্ঞতা দাতাকে স্মরণ করে, নিয়ামত বাড়ায় এবং অহংকার-অকৃতজ্ঞতা থেকে হৃদয়কে রক্ষা করে।',
    type: 'positive',
    tags: ['gratitude', 'blessing']
  },
  {
    id: 'q-5-39',
    source: 'Quran',
    reference: 'Al-Ma’idah (5:39)',
    arabic: 'فَمَن تَابَ مِن بَعْدِ ظُلْمِهِ وَأَصْلَحَ فَإِنَّ اللَّهَ يَتُوبُ عَلَيْهِ',
    english: 'But whoever repents after his wrongdoing and reforms, indeed Allah will turn to him in forgiveness.',
    bangla: 'যে ব্যক্তি জুলুমের পরে তাওবা করে এবং সংশোধন হয়, নিশ্চয় আল্লাহ তার তাওবা কবুল করেন।',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'Repentance is accepted when coupled with rectification of one’s conduct; Allah’s acceptance invites hope and action.',
    tafsirBn: 'তাওবা কবুলের শর্ত হলো আমলের সংশোধন; আল্লাহর কবুলিয়ত আশা ও কর্মে ডাক দেয়।',
    type: 'guidance',
    tags: ['repentance', 'reform', 'hope']
  },
  {
    id: 'q-13-28',
    source: 'Quran',
    reference: 'Ar-Ra’d (13:28)',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    english: 'Surely in the remembrance of Allah do hearts find rest.',
    bangla: 'নিশ্চয় আল্লাহর স্মরণেই অন্তর প্রশান্তি পায়।',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'The tranquility promised here is a special sakinah granted through consistent dhikr, aligning the heart with its Creator.',
    tafsirBn: 'এখানে প্রশান্তি বলতে সেই সাকিনা বোঝায় যা নিয়মিত যিকরের মাধ্যমে হৃদয়ে অবতীর্ণ হয়—হৃদয় রবের সাথে সামঞ্জস্য পায়।',
    type: 'positive',
    tags: ['remembrance', 'serenity', 'heart', 'dhikr']
  },
  {
    id: 'q-16-97',
    source: 'Quran',
    reference: 'An-Nahl (16:97)',
    arabic: 'مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً',
    english: 'Whoever does righteousness, male or female, while a believer—We will surely give them a good life.',
    bangla: 'যে ঈমানদার হয়ে সৎকর্ম করে—পুরুষ হোক বা নারী—আমি তাকে অবশ্যই উত্তম জীবন দান করবো।',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'A “good life” comprises inner contentment, halal provision, and barakah—regardless of material fluctuation.',
    tafsirBn: '“উত্তম জীবন” হলো অন্তরের তৃপ্তি, হালাল রিযিক ও বরকত—বাহ্যিক অবস্থার ঊর্ধ্বে।',
    type: 'positive',
    tags: ['good life', 'barakah', 'contentment', 'faith']
  },
  {
    id: 'q-49-13',
    source: 'Quran',
    reference: 'Al-Hujurat (49:13)',
    arabic: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ',
    english: 'Indeed, the most noble of you in the sight of Allah is the most God-conscious of you.',
    bangla: 'নিশ্চয় তোমাদের মধ্যে আল্লাহর নিকট সবচেয়ে সম্মানিত সে-ই যে সবচেয়ে পরহেজগার।',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'True nobility is taqwa, not lineage or wealth. This verse anchors humility and equality among believers.',
    tafsirBn: 'আসল মর্যাদা হলো তাকওয়া—বংশধারা বা সম্পদ নয়; এতে বিনয় ও সমতার শিক্ষা রয়েছে।',
    type: 'guidance',
    tags: ['taqwa', 'humility', 'equality', 'character']
  },
  {
    id: 'q-2-177',
    source: 'Quran',
    reference: 'Al-Baqarah (2:177)',
    arabic: 'وَآتَى الْمَالَ عَلَىٰ حُبِّهِ ذَوِي الْقُرْبَىٰ وَالْيَتَامَىٰ...',
    english: 'Righteousness is to give wealth, in spite of love for it, to relatives, orphans...',
    bangla: 'ধর্মপরায়ণতা হলো প্রিয় সম্পদ থেকেও আত্মীয়, ইয়াতীমদেরকে দান করা...',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'Defines birr (righteousness) as comprehensive: belief, worship, charity to the vulnerable, and steadfastness in hardship.',
    tafsirBn: 'বিরর (ধর্মনিষ্ঠা) একটি সমগ্র ধারণা: ঈমান, ইবাদত, অভাবীদের দান, এবং বিপদে ধৈর্য।',
    type: 'positive',
    tags: ['charity', 'righteousness', 'family', 'orphans', 'steadfastness']
  },
  {
    id: 'h-bukhari-5678',
    source: 'Hadith',
    reference: 'Sahih al-Bukhari',
    arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَٰنُ',
    english: 'The merciful are shown mercy by the Most Merciful.',
    bangla: 'যারা দয়া করে, রহমান তাদের প্রতি দয়া করেন।',
    tafsirRef: 'Riyadh as-Salihin Commentary',
    tafsirEn: 'Cultivate rahmah in dealings—mercy begets mercy from Allah and fosters compassionate communities.',
    tafsirBn: 'লেনদেনে রহমতকে প্রাধান্য দাও—রাহমত আল্লাহর রহমতকে ডেকে আনে এবং সহমর্মী সমাজ গড়ে।',
    type: 'positive',
    tags: ['mercy', 'compassion', 'community']
  },
  {
    id: 'h-muslim-2564',
    source: 'Hadith',
    reference: 'Sahih Muslim',
    arabic: 'الدِّينُ النَّصِيحَةُ',
    english: 'Religion is sincere counsel.',
    bangla: 'দীন হলো আন্তরিক উপদেশ।',
    tafsirRef: 'Sharh An-Nawawi (commentary)',
    tafsirEn: 'Sincere counsel to Allah, His Book, His Messenger, leaders, and the common Muslims forms the fabric of a healthy ummah.',
    tafsirBn: 'আল্লাহ, কিতাব, রাসূল, নেতা ও সাধারণ মুসলিমদের প্রতি আন্তরিক উপদেশ—এটাই সুস্থ উম্মাহর ভিত্তি।',
    type: 'guidance',
    tags: ['sincerity', 'advice', 'community', 'ethics']
  },
  {
    id: 'q-65-3',
    source: 'Quran',
    reference: 'At-Talaq (65:3)',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    english: 'Whoever relies upon Allah—He is sufficient for him.',
    bangla: 'যে আল্লাহর উপর ভরসা করে—তাঁর জন্য তিনি-ই যথেষ্ট।',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'Tawakkul is active trust: take means while the heart rests in Allah’s sufficiency and decree.',
    tafsirBn: 'তাওয়াক্কুল মানে কার্যকর ভরসা: উপায় অবলম্বন করে অন্তরকে আল্লাহর তদবিরে স্থির রাখা।',
    type: 'positive',
    tags: ['trust', 'tawakkul', 'reliance', 'decree']
  },
  {
    id: 'q-24-27',
    source: 'Quran',
    reference: 'An-Nur (24:27)',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَدْخُلُوا بُيُوتًا غَيْرَ بُيُوتِكُمْ...',
    english: 'O you who believe, do not enter houses other than your own until you have asked permission...',
    bangla: 'হে ঈমানদাররা, অনুমতি ছাড়া তোমরা অন্যের ঘরে প্রবেশ করো না...',
    tafsirRef: 'Tafsir Ibn Kathir (abridged)',
    tafsirEn: 'Etiquettes (adab) safeguard privacy and dignity—Islamic manners are moral guardrails for social harmony.',
    tafsirBn: 'আদব-আখলাক গোপনীয়তা ও মর্যাদা রক্ষা করে—ইসলামী শিষ্টাচার সামাজিক সম্প্রীতির রেলপথ।',
    type: 'guidance',
    tags: ['manners', 'privacy', 'etiquette', 'society']
  },
  {
    id: 'q-31-18-19',
    source: 'Quran',
    reference: 'Luqman (31:18-19)',
    arabic: 'وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ... وَاقْصِدْ فِي مَشْيِكَ وَاغْضُضْ مِن صَوْتِكَ',
    english: 'Do not turn your cheek in contempt... be moderate in your walk and lower your voice.',
    bangla: 'মানুষের কাছে মুখ ফিরিয়ে অহংকার করো না... চালে-চলনে মধ্যম হও, কণ্ঠস্বর নিচু করো।',
    tafsirRef: 'Tafsir As-Sa’di',
    tafsirEn: 'Luqman’s counsel curbs arrogance, promotes humility and balance in behavior—hallmarks of refined character.',
    tafsirBn: 'লোকমানের উপদেশ অহংকার দমন করে; বিনয় ও ভারসাম্যপূর্ণ আচরণ চরিত্রকে পরিশীলিত করে।',
    type: 'guidance',
    tags: ['humility', 'behavior', 'balance', 'character']
  }
];

export const ALL_THEMES: string[] = Array.from(
  new Set(
    SPIRITUAL_GUIDANCE_DATA.flatMap(e => e.tags.map(t => t.toLowerCase()))
  )
).sort();

// Dynamic Verse Service - Integrates with AlQuran Cloud API
export interface QuranVerse {
  number: number;
  text: string;
  translation: string;
  bengali?: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    bengaliName?: string;
  };
  juz?: number;
  hizb?: number;
  rub?: number;
  ruku?: number;
  manzil?: number;
  sajdah?: boolean;
  translations?: {
    [key: string]: string;
  };
}

export interface ApiResponse {
  code: number;
  status: string;
  data: QuranVerse;
}

export interface SearchResponse {
  code: number;
  status: string;
  data: {
    matches: QuranVerse[];
    count: number;
  };
}

class DynamicVerseService {
  private baseUrl = 'https://api.alquran.cloud/v1';
  private cache = new Map<string, any>();
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  // Get a specific verse by surah and ayah number
  async getVerse(surah: number, ayah: number, translations: string[] = ['en.asad', 'bn.bengali']): Promise<QuranVerse | null> {
    try {
      const cacheKey = `verse-${surah}-${ayah}-${translations.join(',')}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // For multiple translations, we need to make separate calls
      const verseData: any = {};
      
      // Get Arabic text first
      const arabicResponse = await fetch(`${this.baseUrl}/ayah/${surah}:${ayah}`);
      if (arabicResponse.ok) {
        const arabicData = await arabicResponse.json();
        if (arabicData.code === 200 && arabicData.data) {
          verseData.number = arabicData.data.number;
          verseData.text = arabicData.data.text;
          verseData.surah = arabicData.data.surah;
          verseData.juz = arabicData.data.juz;
          verseData.hizb = arabicData.data.hizb;
          verseData.rub = arabicData.data.rub;
          verseData.ruku = arabicData.data.ruku;
          verseData.manzil = arabicData.data.manzil;
          verseData.sajdah = arabicData.data.sajdah;
        }
      }

      // Get English translation
      const englishResponse = await fetch(`${this.baseUrl}/ayah/${surah}:${ayah}/en.asad`);
      if (englishResponse.ok) {
        const englishData = await englishResponse.json();
        if (englishData.code === 200 && englishData.data) {
          verseData.translation = englishData.data.text;
        }
      }

      // Get Bengali translation
      const bengaliResponse = await fetch(`${this.baseUrl}/ayah/${surah}:${ayah}/bn.bengali`);
      if (bengaliResponse.ok) {
        const bengaliData = await bengaliResponse.json();
        if (bengaliData.code === 200 && bengaliData.data) {
          verseData.bengali = bengaliData.data.text;
        }
      }

      // If we have at least the Arabic text, return the verse
      if (verseData.text) {
        this.setCachedData(cacheKey, verseData);
        return verseData as QuranVerse;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  }

  // Get random verse
  async getRandomVerse(translations: string[] = ['en.asad', 'bn.bengali']): Promise<QuranVerse | null> {
    try {
      const cacheKey = `random-${translations.join(',')}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Get random verse (Arabic only first)
      const randomResponse = await fetch(`${this.baseUrl}/random`);
      if (!randomResponse.ok) {
        throw new Error(`HTTP error! status: ${randomResponse.status}`);
      }

      const randomData = await randomResponse.json();
      if (randomData.code !== 200 || !randomData.data) {
        return null;
      }

      const verseData: any = {
        number: randomData.data.number,
        text: randomData.data.text,
        surah: randomData.data.surah,
        juz: randomData.data.juz,
        hizb: randomData.data.hizb,
        rub: randomData.data.rub,
        ruku: randomData.data.ruku,
        manzil: randomData.data.manzil,
        sajdah: randomData.data.sajdah,
      };

      // Get English translation
      const englishResponse = await fetch(`${this.baseUrl}/ayah/${verseData.surah.number}:${verseData.number}/en.asad`);
      if (englishResponse.ok) {
        const englishData = await englishResponse.json();
        if (englishData.code === 200 && englishData.data) {
          verseData.translation = englishData.data.text;
        }
      }

      // Get Bengali translation
      const bengaliResponse = await fetch(`${this.baseUrl}/ayah/${verseData.surah.number}:${verseData.number}/bn.bengali`);
      if (bengaliResponse.ok) {
        const bengaliData = await bengaliResponse.json();
        if (bengaliData.code === 200 && bengaliData.data) {
          verseData.bengali = bengaliData.data.text;
        }
      }

      this.setCachedData(cacheKey, verseData);
      return verseData as QuranVerse;
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  }

  // Search verses by keyword
  async searchVerses(query: string, translations: string[] = ['en.asad', 'bn.bengali']): Promise<QuranVerse[]> {
    try {
      const cacheKey = `search-${query}-${translations.join(',')}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Search in English first
      const response = await fetch(`${this.baseUrl}/search/${encodeURIComponent(query)}/en.asad`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      
      if (data.code === 200 && data.data?.matches) {
        // For each match, get the Bengali translation
        const versesWithTranslations = await Promise.all(
          data.data.matches.map(async (verse) => {
            const bengaliResponse = await fetch(`${this.baseUrl}/ayah/${verse.surah.number}:${verse.number}/bn.bengali`);
            if (bengaliResponse.ok) {
              const bengaliData = await bengaliResponse.json();
              if (bengaliData.code === 200 && bengaliData.data) {
                verse.bengali = bengaliData.data.text;
              }
            }
            return verse;
          })
        );
        
        this.setCachedData(cacheKey, versesWithTranslations);
        return versesWithTranslations;
      }
      
      return [];
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
  }

  // Get verses by theme (using search)
  async getVersesByTheme(theme: string, limit: number = 10): Promise<QuranVerse[]> {
    const themeKeywords = this.getThemeKeywords(theme);
    const allVerses: QuranVerse[] = [];

    for (const keyword of themeKeywords) {
      const verses = await this.searchVerses(keyword);
      allVerses.push(...verses);
    }

    // Remove duplicates and limit results
    const uniqueVerses = this.removeDuplicateVerses(allVerses);
    return uniqueVerses.slice(0, limit);
  }

  // Get verse of the day (based on date)
  async getVerseOfTheDay(): Promise<QuranVerse | null> {
    try {
      // Use date to determine which verse to show
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      // Cycle through different surahs and verses based on the day
      const surahNumber = (dayOfYear % 114) + 1;
      const ayahNumber = (dayOfYear % 10) + 1; // Simple rotation through first 10 verses
      
      return await this.getVerse(surahNumber, ayahNumber);
    } catch (error) {
      console.error('Error fetching verse of the day:', error);
      return null;
    }
  }

  // Get all surahs list
  async getSurahs(): Promise<any[]> {
    try {
      const cacheKey = 'surahs';
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${this.baseUrl}/surah`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        this.setCachedData(cacheKey, data.data);
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching surahs:', error);
      return [];
    }
  }

  // Helper methods
  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getThemeKeywords(theme: string): string[] {
    const themeMap: { [key: string]: string[] } = {
      'patience': ['patience', 'sabr', 'endurance', 'perseverance'],
      'forgiveness': ['forgiveness', 'pardon', 'mercy', 'forgive'],
      'charity': ['charity', 'sadaqah', 'zakat', 'giving', 'spend'],
      'prayer': ['prayer', 'salah', 'worship', 'pray'],
      'gratitude': ['gratitude', 'thanks', 'shukr', 'grateful'],
      'trust': ['trust', 'tawakkul', 'reliance', 'depend'],
      'repentance': ['repentance', 'tawbah', 'repent', 'return'],
      'mercy': ['mercy', 'rahman', 'rahim', 'compassion'],
      'hope': ['hope', 'optimism', 'expectation', 'aspiration'],
      'fear': ['fear', 'taqwa', 'awe', 'reverence'],
      'love': ['love', 'hubb', 'affection', 'care'],
      'peace': ['peace', 'salam', 'tranquility', 'calm'],
      'wisdom': ['wisdom', 'hikmah', 'knowledge', 'understanding'],
      'justice': ['justice', 'adl', 'fairness', 'equity'],
      'humility': ['humility', 'modesty', 'humble', 'meekness'],
      'courage': ['courage', 'bravery', 'strength', 'boldness'],
      'kindness': ['kindness', 'compassion', 'gentleness', 'benevolence'],
      'truth': ['truth', 'haqq', 'honesty', 'veracity'],
      'guidance': ['guidance', 'huda', 'direction', 'leadership'],
      'blessing': ['blessing', 'barakah', 'favor', 'grace']
    };

    return themeMap[theme.toLowerCase()] || [theme];
  }

  private removeDuplicateVerses(verses: QuranVerse[]): QuranVerse[] {
    const seen = new Set();
    return verses.filter(verse => {
      const key = `${verse.surah.number}-${verse.number}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

export const dynamicVerseService = new DynamicVerseService();

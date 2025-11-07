import { collection, query, orderBy, limit, startAfter, getDocs, where, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { dynamicVerseService, QuranVerse } from '../services/dynamicVerseService';

export interface SpiritualContent {
  id: string;
  source: 'Quran' | 'Hadith';
  reference: string;
  arabic: string;
  english: string;
  bangla: string;
  tafsirRef: string;
  tafsirEn: string;
  tafsirBn: string;
  type: 'positive' | 'guidance';
  tags: string[];
  surahNumber?: number;
  ayahNumber?: number;
  hadithCollection?: string;
  hadithNumber?: number;
  priority: number; // For personalized recommendations
  createdAt: Date;
}

export interface PaginationOptions {
  pageSize: number;
  lastDoc?: DocumentSnapshot;
  theme?: string;
  source?: 'Quran' | 'Hadith';
  type?: 'positive' | 'guidance';
  searchTerm?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
  totalCount?: number;
}

class SpiritualGuidanceService {
  private collectionName = 'spiritual_guidance';
  private cache = new Map<string, SpiritualContent[]>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Get paginated content
  async getContent(options: PaginationOptions): Promise<PaginatedResult<SpiritualContent>> {
    const cacheKey = this.generateCacheKey(options);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return {
          data: cached,
          lastDoc: null,
          hasMore: false
        };
      }
    }

    try {
      let q = query(collection(db, this.collectionName));
      
      // Apply filters
      if (options.source) {
        q = query(q, where('source', '==', options.source));
      }
      
      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }
      
      if (options.theme) {
        q = query(q, where('tags', 'array-contains', options.theme.toLowerCase()));
      }

      // Order by priority and creation date
      q = query(q, orderBy('priority', 'desc'), orderBy('createdAt', 'desc'));
      
      // Apply pagination
      if (options.lastDoc) {
        q = query(q, startAfter(options.lastDoc));
      }
      
      q = query(q, limit(options.pageSize));

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as SpiritualContent[];

      // Cache the result
      this.cache.set(cacheKey, data);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return {
        data,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === options.pageSize
      };
    } catch (error) {
      console.error('Error fetching spiritual content:', error);
      throw error;
    }
  }

  // Get personalized content based on user's deeds
  async getPersonalizedContent(userDeeds: Array<{deedType: 'good' | 'bad', timestamp?: any}>, limit: number = 5): Promise<SpiritualContent[]> {
    const last7Days = this.getLast7DaysDeeds(userDeeds);
    const isPositive = last7Days.good >= last7Days.bad;
    
    const options: PaginationOptions = {
      pageSize: limit,
      type: isPositive ? 'positive' : 'guidance'
    };

    const result = await this.getContent(options);
    return result.data;
  }

  // Get verse of the day
  async getVerseOfTheDay(): Promise<SpiritualContent> {
    const today = new Date().toDateString();
    const cacheKey = `verse_of_day_${today}`;
    
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.length > 0) {
        return cached[0];
      }
    }

    // Use date-based seed for consistent daily selection
    const dateSeed = new Date().getTime();
    const options: PaginationOptions = {
      pageSize: 1,
      source: 'Quran'
    };

    const result = await this.getContent(options);
    const verse = result.data[0];
    
    if (verse) {
      this.cache.set(cacheKey, [verse]);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
    }

    return verse;
  }

  // Search content
  async searchContent(searchTerm: string, options: Omit<PaginationOptions, 'searchTerm'> = { pageSize: 20 }): Promise<PaginatedResult<SpiritualContent>> {
    // For now, we'll do client-side search on cached data
    // In production, you'd want to use Algolia or similar for better search
    const allContent = await this.getAllContent();
    
    const filtered = allContent.filter(content => 
      content.arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.bangla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const startIndex = options.lastDoc ? parseInt(options.lastDoc.id) : 0;
    const endIndex = startIndex + options.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      lastDoc: paginatedData.length === options.pageSize ? 
        { id: endIndex.toString() } as DocumentSnapshot : null,
      hasMore: endIndex < filtered.length
    };
  }

  // Get all themes
  async getAllThemes(): Promise<string[]> {
    const cacheKey = 'all_themes';
    
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached.map(item => item.tags).flat();
      }
    }

    const result = await this.getContent({ pageSize: 1000 });
    const themes = Array.from(new Set(result.data.flatMap(item => item.tags)));
    
    this.cache.set(cacheKey, result.data);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
    
    return themes.sort();
  }

  // Get content by specific reference (Surah:Ayah or Hadith)
  async getContentByReference(reference: string): Promise<SpiritualContent | null> {
    const cacheKey = `reference_${reference}`;
    
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.length > 0) {
        return cached[0];
      }
    }

    const q = query(
      collection(db, this.collectionName),
      where('reference', '==', reference)
    );

    const snapshot = await getDocs(q);
    const content = snapshot.docs[0] ? {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
      createdAt: snapshot.docs[0].data().createdAt?.toDate() || new Date()
    } as SpiritualContent : null;

    if (content) {
      this.cache.set(cacheKey, [content]);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
    }

    return content;
  }

  // Helper methods
  private generateCacheKey(options: PaginationOptions): string {
    return `content_${JSON.stringify(options)}`;
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private getLast7DaysDeeds(deeds: Array<{deedType: 'good' | 'bad', timestamp?: any}>): {good: number, bad: number} {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const recent = deeds.filter(deed => {
      const date = deed.timestamp?.toDate ? deed.timestamp.toDate() : new Date();
      return date >= start && date <= now;
    });

    return {
      good: recent.filter(d => d.deedType === 'good').length,
      bad: recent.filter(d => d.deedType === 'bad').length
    };
  }

  private async getAllContent(): Promise<SpiritualContent[]> {
    const cacheKey = 'all_content';
    
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const result = await this.getContent({ pageSize: 1000 });
    this.cache.set(cacheKey, result.data);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
    
    return result.data;
  }

  // Get dynamic verses from AlQuran Cloud API
  async getDynamicVerses(theme: string, limit: number = 10): Promise<SpiritualContent[]> {
    try {
      const verses = await dynamicVerseService.getVersesByTheme(theme, limit);
      return verses.map(verse => this.convertQuranVerseToSpiritualContent(verse));
    } catch (error) {
      console.error('Error fetching dynamic verses:', error);
      return [];
    }
  }

  // Get random dynamic verse
  async getRandomDynamicVerse(): Promise<SpiritualContent | null> {
    try {
      const verse = await dynamicVerseService.getRandomVerse();
      return verse ? this.convertQuranVerseToSpiritualContent(verse) : null;
    } catch (error) {
      console.error('Error fetching random dynamic verse:', error);
      return null;
    }
  }

  // Get dynamic verse of the day
  async getDynamicVerseOfTheDay(): Promise<SpiritualContent | null> {
    try {
      const verse = await dynamicVerseService.getVerseOfTheDay();
      return verse ? this.convertQuranVerseToSpiritualContent(verse) : null;
    } catch (error) {
      console.error('Error fetching dynamic verse of the day:', error);
      return null;
    }
  }

  // Search dynamic verses
  async searchDynamicVerses(query: string, limit: number = 20): Promise<SpiritualContent[]> {
    try {
      const verses = await dynamicVerseService.searchVerses(query);
      return verses.slice(0, limit).map(verse => this.convertQuranVerseToSpiritualContent(verse));
    } catch (error) {
      console.error('Error searching dynamic verses:', error);
      return [];
    }
  }

  // Get all available themes (combining static and dynamic)
  async getAllAvailableThemes(): Promise<string[]> {
    const staticThemes = await this.getAllThemes();
    const dynamicThemes = [
      'patience', 'forgiveness', 'charity', 'prayer', 'gratitude', 'trust',
      'repentance', 'mercy', 'hope', 'fear', 'love', 'peace', 'wisdom',
      'justice', 'humility', 'courage', 'kindness', 'truth', 'guidance',
      'blessing', 'faith', 'worship', 'dhikr', 'taqwa', 'sabr', 'shukr',
      'tawakkul', 'tawbah', 'rahmah', 'hikmah', 'adl', 'salam', 'hubb',
      'taqwa', 'ihsan', 'ikhlas', 'sadaqah', 'zakat', 'hajj', 'sawm',
      'jihad', 'daawah', 'ilm', 'amal', 'niyyah', 'sabr', 'shukr'
    ];
    
    const allThemes = Array.from(new Set([...staticThemes, ...dynamicThemes]));
    return allThemes.sort();
  }

  // Convert QuranVerse to SpiritualContent format
  private convertQuranVerseToSpiritualContent(verse: QuranVerse): SpiritualContent {
    return {
      id: `dynamic-${verse.surah.number}-${verse.number}`,
      source: 'Quran',
      reference: `${verse.surah.englishName} (${verse.surah.number}:${verse.number})`,
      arabic: verse.text,
      english: verse.translation,
      bangla: verse.bengali || verse.translation, // Fallback to English if Bengali not available
      tafsirRef: 'Dynamic API',
      tafsirEn: `This verse from ${verse.surah.englishName} emphasizes important Islamic teachings.`,
      tafsirBn: `এই আয়াত ${verse.surah.bengaliName || verse.surah.englishName} থেকে গুরুত্বপূর্ণ ইসলামী শিক্ষা প্রদান করে।`,
      type: 'positive',
      tags: this.extractTagsFromVerse(verse),
      surahNumber: verse.surah.number,
      ayahNumber: verse.number,
      priority: 5,
      createdAt: new Date()
    };
  }

  // Extract relevant tags from verse content
  private extractTagsFromVerse(verse: QuranVerse): string[] {
    const tags: string[] = [];
    const text = `${verse.translation} ${verse.bengali || ''}`.toLowerCase();
    
    const tagKeywords = {
      'patience': ['patience', 'sabr', 'endure', 'persevere'],
      'forgiveness': ['forgive', 'pardon', 'mercy', 'forgiveness'],
      'charity': ['charity', 'sadaqah', 'zakat', 'give', 'spend'],
      'prayer': ['prayer', 'salah', 'worship', 'pray'],
      'gratitude': ['gratitude', 'thanks', 'shukr', 'grateful'],
      'trust': ['trust', 'tawakkul', 'rely', 'depend'],
      'repentance': ['repentance', 'tawbah', 'repent', 'return'],
      'mercy': ['mercy', 'rahman', 'rahim', 'compassion'],
      'hope': ['hope', 'optimism', 'expect', 'aspire'],
      'fear': ['fear', 'taqwa', 'awe', 'reverence'],
      'love': ['love', 'hubb', 'affection', 'care'],
      'peace': ['peace', 'salam', 'tranquility', 'calm'],
      'wisdom': ['wisdom', 'hikmah', 'knowledge', 'understanding'],
      'justice': ['justice', 'adl', 'fairness', 'equity'],
      'humility': ['humility', 'modesty', 'humble', 'meekness'],
      'faith': ['faith', 'iman', 'believe', 'belief'],
      'guidance': ['guidance', 'huda', 'direction', 'leadership'],
      'blessing': ['blessing', 'barakah', 'favor', 'grace']
    };

    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    }

    return tags.length > 0 ? tags : ['guidance'];
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const spiritualGuidanceService = new SpiritualGuidanceService();


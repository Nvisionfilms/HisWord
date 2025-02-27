interface CacheItem<T> {
  value: T;
  timestamp: number;
  emotion?: string;
  reference?: string;
}

interface CachedVerse {
  reference: string;
  text: string;
  emotion: string;
  timestamp: number;
}

class Cache<T> {
  private cache: Map<string, CacheItem<T>>;
  private ttl: number;
  private maxItems: number;

  constructor(ttl: number = 1000 * 60 * 60 * 24, maxItems: number = 100) { // Default 24 hours, 100 items
    this.cache = new Map();
    this.ttl = ttl;
    this.maxItems = maxItems;
  }

  set(key: string, value: T, emotion?: string, reference?: string): void {
    // If cache is full, remove oldest item
    if (this.cache.size >= this.maxItems) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      emotion,
      reference
    });
  }

  get(key: string): { value: T; emotion?: string; reference?: string } | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return {
      value: item.value,
      emotion: item.emotion,
      reference: item.reference
    };
  }

  getByEmotion(emotion: string): Array<{ value: T; reference?: string }> {
    const matches: Array<{ value: T; reference?: string }> = [];
    
    this.cache.forEach((item) => {
      if (item.emotion?.toLowerCase() === emotion.toLowerCase()) {
        const isExpired = Date.now() - item.timestamp > this.ttl;
        if (!isExpired) {
          matches.push({
            value: item.value,
            reference: item.reference
          });
        }
      }
    });

    return matches;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    });
  }
}

class VerseCache {
  private cache: Map<string, CachedVerse>;
  private readonly maxSize: number;
  private readonly ttl: number; // Time to live in milliseconds

  constructor(maxSize = 100, ttlHours = 24) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttlHours * 60 * 60 * 1000;
  }

  set(reference: string, text: string, emotion: string, reference_id: string) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(reference_id, {
      reference,
      text,
      emotion,
      timestamp: Date.now()
    });
  }

  get(reference: string): CachedVerse | undefined {
    const verse = this.cache.get(reference);
    
    if (!verse) return undefined;

    // Check if the verse has expired
    if (Date.now() - verse.timestamp > this.ttl) {
      this.cache.delete(reference);
      return undefined;
    }

    return verse;
  }

  getByEmotion(emotion: string): CachedVerse[] {
    const now = Date.now();
    const verses: CachedVerse[] = [];

    for (const [_, verse] of this.cache) {
      // Skip expired entries
      if (now - verse.timestamp > this.ttl) continue;

      if (verse.emotion.toLowerCase().includes(emotion.toLowerCase())) {
        verses.push(verse);
      }
    }

    return verses;
  }

  clear() {
    this.cache.clear();
  }
}

export const responseCache = new Cache<string>(1000 * 60 * 60 * 24); // 24 hours
export const verseCache = new VerseCache();

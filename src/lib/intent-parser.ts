import type { SocialIntent } from '@/types/social-intent';
import { parseInstagramUrl, extractAllUrls, isValidUrl } from './url-patterns';

export interface ParseResult {
  intents: SocialIntent[];
  warnings: string[];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parseInput(rawInput: string): ParseResult {
  const lines = rawInput.split('\n').filter(Boolean);
  const intents: SocialIntent[] = [];
  const warnings: string[] = [];
  const seenUrls = new Set<string>();
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check for URLs
    const urls = extractAllUrls(trimmed);
    
    if (urls.length > 0) {
      // Process each URL found
      for (const url of urls) {
        // Normalize URL (remove trailing slashes, etc.)
        const normalizedUrl = url.replace(/\/$/, '');
        
        // Duplicate check
        if (seenUrls.has(normalizedUrl)) {
          warnings.push(`Duplicate URL skipped: ${normalizedUrl}`);
          continue;
        }
        seenUrls.add(normalizedUrl);
        
        // Check if it's an Instagram URL
        const instaResult = parseInstagramUrl(normalizedUrl);
        
        let source: SocialIntent['source'];
        if (instaResult.type === 'reel') {
          source = 'instagram-reel';
        } else if (instaResult.type === 'post') {
          source = 'instagram-post';
        } else {
          // Generic URL
          source = 'url';
        }
        
        intents.push({
          id: generateId(),
          source,
          rawInput: normalizedUrl,
          url: normalizedUrl,
          createdAt: new Date(),
          status: 'pending',
        });
      }
    } else {
      // No URLs found, treat as plain text reference
      intents.push({
        id: generateId(),
        source: 'text',
        rawInput: trimmed,
        createdAt: new Date(),
        status: 'pending',
      });
    }
  }
  
  return { intents, warnings };
}


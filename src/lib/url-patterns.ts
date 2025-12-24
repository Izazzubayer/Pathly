const INSTAGRAM_PATTERNS = {
  reel: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]+)/,
  post: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)/,
  profile: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_.]+)/,
};

export interface InstagramParseResult {
  type: 'reel' | 'post' | 'profile' | 'unknown';
  id?: string;
}

export function parseInstagramUrl(input: string): InstagramParseResult {
  const trimmed = input.trim();
  
  // Try reel pattern
  const reelMatch = trimmed.match(INSTAGRAM_PATTERNS.reel);
  if (reelMatch) {
    return { type: 'reel', id: reelMatch[1] };
  }
  
  // Try post pattern
  const postMatch = trimmed.match(INSTAGRAM_PATTERNS.post);
  if (postMatch) {
    return { type: 'post', id: postMatch[1] };
  }
  
  // Try profile pattern (but don't treat as post/reel)
  const profileMatch = trimmed.match(INSTAGRAM_PATTERNS.profile);
  if (profileMatch) {
    return { type: 'profile', id: profileMatch[1] };
  }
  
  return { type: 'unknown' };
}

export function extractAllUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}


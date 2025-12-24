export type IntentSource = 'instagram-reel' | 'instagram-post' | 'url' | 'text';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SocialIntent {
  id: string;
  source: IntentSource;
  rawInput: string;           // Original pasted content
  url?: string;               // Extracted URL if applicable
  createdAt: Date;
  status: ProcessingStatus;
  
  // Populated after processing (Phase 04)
  extractedData?: ExtractedData;
}

export interface ExtractedData {
  caption?: string;
  hashtags?: string[];
  taggedLocation?: string;
  inferredPlaces?: InferredPlace[];
  thumbnailUrl?: string;
}

export interface InferredPlace {
  name: string;
  confidence: 'high' | 'medium' | 'low';
  activityType?: string;
  city?: string;
}


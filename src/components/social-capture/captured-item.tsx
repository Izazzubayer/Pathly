'use client';

import { motion } from 'framer-motion';
import { X, Link2, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProcessingBadge } from './processing-badge';
import type { SocialIntent } from '@/types/social-intent';
import { cn } from '@/lib/utils';

interface CapturedItemProps {
  intent: SocialIntent;
  onRemove: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.15 },
  },
};

const getSourceIcon = (source: SocialIntent['source']) => {
  switch (source) {
    case 'instagram-reel':
      return Video;
    case 'instagram-post':
      return ImageIcon;
    case 'url':
      return Link2;
    case 'text':
      return FileText;
    default:
      return FileText;
  }
};

const getSourceLabel = (source: SocialIntent['source']) => {
  switch (source) {
    case 'instagram-reel':
      return 'Instagram Reel';
    case 'instagram-post':
      return 'Instagram Post';
    case 'url':
      return 'Link';
    case 'text':
      return 'Text Reference';
    default:
      return 'Unknown';
  }
};

export function CapturedItem({ intent, onRemove }: CapturedItemProps) {
  const Icon = getSourceIcon(intent.source);
  const displayText = intent.url || intent.rawInput;
  const truncatedText = displayText.length > 60 
    ? `${displayText.substring(0, 60)}...` 
    : displayText;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="p-3">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">
                {getSourceLabel(intent.source)}
              </span>
              <ProcessingBadge status={intent.status} />
            </div>
            <p className="text-sm break-words">{truncatedText}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 shrink-0"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}


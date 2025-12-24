'use client';

import { Badge } from '@/components/ui/badge';
import type { ConfidenceLevel } from '@/types/places';
import { cn } from '@/lib/utils';

const confidenceConfig: Record<ConfidenceLevel, { label: string; className: string }> = {
  high: {
    label: 'High confidence',
    className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  },
  medium: {
    label: 'Medium confidence',
    className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  },
  low: {
    label: 'Low confidence',
    className: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20',
  },
};

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  reason?: string;
  className?: string;
}

export function ConfidenceBadge({ level, reason, className }: ConfidenceBadgeProps) {
  const config = confidenceConfig[level];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)} title={reason}>
      {config.label}
    </Badge>
  );
}


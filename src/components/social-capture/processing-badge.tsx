'use client';

import { Badge } from '@/components/ui/badge';
import type { ProcessingStatus } from '@/types/social-intent';
import { cn } from '@/lib/utils';

const statusConfig: Record<ProcessingStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  completed: {
    label: 'Ready',
    className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
  },
};

interface ProcessingBadgeProps {
  status: ProcessingStatus;
  className?: string;
}

export function ProcessingBadge({ status, className }: ProcessingBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}


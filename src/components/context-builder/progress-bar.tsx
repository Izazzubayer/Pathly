'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full px-4 py-2">
      <Progress value={progress} className="h-1" />
      <p className="text-xs text-muted-foreground mt-1 text-center">
        {current} of {total}
      </p>
    </div>
  );
}


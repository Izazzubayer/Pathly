'use client';

import { Separator } from '@/components/ui/separator';
import type { TimeSlotType } from '@/types/itinerary';
import { cn } from '@/lib/utils';

interface TimeSlotHeaderProps {
  type: TimeSlotType;
  startTime: string;
  endTime: string;
}

const slotLabels: Record<TimeSlotType, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

const slotIcons: Record<TimeSlotType, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙',
};

export function TimeSlotHeader({ type, startTime, endTime }: TimeSlotHeaderProps) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{slotIcons[type]}</span>
        <div>
          <h3 className="font-semibold text-sm">{slotLabels[type]}</h3>
          <p className="text-xs text-muted-foreground">
            {startTime} - {endTime}
          </p>
        </div>
      </div>
      <Separator className="flex-1" />
    </div>
  );
}


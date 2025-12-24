'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ItineraryDay } from '@/types/itinerary';
import { format } from 'date-fns';

interface DaySelectorProps {
  days: ItineraryDay[];
  activeDay: number;
  onDayChange: (dayNumber: number) => void;
}

export function DaySelector({ days, activeDay, onDayChange }: DaySelectorProps) {
  if (days.length === 0) {
    return null;
  }

  return (
    <Tabs value={activeDay.toString()} onValueChange={(v) => onDayChange(Number(v))}>
      <TabsList className="inline-flex w-full overflow-x-auto">
        {days.map((day) => (
          <TabsTrigger
            key={day.dayNumber}
            value={day.dayNumber.toString()}
            className="flex flex-col items-start px-4 py-2 min-w-[100px]"
          >
            <span className="font-semibold">Day {day.dayNumber}</span>
            <span className="text-xs text-muted-foreground">
              {format(day.date, 'MMM d')}
            </span>
            <span className="text-xs text-muted-foreground">
              {day.places.length} places
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}


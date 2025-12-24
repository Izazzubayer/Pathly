'use client';

import { Clock, Navigation } from 'lucide-react';
import type { RouteSegment } from '@/types/itinerary';
import { cn } from '@/lib/utils';

interface TravelSegmentProps {
  segment: RouteSegment;
  showOptional?: boolean;
  onAddDetour?: () => void;
  onViewDetours?: () => void;
}

export function TravelSegment({ segment, showOptional, onAddDetour, onViewDetours }: TravelSegmentProps) {
  const distanceKm = (segment.distance / 1000).toFixed(1);
  const durationMin = Math.round(segment.duration);

  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-0.5 h-8 bg-border" />
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs">
        <Navigation className="h-3 w-3" />
        <span>{durationMin} min</span>
        <span className="text-muted-foreground">({distanceKm} km)</span>
      </div>
      {showOptional && (
        <button
          onClick={onViewDetours || onAddDetour}
          className="mt-1 text-xs text-primary hover:underline"
          aria-label="View optional places along this route"
        >
          {onViewDetours ? 'View optional places' : '+ Add stop on the way'}
        </button>
      )}
      <div className="w-0.5 h-8 bg-border" />
    </div>
  );
}


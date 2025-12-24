'use client';

import { motion } from 'framer-motion';
import { Star, GripVertical, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/custom/status-badge';
import { Badge } from '@/components/ui/badge';
import { generateItineraryPlaceExplanation } from '@/services/ai/explanations';
import { useTripStore } from '@/stores/trip-store';
import type { ItineraryPlace } from '@/types/itinerary';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TimelinePlaceProps {
  place: ItineraryPlace;
  isFirst: boolean;
  isLast: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

const activityIcons: Record<string, string> = {
  restaurant: '🍽️',
  cafe: '☕',
  bar: '🍸',
  club: '🎉',
  attraction: '🏛️',
  viewpoint: '🌅',
  beach: '🏖️',
  market: '🛒',
  temple: '🕉️',
  museum: '🎨',
  shopping: '🛍️',
  nature: '🌲',
  other: '📍',
};

export function TimelinePlace({
  place,
  isFirst,
  isLast,
  isSelected,
  onSelect,
  onRemove,
}: TimelinePlaceProps) {
  const { userContext } = useTripStore();
  const [explanation, setExplanation] = useState(place.reason);
  const icon = activityIcons[place.place.activityType] || activityIcons.other;

  useEffect(() => {
    if (!explanation && userContext) {
      const generated = generateItineraryPlaceExplanation(place, userContext);
      setExplanation(generated);
    }
  }, [place, userContext, explanation]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="relative"
    >
      <Card
        className={cn(
          'cursor-pointer transition-all',
          isSelected && 'ring-2 ring-primary',
          'hover:shadow-md focus-within:ring-2 focus-within:ring-primary'
        )}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${place.place.name}, ${place.arrivalTime} to ${place.departureTime}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-3 h-3 rounded-full border-2',
                isSelected ? 'bg-primary border-primary' : 'bg-background border-primary'
              )} />
              {!isLast && <div className="w-0.5 h-full min-h-[60px] bg-border mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{place.place.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {place.arrivalTime} - {place.departureTime} ({place.duration} min)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {place.isAnchor && (
                    <Star className="h-4 w-4 text-yellow-600 fill-current" />
                  )}
                  <StatusBadge status={place.status} />
                </div>
              </div>

              {explanation && (
                <p className="text-xs text-muted-foreground mb-2 italic" role="note">
                  {explanation}
                </p>
              )}

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {place.place.activityType}
                </Badge>
                {place.distanceFromPrevious > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(place.distanceFromPrevious / 1000 * 10) / 10} km from previous
                  </span>
                )}
              </div>

              {onRemove && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    aria-label={`Remove ${place.place.name} from itinerary`}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


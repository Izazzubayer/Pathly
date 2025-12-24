'use client';

import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimelinePlace } from './timeline-place';
import { TravelSegment } from './travel-segment';
import { TimeSlotHeader } from './time-slot-header';
import type { ItineraryDay, ItineraryPlace } from '@/types/itinerary';

interface TimelineViewProps {
  day: ItineraryDay;
  selectedPlaceId?: string;
  onPlaceClick?: (place: ItineraryPlace) => void;
  onRemove?: (placeId: string) => void;
  onViewDetours?: (placeId: string) => void;
}

export function TimelineView({ day, selectedPlaceId, onPlaceClick, onRemove, onViewDetours }: TimelineViewProps) {
  if (day.places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No places scheduled for this day.</p>
      </div>
    );
  }

  // Group places by time slots if available
  if (day.slots.length > 0) {
    return (
      <ScrollArea className="h-full">
        <div className="space-y-6 p-4">
          {day.slots.map((slot, slotIndex) => (
            <div key={slotIndex}>
              <TimeSlotHeader
                type={slot.type}
                startTime={slot.startTime}
                endTime={slot.endTime}
              />
              
              <div className="space-y-4">
                <AnimatePresence>
                  {slot.places.map((place, placeIndex) => {
                    const isFirst = placeIndex === 0;
                    const isLast = placeIndex === slot.places.length - 1;
                    const isSelected = selectedPlaceId === place.place.id;
                    
                    // Find route segment
                    const segment = day.routes.find(
                      (r) => r.to.place.id === place.place.id
                    );

                    return (
                      <div key={place.place.id}>
                        {!isFirst && segment && (
                          <TravelSegment
                            segment={segment}
                            showOptional={true}
                            onViewDetours={() => onViewDetours?.(place.place.id)}
                          />
                        )}
                        <TimelinePlace
                          place={place}
                          isFirst={isFirst}
                          isLast={isLast}
                          isSelected={isSelected}
                          onSelect={() => onPlaceClick?.(place)}
                          onRemove={onRemove ? () => onRemove(place.place.id) : undefined}
                        />
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  // Fallback: show all places without slot grouping
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <AnimatePresence>
          {day.places.map((place, index) => {
            const isFirst = index === 0;
            const isLast = index === day.places.length - 1;
            const isSelected = selectedPlaceId === place.place.id;
            const segment = day.routes.find((r) => r.to.place.id === place.place.id);

            return (
              <div key={place.place.id}>
                {!isFirst && segment && (
                  <TravelSegment
                    segment={segment}
                    showOptional={true}
                    onViewDetours={() => onViewDetours?.(place.place.id)}
                  />
                )}
                <TimelinePlace
                  place={place}
                  isFirst={isFirst}
                  isLast={isLast}
                  isSelected={isSelected}
                  onSelect={() => onPlaceClick?.(place)}
                  onRemove={onRemove ? () => onRemove(place.place.id) : undefined}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}


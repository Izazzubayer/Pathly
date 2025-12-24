'use client';

import { Marker } from 'react-map-gl/mapbox';
import { Star, MapPin } from 'lucide-react';
import type { Place } from '@/types/places';
import { cn } from '@/lib/utils';

interface PlaceMarkerProps {
  place: Place;
  isAnchor: boolean;
  isSelected?: boolean;
  onClick?: () => void;
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

export function PlaceMarker({ place, isAnchor, isSelected, onClick }: PlaceMarkerProps) {
  const icon = activityIcons[place.activityType] || activityIcons.other;

  return (
    <Marker
      longitude={place.location.lng}
      latitude={place.location.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.();
      }}
    >
      <div
        className={cn(
          'relative cursor-pointer transition-all',
          isSelected && 'scale-125 z-50',
          isAnchor && 'z-40'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full border-2 shadow-lg',
            'bg-white text-lg w-10 h-10',
            isAnchor
              ? 'border-primary scale-110'
              : 'border-muted-foreground/30',
            isSelected && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          <span>{icon}</span>
        </div>
        {isAnchor && (
          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
            <Star className="h-3 w-3 text-primary-foreground fill-current" />
          </div>
        )}
      </div>
    </Marker>
  );
}


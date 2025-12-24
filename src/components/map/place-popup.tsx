'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Place } from '@/types/places';
import { usePlacesStore } from '@/stores/places-store';

interface PlacePopupProps {
  place: Place;
  onClose: () => void;
}

export function PlacePopup({ place, onClose }: PlacePopupProps) {
  const { anchors, promoteToAnchor, demoteFromAnchor } = usePlacesStore();
  const isAnchor = anchors.some((a) => a.id === place.id);

  const handleToggleAnchor = () => {
    if (isAnchor) {
      demoteFromAnchor(place.id);
    } else {
      promoteToAnchor(place.id);
    }
  };

  return (
    <div className="p-2 min-w-[200px]">
      <h3 className="font-semibold text-sm mb-1">{place.name}</h3>
      {place.address && (
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3" />
          {place.address}
        </p>
      )}
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary" className="text-xs">
          {place.activityType}
        </Badge>
        {place.rating && (
          <Badge variant="outline" className="text-xs">
            ⭐ {place.rating.toFixed(1)}
          </Badge>
        )}
      </div>
      <Button
        size="sm"
        variant={isAnchor ? 'default' : 'outline'}
        onClick={handleToggleAnchor}
        className="w-full"
      >
        <Star className={cn('h-3 w-3 mr-1', isAnchor && 'fill-current')} />
        {isAnchor ? 'Remove Anchor' : 'Mark as Anchor'}
      </Button>
    </div>
  );
}


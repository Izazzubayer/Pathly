'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, StarOff, Calendar, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfidenceBadge } from './confidence-badge';
import { TimeLockPicker } from './time-lock-picker';
import type { Place, Anchor } from '@/types/places';
import { usePlacesStore } from '@/stores/places-store';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  isAnchor: boolean;
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

export function PlaceCard({ place, isAnchor }: PlaceCardProps) {
  const { promoteToAnchor, demoteFromAnchor, updateAnchorTimeLock, removePlace, anchors } = usePlacesStore();
  const [showTimeLock, setShowTimeLock] = useState(false);
  
  const anchor = isAnchor 
    ? anchors.find((a) => a.id === place.id)
    : null;

  const handleToggleAnchor = () => {
    if (isAnchor) {
      demoteFromAnchor(place.id);
    } else {
      promoteToAnchor(place.id);
    }
  };

  const handleTimeLockChange = (timeLock: Anchor['timeLock']) => {
    if (anchor) {
      updateAnchorTimeLock(place.id, timeLock);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={cn('transition-all', isAnchor && 'ring-2 ring-primary')}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-1">
              {activityIcons[place.activityType] || activityIcons.other}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                  {place.address && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {place.address}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <ConfidenceBadge 
                    level={place.confidence} 
                    reason={place.inferenceReason}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleAnchor}
                    className={cn(
                      'h-8 w-8',
                      isAnchor && 'text-yellow-600 hover:text-yellow-700'
                    )}
                    aria-label={isAnchor ? 'Remove anchor' : 'Mark as anchor'}
                  >
                    {isAnchor ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {place.inferenceReason && (
                <p className="text-xs text-muted-foreground mb-2">
                  {place.inferenceReason}
                </p>
              )}
              
              {isAnchor && anchor && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Time Lock
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTimeLock(!showTimeLock)}
                    >
                      {anchor.timeLock ? 'Edit' : 'Add'}
                    </Button>
                  </div>
                  
                  {showTimeLock && (
                    <TimeLockPicker
                      value={anchor.timeLock}
                      onChange={handleTimeLockChange}
                      onClose={() => setShowTimeLock(false)}
                    />
                  )}
                  
                  {anchor.timeLock && !showTimeLock && (
                    <p className="text-sm text-muted-foreground">
                      {new Date(anchor.timeLock.date).toLocaleDateString()}
                      {anchor.timeLock.time && ` at ${anchor.timeLock.time}`}
                      {anchor.timeLock.flexible && ' (flexible)'}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {place.activityType}
                </Badge>
                {place.rating && (
                  <Badge variant="outline" className="text-xs">
                    ⭐ {place.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removePlace(place.id)}
              className="h-8 w-8 shrink-0"
              aria-label="Remove place"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


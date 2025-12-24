'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Star } from 'lucide-react';

export function NoAnchorsEmptyState() {
  return (
    <Alert>
      <Star className="h-4 w-4" />
      <AlertTitle>Mark at least one place as an anchor</AlertTitle>
      <AlertDescription>
        Anchors are the places you must visit. They help us create a route-optimized itinerary.
        Click the star icon on any place to mark it as an anchor.
      </AlertDescription>
    </Alert>
  );
}


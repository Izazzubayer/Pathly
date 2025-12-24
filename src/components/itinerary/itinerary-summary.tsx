'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Itinerary } from '@/types/itinerary';

interface ItinerarySummaryProps {
  itinerary: Itinerary;
}

export function ItinerarySummary({ itinerary }: ItinerarySummaryProps) {
  const totalPlaces = itinerary.days.reduce((sum, day) => sum + day.places.length, 0);
  const totalAnchors = itinerary.days.reduce(
    (sum, day) => sum + day.places.filter((p) => p.isAnchor).length,
    0
  );
  const totalDistanceKm = Math.round(itinerary.totalDistance / 1000);
  const totalDurationHours = Math.round(itinerary.totalDuration / 60);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your {itinerary.days.length}-Day Trip</CardTitle>
        <CardDescription>
          {itinerary.tripDetails.destination}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Places</p>
            <p className="text-2xl font-bold">{totalPlaces}</p>
            <p className="text-xs text-muted-foreground">{totalAnchors} anchors</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="text-2xl font-bold">{totalDistanceKm} km</p>
            <p className="text-xs text-muted-foreground">total</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">Optimization Score</span>
          <Badge variant="default" className="text-lg px-3 py-1">
            {itinerary.optimizationScore}/100
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


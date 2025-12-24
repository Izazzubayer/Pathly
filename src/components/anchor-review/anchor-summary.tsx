'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlacesStore } from '@/stores/places-store';

export function AnchorSummary() {
  const { anchors, places } = usePlacesStore();
  const nonAnchors = places.filter((p) => !anchors.some((a) => a.id === p.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          Review your places and mark the ones you must visit as anchors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Anchors (must visit):</span>
          <Badge variant="default">{anchors.length}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Other places:</span>
          <Badge variant="secondary">{nonAnchors.length}</Badge>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">Total places:</span>
          <Badge>{places.length}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}


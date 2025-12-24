'use client';

import { Separator } from '@/components/ui/separator';
import { PlaceCard } from './place-card';
import { AnchorSummary } from './anchor-summary';
import { usePlacesStore } from '@/stores/places-store';

export function ReviewContainer() {
  const { places, anchors } = usePlacesStore();
  const anchorIds = new Set(anchors.map((a) => a.id));
  const anchorPlaces = places.filter((p) => anchorIds.has(p.id));
  const otherPlaces = places.filter((p) => !anchorIds.has(p.id));

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No places found yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Process your social intents to discover places.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnchorSummary />
      
      {anchorPlaces.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              ⭐ Your Anchors ({anchorPlaces.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              These places will be prioritized in your itinerary.
            </p>
          </div>
          <div className="space-y-3">
            {anchorPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} isAnchor={true} />
            ))}
          </div>
        </div>
      )}

      {otherPlaces.length > 0 && (
        <>
          {anchorPlaces.length > 0 && <Separator />}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                📍 Other Discovered Places ({otherPlaces.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Mark any as anchors if you want to prioritize them.
              </p>
            </div>
            <div className="space-y-3">
              {otherPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} isAnchor={false} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


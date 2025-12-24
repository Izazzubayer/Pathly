'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { ReviewContainer } from '@/components/anchor-review/review-container';
import { NoAnchorsEmptyState } from '@/components/empty-states/no-anchors';

const MapContainer = dynamic(() => import('@/components/map/map-container').then((mod) => ({ default: mod.MapContainer })), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg"><p className="text-muted-foreground">Loading map...</p></div>,
});
import { useIntentStore } from '@/stores/intent-store';
import { usePlacesStore } from '@/stores/places-store';
import { useTripStore } from '@/stores/trip-store';
import { processIntent } from '@/services/intent-processor';
import { ArrowRight } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const { intents, updateIntentStatus } = useIntentStore();
  const { places, anchors, addPlaces } = usePlacesStore();
  const { tripDetails, setCurrentStep } = useTripStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    // Process all pending intents on mount
    const processAllIntents = async () => {
      const pendingIntents = intents.filter((intent) => intent.status === 'pending');
      
      if (pendingIntents.length === 0) {
        // If no pending intents but we have places, we're done
        return;
      }

      setIsProcessing(true);
      const newPlaces: typeof places = [];

      for (const intent of pendingIntents) {
        updateIntentStatus(intent.id, 'processing');
        
        try {
          const result = await processIntent(intent);
          newPlaces.push(...result.places);
          updateIntentStatus(intent.id, 'completed');
          setProcessedCount((prev) => prev + 1);
        } catch (error) {
          console.error('Failed to process intent:', error);
          updateIntentStatus(intent.id, 'failed');
        }
      }

      if (newPlaces.length > 0) {
        addPlaces(newPlaces);
      }

      setIsProcessing(false);
    };

    processAllIntents();
  }, [intents.length]); // Only run when intents change

  const handleContinue = () => {
    if (places.length > 0) {
      setCurrentStep('itinerary');
      router.push('/itinerary');
    }
  };

  const hasAnchors = anchors.length > 0;

  if (isProcessing) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Processing your places</h1>
          <p className="text-muted-foreground">
            Extracting places from your saved content...
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Review Your Places</h1>
        <p className="text-muted-foreground">
          We found {places.length} place{places.length !== 1 ? 's' : ''} from your saved content.
          Mark the ones you must visit as anchors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Map View */}
        <div className="h-[500px] lg:h-auto rounded-lg overflow-hidden border">
          <MapContainer
            places={places}
            anchors={anchors}
            fitToPlaces={places.length > 0}
          />
        </div>

        {/* Places List */}
        <div className="overflow-y-auto">
          <ReviewContainer />
        </div>
      </div>

      {places.length > 0 && (
        <div className="flex justify-end pt-6 border-t mt-6">
          <Button 
            onClick={handleContinue} 
            size="lg"
            disabled={!hasAnchors}
          >
            {hasAnchors 
              ? 'Continue to Itinerary' 
              : 'Mark at least one place as anchor to continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

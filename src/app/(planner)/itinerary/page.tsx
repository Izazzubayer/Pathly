'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ItineraryLayout } from '@/components/itinerary/itinerary-layout';
import { ItinerarySummary } from '@/components/itinerary/itinerary-summary';
import { RegenerateControls } from '@/components/itinerary/regenerate-controls';
import { ExportButton } from '@/components/itinerary/export-button';
import { NoAnchorsEmptyState } from '@/components/empty-states/no-anchors';
import { GenerationFailedEmptyState } from '@/components/empty-states/generation-failed';
import { usePlacesStore } from '@/stores/places-store';
import { useTripStore } from '@/stores/trip-store';
import { useItineraryStore } from '@/stores/itinerary-store';
import { optimizeItinerary } from '@/services/route-engine';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { exportItineraryAsText, downloadFile } from '@/lib/export/itinerary-export';

export default function ItineraryPage() {
  const { anchors, places } = usePlacesStore();
  const { tripDetails, userContext } = useTripStore();
  const { itinerary, isGenerating, error, setItinerary } = useItineraryStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeDay, setActiveDay] = useState(itinerary?.days[0]?.dayNumber || 1);

  useEffect(() => {
    const createItinerary = async () => {
      if (!tripDetails || !userContext || anchors.length === 0) {
        setIsInitializing(false);
        return;
      }

      if (itinerary) {
        setIsInitializing(false);
        return;
      }

      setIsInitializing(true);
      useItineraryStore.setState({ isGenerating: true, error: null });

      try {
        const optionalPlaces = places.filter((p) => !anchors.some((a) => a.id === p.id));
        const hotelLocation = tripDetails.hotelLocation || tripDetails.destinationCoords || { lat: 0, lng: 0 };

        const result = await optimizeItinerary({
          anchors,
          optionalPlaces,
          hotel: hotelLocation,
          tripDetails,
          userContext,
        });

        setItinerary(result.itinerary);
        useItineraryStore.setState({ isGenerating: false });
      } catch (err) {
        console.error('Failed to generate itinerary:', err);
        useItineraryStore.setState({
          isGenerating: false,
          error: err instanceof Error ? err.message : 'Failed to generate itinerary',
        });
      } finally {
        setIsInitializing(false);
      }
    };

    createItinerary();
  }, [anchors.length, places.length]);

  const handleRegenerateDay = async () => {
    if (!tripDetails || !userContext || !itinerary) return;
    
    // Regenerate logic would go here
    // For now, just regenerate the whole itinerary
    useItineraryStore.setState({ isGenerating: true });
    
    try {
      const optionalPlaces = places.filter((p) => !anchors.some((a) => a.id === p.id));
      const hotelLocation = tripDetails.hotelLocation || tripDetails.destinationCoords || { lat: 0, lng: 0 };

      const result = await optimizeItinerary({
        anchors,
        optionalPlaces,
        hotel: hotelLocation,
        tripDetails,
        userContext,
      });

      setItinerary(result.itinerary);
    } catch (err) {
      console.error('Failed to regenerate:', err);
    } finally {
      useItineraryStore.setState({ isGenerating: false });
    }
  };

  const handleOptimizeOrder = async () => {
    // Optimize just the order for the current day
    // Implementation would re-run TSP for that day
    handleRegenerateDay();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'r',
      ctrl: true,
      handler: handleRegenerateDay,
    },
    {
      key: 'o',
      ctrl: true,
      handler: handleOptimizeOrder,
    },
    {
      key: 'e',
      ctrl: true,
      handler: () => {
        if (itinerary) {
          const text = exportItineraryAsText(itinerary);
          const filename = `itinerary-${itinerary.tripDetails.destination.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
          downloadFile(text, filename, 'text/plain');
        }
      },
    },
  ]);

  if (isInitializing || isGenerating) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Generating Your Itinerary</h1>
          <p className="text-muted-foreground">
            Optimizing routes and planning your perfect trip...
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

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <GenerationFailedEmptyState
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!tripDetails || !userContext) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete the context builder and review steps first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (anchors.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <NoAnchorsEmptyState />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No itinerary generated yet.</p>
          <Button onClick={() => window.location.reload()}>Generate Itinerary</Button>
        </div>
      </div>
    );
  }

  const currentDay = itinerary.days.find((d) => d.dayNumber === activeDay);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Itinerary</h1>
            <p className="text-muted-foreground">
              {itinerary.days.length} day{itinerary.days.length !== 1 ? 's' : ''} • 
              {Math.round(itinerary.totalDistance / 1000)} km total • 
              Score: {itinerary.optimizationScore}/100
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentDay && (
              <RegenerateControls
                dayNumber={activeDay}
                onRegenerateDay={handleRegenerateDay}
                onOptimizeOrder={handleOptimizeOrder}
              />
            )}
            {itinerary && <ExportButton itinerary={itinerary} />}
          </div>
        </div>
        <ItinerarySummary itinerary={itinerary} />
      </div>

      <div className="flex-1">
        <ItineraryLayout 
          itinerary={itinerary} 
          activeDay={activeDay}
          onDayChange={setActiveDay}
        />
      </div>
    </div>
  );
}

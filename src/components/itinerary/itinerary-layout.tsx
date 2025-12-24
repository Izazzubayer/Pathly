'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapContainer } from '@/components/map/map-container';
import { DaySelector } from './day-selector';
import { TimelineView } from './timeline-view';
import { DetoursDrawer } from './detours-drawer';
import { scoreDetour } from '@/services/route-engine';
import type { Itinerary, ItineraryPlace } from '@/types/itinerary';
import type { Place } from '@/types/places';
import { usePlacesStore } from '@/stores/places-store';
import { useTripStore } from '@/stores/trip-store';

interface ItineraryLayoutProps {
  itinerary: Itinerary;
  activeDay: number;
  onDayChange: (day: number) => void;
}

export function ItineraryLayout({ itinerary, activeDay, onDayChange }: ItineraryLayoutProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>();
  const [detoursDrawerOpen, setDetoursDrawerOpen] = useState(false);
  const [detoursPlaceId, setDetoursPlaceId] = useState<string | undefined>();
  const { anchors, places } = usePlacesStore();
  const { userContext } = useTripStore();

  const currentDay = itinerary.days.find((d) => d.dayNumber === activeDay);
  const currentDayPlaces = currentDay?.places.map((p) => p.place) || [];
  const currentDayAnchors = anchors.filter((a) =>
    currentDayPlaces.some((p) => p.id === a.id)
  );

  const handlePlaceClick = (place: ItineraryPlace) => {
    setSelectedPlaceId(place.place.id);
  };

  const handleViewDetours = (placeId: string) => {
    setDetoursPlaceId(placeId);
    setDetoursDrawerOpen(true);
  };

  const handleAddDetour = (place: Place, afterPlaceId: string) => {
    // Add place to itinerary after the specified place
    // This would integrate with the itinerary store
    console.log('Add detour:', place, 'after', afterPlaceId);
  };

  // Calculate detours for the selected place
  const detours = detoursPlaceId && currentDay && userContext
    ? places
        .filter((p) => !currentDayPlaces.some((dp) => dp.id === p.id))
        .map((place) => {
          const placeIndex = currentDay.places.findIndex((ip) => ip.place.id === detoursPlaceId);
          const previousPlace = placeIndex > 0 ? currentDay.places[placeIndex - 1].place : undefined;
          const nextPlace = placeIndex < currentDay.places.length - 1 ? currentDay.places[placeIndex + 1].place : undefined;
          
          if (previousPlace && nextPlace) {
            return scoreDetour(
              place,
              { from: previousPlace, to: nextPlace },
              userContext
            );
          }
          return null;
        })
        .filter((d): d is NonNullable<typeof d> => d !== null)
    : [];

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="mb-4">
        <DaySelector
          days={itinerary.days}
          activeDay={activeDay}
          onDayChange={onDayChange}
        />
      </div>

      {/* Desktop: Split view with grid */}
      <div className="hidden lg:grid lg:grid-cols-[60%_40%] gap-4 h-full">
        <div className="rounded-lg overflow-hidden border">
          <MapContainer
            places={currentDayPlaces}
            anchors={currentDayAnchors}
            routes={currentDay?.routes || []}
            showRoutes={true}
            onPlaceClick={(place) => {
              const itineraryPlace = currentDay?.places.find((p) => p.place.id === place.id);
              if (itineraryPlace) {
                handlePlaceClick(itineraryPlace);
              }
            }}
            fitToPlaces={currentDayPlaces.length > 0}
          />
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          {currentDay && (
            <TimelineView
              day={currentDay}
              selectedPlaceId={selectedPlaceId}
              onPlaceClick={handlePlaceClick}
              onViewDetours={handleViewDetours}
            />
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Tab view */}
      <div className="lg:hidden h-full">
        <Tabs defaultValue="map" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="flex-1 mt-4">
            <div className="h-full rounded-lg overflow-hidden border">
              <MapContainer
                places={currentDayPlaces}
                anchors={currentDayAnchors}
                routes={currentDay?.routes || []}
                showRoutes={true}
                fitToPlaces={currentDayPlaces.length > 0}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="flex-1 mt-4">
            <div className="h-full border rounded-lg overflow-hidden">
              {currentDay && (
                <TimelineView
                  day={currentDay}
                  selectedPlaceId={selectedPlaceId}
                  onPlaceClick={handlePlaceClick}
                  onViewDetours={handleViewDetours}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detours Drawer */}
      <DetoursDrawer
        isOpen={detoursDrawerOpen}
        onClose={() => {
          setDetoursDrawerOpen(false);
          setDetoursPlaceId(undefined);
        }}
        detours={detours}
        onAddDetour={handleAddDetour}
        currentDay={activeDay}
        currentPlaceId={detoursPlaceId}
      />
    </div>
  );
}


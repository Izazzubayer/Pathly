import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Itinerary, ItineraryDay } from '@/types/itinerary';
import type { Place } from '@/types/places';

interface ItineraryStore {
  itinerary: Itinerary | null;
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  generateItinerary: () => Promise<void>;
  regenerateDay: (dayNumber: number) => Promise<void>;
  setItinerary: (itinerary: Itinerary) => void;
  
  // Manual adjustments
  movePlaceToDay: (placeId: string, targetDay: number) => void;
  reorderPlaceInDay: (dayNumber: number, fromIndex: number, toIndex: number) => void;
  addPlaceToDay: (place: Place, dayNumber: number, position?: number) => void;
  removePlaceFromDay: (placeId: string, dayNumber: number) => void;
  
  // Optional places
  toggleOptionalPlace: (placeId: string, include: boolean) => void;
  
  // Computed
  getDayByNumber: (dayNumber: number) => ItineraryDay | undefined;
  getTotalDistance: () => number;
  getOptimizationScore: () => number;
  clearItinerary: () => void;
}

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      itinerary: null,
      isGenerating: false,
      error: null,
      
      generateItinerary: async () => {
        set({ isGenerating: true, error: null });
      },
      
      setItinerary: (itinerary) => {
        set({ itinerary, isGenerating: false, error: null });
      },
      
      regenerateDay: async (dayNumber: number) => {
        // Implementation for regenerating a single day
        const itinerary = get().itinerary;
        if (!itinerary) return;
        
        set({ isGenerating: true });
        // Regeneration logic here
        set({ isGenerating: false });
      },
      
      movePlaceToDay: (placeId, targetDay) => {
        const itinerary = get().itinerary;
        if (!itinerary) return;
        
        // Find place in current itinerary
        // Move to target day
        // Re-optimize target day
      },
      
      reorderPlaceInDay: (dayNumber, fromIndex, toIndex) => {
        const itinerary = get().itinerary;
        if (!itinerary) return;
        
        const day = itinerary.days.find((d) => d.dayNumber === dayNumber);
        if (!day) return;
        
        const places = [...day.places];
        const [moved] = places.splice(fromIndex, 1);
        places.splice(toIndex, 0, moved);
        
        // Update order
        places.forEach((p, index) => {
          p.orderInDay = index + 1;
        });
        
        set({
          itinerary: {
            ...itinerary,
            days: itinerary.days.map((d) =>
              d.dayNumber === dayNumber ? { ...d, places } : d
            ),
          },
        });
      },
      
      addPlaceToDay: (place, dayNumber, position) => {
        // Implementation
      },
      
      removePlaceFromDay: (placeId, dayNumber) => {
        const itinerary = get().itinerary;
        if (!itinerary) return;
        
        set({
          itinerary: {
            ...itinerary,
            days: itinerary.days.map((day) =>
              day.dayNumber === dayNumber
                ? {
                    ...day,
                    places: day.places.filter((p) => p.place.id !== placeId),
                  }
                : day
            ),
          },
        });
      },
      
      toggleOptionalPlace: (placeId, include) => {
        // Implementation
      },
      
      getDayByNumber: (dayNumber) => {
        return get().itinerary?.days.find((d) => d.dayNumber === dayNumber);
      },
      
      getTotalDistance: () => {
        return get().itinerary?.totalDistance || 0;
      },
      
      getOptimizationScore: () => {
        return get().itinerary?.optimizationScore || 0;
      },
      
      clearItinerary: () => {
        set({ itinerary: null, error: null });
      },
    }),
    { name: 'itinerary-store' }
  )
);


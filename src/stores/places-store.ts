import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Place, Anchor, ConfidenceLevel } from '@/types/places';

interface PlacesStore {
  // All discovered places
  places: Place[];
  
  // Anchors (subset of places)
  anchors: Anchor[];
  
  // Processing state
  processingIntents: Set<string>;
  
  // Actions
  addPlace: (place: Place) => void;
  addPlaces: (places: Place[]) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  removePlace: (id: string) => void;
  
  promoteToAnchor: (placeId: string) => void;
  demoteFromAnchor: (placeId: string) => void;
  updateAnchorTimeLock: (id: string, timeLock: Anchor['timeLock']) => void;
  reorderAnchors: (ids: string[]) => void;
  
  // Computed
  getPlacesByConfidence: (level: ConfidenceLevel) => Place[];
  getAnchorsByDate: (date: Date) => Anchor[];
  clearAll: () => void;
}

export const usePlacesStore = create<PlacesStore>()(
  persist(
    (set, get) => ({
      places: [],
      anchors: [],
      processingIntents: new Set(),
      
      addPlace: (place) => set((state) => ({
        places: [...state.places, place],
      })),
      
      addPlaces: (newPlaces) => set((state) => ({
        places: [...state.places, ...newPlaces],
      })),
      
      updatePlace: (id, updates) => set((state) => ({
        places: state.places.map((place) =>
          place.id === id ? { ...place, ...updates } : place
        ),
        // Also update if it's an anchor
        anchors: state.anchors.map((anchor) =>
          anchor.id === id ? { ...anchor, ...updates } as Anchor : anchor
        ),
      })),
      
      removePlace: (id) => set((state) => ({
        places: state.places.filter((place) => place.id !== id),
        anchors: state.anchors.filter((anchor) => anchor.id !== id),
      })),
      
      promoteToAnchor: (placeId) => {
        const place = get().places.find((p) => p.id === placeId);
        if (!place) return;
        
        const isAlreadyAnchor = get().anchors.some((a) => a.id === placeId);
        if (isAlreadyAnchor) return;
        
        const anchor: Anchor = {
          ...place,
          isAnchor: true,
          priority: get().anchors.length,
        };
        
        set((state) => ({
          anchors: [...state.anchors, anchor],
        }));
      },
      
      demoteFromAnchor: (placeId) => set((state) => ({
        anchors: state.anchors.filter((anchor) => anchor.id !== placeId),
      })),
      
      updateAnchorTimeLock: (id, timeLock) => set((state) => ({
        anchors: state.anchors.map((anchor) =>
          anchor.id === id ? { ...anchor, timeLock } : anchor
        ),
      })),
      
      reorderAnchors: (ids) => set((state) => {
        const reordered = ids
          .map((id) => state.anchors.find((a) => a.id === id))
          .filter((a): a is Anchor => a !== undefined);
        
        return {
          anchors: reordered.map((anchor, index) => ({
            ...anchor,
            priority: index,
          })),
        };
      }),
      
      getPlacesByConfidence: (level) => {
        return get().places.filter((place) => place.confidence === level);
      },
      
      getAnchorsByDate: (date) => {
        return get().anchors.filter((anchor) => {
          if (!anchor.timeLock) return false;
          const anchorDate = new Date(anchor.timeLock.date);
          return anchorDate.toDateString() === date.toDateString();
        });
      },
      
      clearAll: () => set({
        places: [],
        anchors: [],
        processingIntents: new Set(),
      }),
    }),
    { name: 'places-store' }
  )
);


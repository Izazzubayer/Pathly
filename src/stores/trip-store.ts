import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserContext, TripDetails } from '@/types';

interface TripStore {
  // Current step
  currentStep: 'context' | 'capture' | 'review' | 'itinerary';
  setCurrentStep: (step: TripStore['currentStep']) => void;
  
  // User context (Phase 02)
  userContext: UserContext | null;
  setUserContext: (context: UserContext) => void;
  
  // Trip details (Phase 02)
  tripDetails: TripDetails | null;
  setTripDetails: (details: TripDetails) => void;
  
  // Reset
  reset: () => void;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      currentStep: 'context',
      setCurrentStep: (step) => set({ currentStep: step }),
      
      userContext: null,
      setUserContext: (context) => set({ userContext: context }),
      
      tripDetails: null,
      setTripDetails: (details) => set({ tripDetails: details }),
      
      reset: () => set({
        currentStep: 'context',
        userContext: null,
        tripDetails: null,
      }),
    }),
    { name: 'trip-planner-store' }
  )
);


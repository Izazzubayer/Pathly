import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SocialIntent, ProcessingStatus } from '@/types/social-intent';

interface IntentStore {
  intents: SocialIntent[];
  
  // Actions
  addIntents: (intents: SocialIntent[]) => void;
  removeIntent: (id: string) => void;
  updateIntentStatus: (id: string, status: ProcessingStatus) => void;
  clearAllIntents: () => void;
  
  // Computed
  pendingCount: () => number;
  hasIntents: () => boolean;
}

export const useIntentStore = create<IntentStore>()(
  persist(
    (set, get) => ({
      intents: [],
      
      addIntents: (newIntents) => set((state) => ({
        intents: [...state.intents, ...newIntents],
      })),
      
      removeIntent: (id) => set((state) => ({
        intents: state.intents.filter((intent) => intent.id !== id),
      })),
      
      updateIntentStatus: (id, status) => set((state) => ({
        intents: state.intents.map((intent) =>
          intent.id === id ? { ...intent, status } : intent
        ),
      })),
      
      clearAllIntents: () => set({ intents: [] }),
      
      pendingCount: () => {
        return get().intents.filter((intent) => intent.status === 'pending').length;
      },
      
      hasIntents: () => {
        return get().intents.length > 0;
      },
    }),
    { name: 'intent-store' }
  )
);


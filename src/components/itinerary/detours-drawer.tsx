'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DetourCard } from './detour-card';
import type { DetourScore } from '@/services/route-engine';
import type { Place } from '@/types/places';

interface DetoursDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  detours: DetourScore[];
  onAddDetour: (place: Place, afterPlaceId: string) => void;
  currentDay: number;
  currentPlaceId?: string;
}

export function DetoursDrawer({
  isOpen,
  onClose,
  detours,
  onAddDetour,
  currentDay,
  currentPlaceId,
}: DetoursDrawerProps) {
  // Sort detours by overall score (lower is better, but we want most relevant first)
  const sortedDetours = [...detours].sort((a, b) => {
    // Prioritize on-route, then by relevance
    if (a.status === 'on-route' && b.status !== 'on-route') return -1;
    if (b.status === 'on-route' && a.status !== 'on-route') return 1;
    return a.overallScore - b.overallScore;
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Optional Places</SheetTitle>
          <SheetDescription>
            Places you might want to add along the way. Sorted by proximity and relevance.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <div className="space-y-3 pr-4">
            {sortedDetours.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No optional places available for this segment.
              </p>
            ) : (
              sortedDetours.map((detour) => (
                <DetourCard
                  key={detour.place.id}
                  detour={detour}
                  onAdd={() => {
                    if (currentPlaceId) {
                      onAddDetour(detour.place, currentPlaceId);
                    }
                    onClose();
                  }}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}


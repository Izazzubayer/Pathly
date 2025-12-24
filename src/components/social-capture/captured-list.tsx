'use client';

import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CapturedItem } from './captured-item';
import type { SocialIntent } from '@/types/social-intent';

interface CapturedListProps {
  items: SocialIntent[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function CapturedList({ items, onRemove, onClearAll }: CapturedListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-lg font-semibold">
          Captured Items ({items.length})
        </h3>
        <Button variant="outline" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
      
      <ScrollArea className="flex-1 min-h-0 pr-4">
        <div className="space-y-2">
          <AnimatePresence>
            {items.map((item) => (
              <CapturedItem
                key={item.id}
                intent={item}
                onRemove={() => onRemove(item.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}


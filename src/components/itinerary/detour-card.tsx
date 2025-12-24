'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/custom/status-badge';
import type { DetourScore } from '@/services/route-engine';
import { Plus } from 'lucide-react';

interface DetourCardProps {
  detour: DetourScore;
  onAdd: () => void;
}

export function DetourCard({ detour, onAdd }: DetourCardProps) {
  const icon = detour.status === 'on-route' ? '🟢' : detour.status === 'detour' ? '🟡' : '🔵';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{icon}</span>
              <h3 className="font-semibold truncate">{detour.place.name}</h3>
              <StatusBadge status={detour.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {detour.extraTime > 0 ? `+${detour.extraTime} min detour` : 'On the way'}
              {detour.relevanceScore > 0.5 && ' • Matches your vibe'}
            </p>
            <p className="text-xs text-muted-foreground">
              {detour.place.activityType}
            </p>
          </div>
          <Button size="sm" onClick={onAdd} className="shrink-0">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


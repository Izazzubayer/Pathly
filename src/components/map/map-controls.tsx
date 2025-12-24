'use client';

import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  className?: string;
}

export function MapControls({ onZoomIn, onZoomOut, onRecenter, className }: MapControlsProps) {
  return (
    <div className={cn('absolute bottom-4 right-4 flex flex-col gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="bg-background/80 backdrop-blur-sm"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="bg-background/80 backdrop-blur-sm"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onRecenter}
        className="bg-background/80 backdrop-blur-sm"
        aria-label="Recenter map"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


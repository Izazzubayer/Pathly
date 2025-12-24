'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RotateCcw, RefreshCw, Undo2 } from 'lucide-react';

interface RegenerateControlsProps {
  dayNumber: number;
  onRegenerateDay: () => void;
  onOptimizeOrder: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function RegenerateControls({
  dayNumber,
  onRegenerateDay,
  onOptimizeOrder,
  onUndo,
  canUndo = false,
}: RegenerateControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onOptimizeOrder}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Optimize Order
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Regenerate Day
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate Day {dayNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will regenerate the entire day's itinerary. Your current arrangement will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onRegenerateDay}>
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {onUndo && canUndo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
        >
          <Undo2 className="h-4 w-4 mr-1" />
          Undo
        </Button>
      )}
    </div>
  );
}


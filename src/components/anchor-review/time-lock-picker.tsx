'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Anchor } from '@/types/places';
import { cn } from '@/lib/utils';
import { useTripStore } from '@/stores/trip-store';

interface TimeLockPickerProps {
  value?: Anchor['timeLock'];
  onChange: (timeLock: Anchor['timeLock']) => void;
  onClose: () => void;
}

export function TimeLockPicker({ value, onChange, onClose }: TimeLockPickerProps) {
  const { tripDetails } = useTripStore();
  const [date, setDate] = useState<Date | undefined>(
    value?.date ? new Date(value.date) : undefined
  );
  const [time, setTime] = useState(value?.time || '');
  const [flexible, setFlexible] = useState(value?.flexible ?? false);

  const handleSave = () => {
    if (!date) return;
    
    onChange({
      date,
      time: time || undefined,
      flexible,
    });
    onClose();
  };

  const handleClear = () => {
    onChange(undefined);
    onClose();
  };

  const minDate = tripDetails?.startDate ? new Date(tripDetails.startDate) : undefined;
  const maxDate = tripDetails?.endDate ? new Date(tripDetails.endDate) : undefined;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => {
                if (minDate && d < minDate) return true;
                if (maxDate && d > maxDate) return true;
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time (optional)</Label>
        <Input
          id="time"
          placeholder="e.g., 14:00 or evening"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="flexible">Flexible within day</Label>
        <Switch
          id="flexible"
          checked={flexible}
          onCheckedChange={setFlexible}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1" disabled={!date}>
          Save
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}


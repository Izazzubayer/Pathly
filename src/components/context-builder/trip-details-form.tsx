'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { TripDetails } from '@/types';

interface TripDetailsFormProps {
  onComplete: (details: TripDetails) => void;
  initialDetails?: Partial<TripDetails>;
}

export function TripDetailsForm({ onComplete, initialDetails }: TripDetailsFormProps) {
  const [destination, setDestination] = useState(initialDetails?.destination || '');
  const [hotelName, setHotelName] = useState(initialDetails?.hotelName || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialDetails?.startDate ? new Date(initialDetails.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialDetails?.endDate ? new Date(initialDetails.endDate) : undefined
  );

  const calculateDuration = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination || !startDate || !endDate) {
      return;
    }

    const details: TripDetails = {
      destination,
      hotelName: hotelName || undefined,
      startDate,
      endDate,
      duration: calculateDuration(),
    };

    onComplete(details);
  };

  const isValid = destination && startDate && endDate && endDate > startDate;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us about your trip</CardTitle>
        <CardDescription>
          Where are you going and when? This helps us plan the perfect itinerary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              placeholder="e.g., Bangkok, Thailand"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel / Accommodation (optional)</Label>
            <Input
              id="hotel"
              placeholder="e.g., Four Wings Hotel"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && (
            <p className="text-sm text-muted-foreground">
              Duration: {calculateDuration()} day{calculateDuration() !== 1 ? 's' : ''}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={!isValid}>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


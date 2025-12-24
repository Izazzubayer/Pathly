'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserContext } from '@/types';
import { questions } from '@/lib/questions';

interface SummaryCardProps {
  context: UserContext;
  onEdit: () => void;
  onContinue: () => void;
}

export function SummaryCard({ context, onEdit, onContinue }: SummaryCardProps) {
  const getAnswerLabel = (field: keyof UserContext, value: string) => {
    const question = questions.find((q) => q.field === field);
    const option = question?.options.find((opt) => opt.value === value);
    return option ? `${option.icon} ${option.label}` : value;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Review Your Preferences</CardTitle>
        <CardDescription>
          Make sure everything looks good before we start planning your trip.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Traveling with:</span>
            <Badge variant="secondary">
              {getAnswerLabel('companion', context.companion)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trip vibe:</span>
            <Badge variant="secondary">
              {getAnswerLabel('vibe', context.vibe)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Energy level:</span>
            <Badge variant="secondary">
              {getAnswerLabel('energy', context.energy)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Budget:</span>
            <Badge variant="secondary">
              {getAnswerLabel('budget', context.budget)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mobility:</span>
            <Badge variant="secondary">
              {getAnswerLabel('mobility', context.mobility)}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onEdit} className="flex-1">
            Edit
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


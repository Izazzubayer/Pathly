'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropZone } from '@/components/social-capture/drop-zone';
import { CapturedList } from '@/components/social-capture/captured-list';
import { useIntentStore } from '@/stores/intent-store';
import { useTripStore } from '@/stores/trip-store';
import { ArrowRight } from 'lucide-react';

export default function CapturePage() {
  const router = useRouter();
  const { intents, addIntents, removeIntent, clearAllIntents, hasIntents } = useIntentStore();
  const { setCurrentStep } = useTripStore();

  const handleCapture = (newIntents: typeof intents) => {
    addIntents(newIntents);
  };

  const handleContinue = () => {
    if (hasIntents()) {
      setCurrentStep('review');
      router.push('/review');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 min-h-screen flex flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold mb-2">Share your inspiration</h1>
        <p className="text-muted-foreground">
          Paste Instagram links, posts, or text references. We'll extract the places for you.
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="shrink-0">
          <DropZone onCapture={handleCapture} />
        </div>
        
        {hasIntents() && (
          <>
            <div className="flex-1 min-h-0 flex flex-col">
              <CapturedList
                items={intents}
                onRemove={removeIntent}
                onClearAll={clearAllIntents}
              />
            </div>
            
            <div className="shrink-0 flex justify-end pt-4 pb-2 border-t bg-background sticky bottom-0">
              <Button onClick={handleContinue} size="lg" className="shadow-lg">
                Continue to Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatContainer } from '@/components/context-builder/chat-container';
import { SummaryCard } from '@/components/context-builder/summary-card';
import { TripDetailsForm } from '@/components/context-builder/trip-details-form';
import { useTripStore } from '@/stores/trip-store';
import type { UserContext, TripDetails } from '@/types';

type FlowStep = 'questions' | 'summary' | 'trip-details';

export default function ContextPage() {
  const router = useRouter();
  const { userContext, tripDetails, setUserContext, setTripDetails, setCurrentStep } = useTripStore();
  
  const [flowStep, setFlowStep] = useState<FlowStep>(
    userContext ? (tripDetails ? 'summary' : 'trip-details') : 'questions'
  );
  const [context, setContext] = useState<UserContext | null>(userContext);

  const handleContextComplete = (newContext: UserContext) => {
    setContext(newContext);
    setUserContext(newContext);
    setFlowStep('summary');
  };

  const handleSummaryContinue = () => {
    if (tripDetails) {
      // Already have trip details, go to next step
      setCurrentStep('capture');
      router.push('/capture');
    } else {
      // Need trip details
      setFlowStep('trip-details');
    }
  };

  const handleSummaryEdit = () => {
    setFlowStep('questions');
    setContext(null);
  };

  const handleTripDetailsComplete = (details: TripDetails) => {
    setTripDetails(details);
    setCurrentStep('capture');
    router.push('/capture');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Let's get to know you</h1>
        <p className="text-muted-foreground">
          We'll ask a few quick questions to personalize your itinerary.
        </p>
      </div>

      <div className="flex-1">
        {flowStep === 'questions' && (
          <div className="h-[600px] border rounded-lg">
            <ChatContainer
              onComplete={handleContextComplete}
              initialContext={context || undefined}
            />
          </div>
        )}

        {flowStep === 'summary' && context && (
          <SummaryCard
            context={context}
            onEdit={handleSummaryEdit}
            onContinue={handleSummaryContinue}
          />
        )}

        {flowStep === 'trip-details' && (
          <TripDetailsForm
            onComplete={handleTripDetailsComplete}
            initialDetails={tripDetails || undefined}
          />
        )}
      </div>
    </div>
  );
}


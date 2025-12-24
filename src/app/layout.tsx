import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { SkipLink } from '@/components/accessibility/skip-link';
import { ErrorBoundary } from '@/components/error-boundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trip Planner - Route-Aware AI Itineraries',
  description: 'Transform social inspiration into efficient, route-optimized travel itineraries.',
  keywords: ['travel', 'itinerary', 'trip planning', 'route optimization', 'AI travel'],
  authors: [{ name: 'Izaz Zubayer' }],
  openGraph: {
    title: 'Trip Planner - Route-Aware AI Itineraries',
    description: 'Transform social inspiration into efficient, route-optimized travel itineraries.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SkipLink />
        <ErrorBoundary>
          <main id="main-content">{children}</main>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}


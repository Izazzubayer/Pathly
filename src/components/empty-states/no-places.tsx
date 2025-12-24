'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export function NoPlacesEmptyState() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <MapPin className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="text-center">No places found yet</CardTitle>
        <CardDescription className="text-center">
          Start by capturing your social inspiration or adding places manually.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/capture">Add Instagram Links</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/review">Add Places Manually</Link>
        </Button>
      </CardContent>
    </Card>
  );
}


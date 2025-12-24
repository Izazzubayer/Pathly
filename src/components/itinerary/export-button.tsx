'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Code } from 'lucide-react';
import { exportItineraryAsText, exportItineraryAsJSON, downloadFile } from '@/lib/export/itinerary-export';
import type { Itinerary } from '@/types/itinerary';

interface ExportButtonProps {
  itinerary: Itinerary;
}

export function ExportButton({ itinerary }: ExportButtonProps) {
  const handleExportText = () => {
    const text = exportItineraryAsText(itinerary);
    const filename = `itinerary-${itinerary.tripDetails.destination.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(text, filename, 'text/plain');
  };

  const handleExportJSON = () => {
    const json = exportItineraryAsJSON(itinerary);
    const filename = `itinerary-${itinerary.tripDetails.destination.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(json, filename, 'application/json');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <Code className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


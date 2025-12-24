import type { Itinerary } from '@/types/itinerary';
import { format } from 'date-fns';

/**
 * Export itinerary as plain text
 */
export function exportItineraryAsText(itinerary: Itinerary): string {
  let text = `🗺️ ${itinerary.tripDetails.destination} Itinerary\n`;
  text += `Generated on ${format(itinerary.createdAt, 'MMMM d, yyyy')}\n\n`;
  text += `Total Distance: ${Math.round(itinerary.totalDistance / 1000)} km\n`;
  text += `Total Duration: ${Math.round(itinerary.totalDuration / 60)} hours\n`;
  text += `Optimization Score: ${itinerary.optimizationScore}/100\n\n`;
  text += '─'.repeat(50) + '\n\n';

  itinerary.days.forEach((day) => {
    text += `Day ${day.dayNumber} - ${format(day.date, 'EEEE, MMMM d')}\n`;
    text += '─'.repeat(50) + '\n\n';

    day.places.forEach((place, index) => {
      text += `${index + 1}. ${place.place.name}\n`;
      text += `   ⏰ ${place.arrivalTime} - ${place.departureTime} (${place.duration} min)\n`;
      if (place.isAnchor) {
        text += `   ⭐ Anchor (Must Visit)\n`;
      }
      text += `   📍 ${place.place.activityType}\n`;
      if (place.reason) {
        text += `   💡 ${place.reason}\n`;
      }
      if (place.distanceFromPrevious > 0) {
        text += `   🚶 ${Math.round(place.distanceFromPrevious / 1000 * 10) / 10} km from previous\n`;
      }
      text += '\n';
    });

    text += '\n';
  });

  return text;
}

/**
 * Export itinerary as JSON
 */
export function exportItineraryAsJSON(itinerary: Itinerary): string {
  return JSON.stringify(itinerary, null, 2);
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


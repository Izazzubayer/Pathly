import type { UserContext } from '@/types';
import type { ItineraryDay, TimeSlot } from '@/types/itinerary';
import { estimateActivityDuration } from '@/lib/geo/distance';
import type { ActivityType } from '@/types/places';

export interface SlotConfig {
  morning: { start: string; end: string; maxPlaces: number };
  afternoon: { start: string; end: string; maxPlaces: number };
  evening: { start: string; end: string; maxPlaces: number };
  night: { start: string; end: string; maxPlaces: number };
}

export function getSlotConfig(userContext: UserContext): SlotConfig {
  const baseConfig: SlotConfig = {
    morning: { start: '09:00', end: '12:00', maxPlaces: 2 },
    afternoon: { start: '12:00', end: '17:00', maxPlaces: 3 },
    evening: { start: '17:00', end: '21:00', maxPlaces: 2 },
    night: { start: '21:00', end: '24:00', maxPlaces: 2 },
  };
  
  // Adjust based on energy level
  if (userContext.energy === 'low') {
    baseConfig.morning.maxPlaces = 1;
    baseConfig.afternoon.maxPlaces = 2;
    baseConfig.evening.maxPlaces = 1;
  }
  
  if (userContext.energy === 'high') {
    baseConfig.morning.start = '08:00';
    baseConfig.afternoon.maxPlaces = 4;
    baseConfig.evening.maxPlaces = 3;
  }
  
  // Adjust based on vibe
  if (userContext.vibe === 'party') {
    baseConfig.night.end = '02:00';
    baseConfig.morning.start = '11:00';
    baseConfig.night.maxPlaces = 3;
  }
  
  if (userContext.vibe === 'chill') {
    baseConfig.morning.start = '10:00';
    baseConfig.afternoon.maxPlaces = 2;
  }
  
  return baseConfig;
}

/**
 * Assign places to time slots based on activity type and user context
 */
export function assignTimeSlots(day: ItineraryDay, userContext: UserContext): ItineraryDay {
  const config = getSlotConfig(userContext);
  const slots: TimeSlot[] = [];
  
  // Group places by activity type preference
  const morningPlaces = day.places.filter((p) => 
    ['cafe', 'attraction', 'viewpoint', 'temple', 'nature'].includes(p.place.activityType)
  );
  
  const afternoonPlaces = day.places.filter((p) =>
    ['attraction', 'museum', 'shopping', 'market', 'beach'].includes(p.place.activityType)
  );
  
  const eveningPlaces = day.places.filter((p) =>
    ['restaurant', 'bar', 'viewpoint'].includes(p.place.activityType)
  );
  
  const nightPlaces = day.places.filter((p) =>
    ['club', 'bar'].includes(p.place.activityType)
  );
  
  // Remaining places go to afternoon
  const remainingPlaces = day.places.filter((p) =>
    !morningPlaces.includes(p) &&
    !afternoonPlaces.includes(p) &&
    !eveningPlaces.includes(p) &&
    !nightPlaces.includes(p)
  );
  
  // Create slots
  if (morningPlaces.length > 0) {
    slots.push({
      type: 'morning',
      startTime: config.morning.start,
      endTime: config.morning.end,
      places: morningPlaces.slice(0, config.morning.maxPlaces),
    });
  }
  
  if (afternoonPlaces.length > 0 || remainingPlaces.length > 0) {
    const allAfternoon = [...afternoonPlaces, ...remainingPlaces].slice(0, config.afternoon.maxPlaces);
    if (allAfternoon.length > 0) {
      slots.push({
        type: 'afternoon',
        startTime: config.afternoon.start,
        endTime: config.afternoon.end,
        places: allAfternoon,
      });
    }
  }
  
  if (eveningPlaces.length > 0) {
    slots.push({
      type: 'evening',
      startTime: config.evening.start,
      endTime: config.evening.end,
      places: eveningPlaces.slice(0, config.evening.maxPlaces),
    });
  }
  
  if (nightPlaces.length > 0) {
    slots.push({
      type: 'night',
      startTime: config.night.start,
      endTime: config.night.end,
      places: nightPlaces.slice(0, config.night.maxPlaces),
    });
  }
  
  return {
    ...day,
    slots,
  };
}


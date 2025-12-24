import type { TravelCompanion, TravelVibe, EnergyLevel, BudgetLevel, MobilityLevel } from '@/types';

export interface QuestionOption {
  value: string;
  label: string;
  icon: string;
}

export interface Question {
  id: string;
  message: string;
  type: 'single-select';
  options: QuestionOption[];
  field: keyof {
    companion: TravelCompanion;
    vibe: TravelVibe;
    energy: EnergyLevel;
    budget: BudgetLevel;
    mobility: MobilityLevel;
  };
}

export const questions: Question[] = [
  {
    id: 'companion',
    message: "Who are you traveling with?",
    type: 'single-select',
    field: 'companion',
    options: [
      { value: 'solo', label: 'Just me', icon: '🧍' },
      { value: 'couple', label: 'With my partner', icon: '💑' },
      { value: 'friends', label: 'Friends', icon: '👯' },
      { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    id: 'vibe',
    message: "What kind of trip vibe are you going for?",
    type: 'single-select',
    field: 'vibe',
    options: [
      { value: 'romantic', label: 'Romantic', icon: '💕' },
      { value: 'party', label: 'Party & Nightlife', icon: '🎉' },
      { value: 'cultural', label: 'Cultural & History', icon: '🏛️' },
      { value: 'chill', label: 'Relaxed & Chill', icon: '🌴' },
      { value: 'balanced', label: 'Mix of everything', icon: '⚖️' },
    ],
  },
  {
    id: 'energy',
    message: "How packed do you want your days?",
    type: 'single-select',
    field: 'energy',
    options: [
      { value: 'low', label: 'Easy pace, few activities', icon: '🐢' },
      { value: 'medium', label: 'Balanced, with breaks', icon: '🚶' },
      { value: 'high', label: 'Action-packed!', icon: '🏃' },
    ],
  },
  {
    id: 'budget',
    message: "What's your budget comfort level?",
    type: 'single-select',
    field: 'budget',
    options: [
      { value: 'budget', label: 'Budget-conscious', icon: '💰' },
      { value: 'moderate', label: 'Moderate spending', icon: '💳' },
      { value: 'flexible', label: 'Flexible', icon: '💎' },
      { value: 'luxury', label: 'Treat myself', icon: '👑' },
    ],
  },
  {
    id: 'mobility',
    message: "How much walking/moving are you comfortable with?",
    type: 'single-select',
    field: 'mobility',
    options: [
      { value: 'limited', label: 'Prefer minimal walking', icon: '🚗' },
      { value: 'moderate', label: 'Some walking is fine', icon: '🚶' },
      { value: 'high', label: 'Love exploring on foot', icon: '🥾' },
    ],
  },
];


'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QuestionOption } from '@/lib/questions';

interface OptionChipsProps {
  options: QuestionOption[];
  selected?: string;
  onSelect: (value: string) => void;
}

const chipVariants = {
  tap: { scale: 0.98 },
};

export function OptionChips({ options, selected, onSelect }: OptionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <motion.div
            key={option.value}
            variants={chipVariants}
            whileTap="tap"
          >
            <Button
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              size="lg"
              onClick={() => onSelect(option.value)}
              className={cn(
                'h-auto min-h-[44px] px-4 py-3 flex items-center gap-2',
                isSelected && 'bg-primary text-primary-foreground'
              )}
            >
              <span className="text-xl">{option.icon}</span>
              <span>{option.label}</span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}


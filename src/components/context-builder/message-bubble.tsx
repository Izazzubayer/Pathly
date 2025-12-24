'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  type: 'system' | 'user';
  children: React.ReactNode;
  animate?: boolean;
}

export function MessageBubble({ type, children, animate = true }: MessageBubbleProps) {
  const isSystem = type === 'system';

  const content = (
    <div
      className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isSystem
          ? 'bg-muted text-foreground'
          : 'bg-primary text-primary-foreground ml-auto'
      )}
    >
      {children}
    </div>
  );

  if (!animate) {
    return (
      <div className={cn('flex w-full', isSystem ? 'justify-start' : 'justify-end')}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={cn('flex w-full', isSystem ? 'justify-start' : 'justify-end')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}


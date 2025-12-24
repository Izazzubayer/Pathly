'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <motion.div
        className="h-2 w-2 rounded-full bg-muted-foreground"
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="h-2 w-2 rounded-full bg-muted-foreground"
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.2,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="h-2 w-2 rounded-full bg-muted-foreground"
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}


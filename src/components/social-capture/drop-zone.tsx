'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseInput } from '@/lib/intent-parser';
import type { SocialIntent } from '@/types/social-intent';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onCapture: (intents: SocialIntent[]) => void;
  disabled?: boolean;
}

type DropZoneState = 'idle' | 'active' | 'success' | 'error';

export function DropZone({ onCapture, disabled }: DropZoneProps) {
  const [state, setState] = useState<DropZoneState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus textarea on mount for better UX
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.trim()) {
      processInput(pastedText);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      processInput(value);
      // Clear input after processing
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Cmd/Ctrl+V to work
    if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      // Let the paste event handle it
      return;
    }
  };

  const processInput = (input: string) => {
    if (!input.trim()) return;

    setState('active');
    setError(null);
    setWarnings([]);

    try {
      const result = parseInput(input);
      
      if (result.intents.length === 0) {
        setError('No valid links or text found. Please paste Instagram links or text references.');
        setState('error');
        return;
      }

      setWarnings(result.warnings);
      onCapture(result.intents);
      
      // Show success state briefly
      setState('success');
      setTimeout(() => {
        setState('idle');
        setWarnings([]);
      }, 1500);
    } catch (err) {
      setError('Failed to process input. Please try again.');
      setState('error');
    }
  };

  const dropZoneVariants = {
    idle: {
      scale: 1,
      borderColor: 'hsl(var(--border))',
    },
    active: {
      scale: 1.01,
      borderColor: 'hsl(var(--primary))',
      transition: { duration: 0.2 },
    },
    success: {
      scale: [1, 1.02, 1],
      borderColor: 'hsl(142 76% 36%)',
      transition: { duration: 0.3 },
    },
    error: {
      x: [0, -5, 5, -5, 5, 0],
      borderColor: 'hsl(var(--destructive))',
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-4">
      <motion.div
        variants={dropZoneVariants}
        animate={state}
        className="relative"
      >
        <Card className="border-2 border-dashed p-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <motion.div
              animate={state === 'active' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: state === 'active' ? Infinity : 0 }}
            >
              {state === 'success' ? (
                <Check className="h-12 w-12 text-green-600" />
              ) : state === 'error' ? (
                <AlertCircle className="h-12 w-12 text-destructive" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {state === 'success' 
                  ? 'Captured!' 
                  : state === 'error'
                    ? 'Error'
                    : 'Paste your Instagram links or text'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Paste Instagram Reel links, Post links, or text references. One per line.
              </p>
            </div>

            <textarea
              ref={textareaRef}
              className={cn(
                'w-full min-h-[120px] px-4 py-3 rounded-md border bg-background',
                'text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary',
                'placeholder:text-muted-foreground'
              )}
              placeholder="https://www.instagram.com/reel/ABC123/&#10;https://www.instagram.com/p/XYZ789/&#10;That cool rooftop bar in Bangkok"
              onPaste={handlePaste}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


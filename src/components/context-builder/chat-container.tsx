'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { OptionChips } from './option-chips';
import { TypingIndicator } from './typing-indicator';
import { ProgressBar } from './progress-bar';
import { questions } from '@/lib/questions';
import type { UserContext } from '@/types';

interface ChatContainerProps {
  onComplete: (context: UserContext) => void;
  initialContext?: Partial<UserContext>;
}

export function ChatContainer({ onComplete, initialContext }: ChatContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserContext>>(initialContext || {});
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'system' | 'user'; content: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isComplete = currentQuestionIndex >= questions.length;

  useEffect(() => {
    // Show first question after a brief delay
    if (currentQuestionIndex === 0 && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ type: 'system', content: currentQuestion.message }]);
      }, 800);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelect = (value: string) => {
    const field = currentQuestion.field;
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    // Add user's selection as a message
    const selectedOption = currentQuestion.options.find((opt) => opt.value === value);
    setMessages((prev) => [
      ...prev,
      { type: 'user', content: `${selectedOption?.icon} ${selectedOption?.label}` },
    ]);

    // Move to next question
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setMessages((prev) => [
          ...prev,
          { type: 'system', content: questions[nextIndex].message },
        ]);
      } else {
        // All questions answered
        const completeContext = newAnswers as UserContext;
        onComplete(completeContext);
      }
    }, 600);
  };

  if (isComplete) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
      
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-4 py-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageBubble key={index} type={message.type}>
                {message.content}
              </MessageBubble>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {!isTyping && currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="px-4 pb-4"
        >
          <OptionChips
            options={currentQuestion.options}
            selected={answers[currentQuestion.field] as string}
            onSelect={handleSelect}
          />
        </motion.div>
      )}
    </div>
  );
}


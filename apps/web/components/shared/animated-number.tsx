'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';

export default function NumberAnimation({
  baseNumber,
  isIncremented,
}: {
  baseNumber: number;
  isIncremented: boolean;
}) {
  const baseNumberMemo = useMemo(() => baseNumber, []);
  const [animationState, setAnimationState] = useState<'idle' | 'increment'>('idle');

  useEffect(() => {
    if (isIncremented) {
      setAnimationState('increment');
    } else {
      setAnimationState('idle');
    }
  }, [isIncremented]);

  const numberAnimation: Record<string, AnimationProps['variants']> = {
    baseNumber: {
      idle: {
        y: 0,
      },
      increment: {
        y: -20,
      },
    },
    incrementedNumber: {
      idle: {
        y: 10,
      },
      increment: {
        y: -20,
      },
    },
  };

  return (
    <AnimatePresence>
      <span className='relative flex h-4 w-fit flex-col items-center gap-1 overflow-hidden'>
        <motion.span
          key={baseNumberMemo}
          variants={numberAnimation.baseNumber}
          animate={animationState}
          className='text-foreground/60 inline-block text-xs'>
          {baseNumberMemo}
        </motion.span>
        <motion.span
          key={baseNumberMemo + 1}
          variants={numberAnimation.incrementedNumber}
          animate={animationState}
          className='inline-block text-xs'>
          {baseNumberMemo + 1}
        </motion.span>
      </span>
    </AnimatePresence>
  );
}

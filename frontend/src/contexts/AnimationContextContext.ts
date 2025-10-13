import { createContext } from 'react';
import type { AnimationType } from '../types/animation';
import type { Variants } from 'framer-motion';

export interface AnimationContextType {
  animationsEnabled: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
  preferReducedMotion: boolean;
  getAnimationVariant: (type: AnimationType) => Variants;
  toggleAnimations: () => void;
  setAnimationSpeed: (speed: 'fast' | 'normal' | 'slow') => void;
  setPreferReducedMotion: (reduced: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export { AnimationContext };
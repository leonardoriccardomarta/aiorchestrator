import { useState, ReactNode } from 'react';
import { Variants } from 'framer-motion';
import { AnimationContext } from './AnimationContextContext';

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<'fast' | 'normal' | 'slow'>('normal');
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);

  const getSpeedMultiplier = () => {
    switch (animationSpeed) {
      case 'fast':
        return 0.7;
      case 'slow':
        return 1.3;
      default:
        return 1;
    }
  };

  const modifyVariantDuration = (variant: Variants): Variants => {
    if (!animationsEnabled || preferReducedMotion) {
      return {
        initial: {},
        animate: {},
        exit: {},
      };
    }
    const speedMultiplier = getSpeedMultiplier();
    const newVariant: Variants = {};
    Object.entries(variant).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const transition = (value as Record<string, unknown>).transition as Record<string, unknown>;
        newVariant[key] = {
          ...value,
          transition: {
            ...transition,
            duration: typeof transition?.duration === 'number'
              ? transition.duration * speedMultiplier
              : undefined
          }
        };
      } else {
        newVariant[key] = value;
      }
    });
    return newVariant;
  };

  const getAnimationVariant = (type: string): Variants => {
    const emptyVariant: Variants = {
      initial: {},
      animate: {},
      exit: {},
    };
    
    switch (type) {
      case 'fade':
        return modifyVariantDuration(emptyVariant);
      case 'slideUp':
        return modifyVariantDuration(emptyVariant);
      case 'slideDown':
        return modifyVariantDuration(emptyVariant);
      case 'slideRight':
        return modifyVariantDuration(emptyVariant);
      case 'slideLeft':
        return modifyVariantDuration(emptyVariant);
      case 'scale':
        return modifyVariantDuration(emptyVariant);
      case 'rotate':
        return modifyVariantDuration(emptyVariant);
      case 'pop':
        return modifyVariantDuration(emptyVariant);
      case 'listItem':
        return modifyVariantDuration(emptyVariant);
      case 'stagger':
        return modifyVariantDuration(emptyVariant);
      default:
        return modifyVariantDuration(emptyVariant);
    }
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };

  const value = {
    animationsEnabled,
    animationSpeed,
    preferReducedMotion,
    getAnimationVariant,
    toggleAnimations,
    setAnimationSpeed,
    setPreferReducedMotion,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}; 
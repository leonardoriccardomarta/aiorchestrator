import { useState, useRef, useCallback, useEffect } from 'react';

export interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onPinch?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  swipeThreshold?: number;
  tapThreshold?: number;
  preventDefault?: boolean;
}

export interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  startTime: number;
  isTouching: boolean;
  touchCount: number;
}

export const useTouchGestures = (options: TouchGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onPinch,
    onPan,
    swipeThreshold = 50,
    tapThreshold = 5,
    preventDefault = true,
  } = options;

  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    startTime: 0,
    isTouching: false,
    touchCount: 0,
  });

  const lastTapTime = useRef(0);
  const initialDistance = useRef(0);
  const initialScale = useRef(1);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) e.preventDefault();

    const touch = e.touches[0];
    const startTime = Date.now();

    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      startTime,
      isTouching: true,
      touchCount: e.touches.length,
    });

    // Handle pinch gesture
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      initialDistance.current = distance;
    }
  }, [preventDefault]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault) e.preventDefault();

    if (!touchState.isTouching) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    setTouchState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY,
    }));

    // Handle pan gesture
    if (onPan && e.touches.length === 1) {
      onPan(deltaX, deltaY);
    }

    // Handle pinch gesture
    if (onPinch && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      const scale = currentDistance / initialDistance.current;
      onPinch(scale);
    }
  }, [touchState, onPan, onPinch, preventDefault]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (preventDefault) e.preventDefault();

    if (!touchState.isTouching) return;

    const deltaX = touchState.deltaX;
    const deltaY = touchState.deltaY;
    const deltaTime = Date.now() - touchState.startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    setTouchState(prev => ({
      ...prev,
      isTouching: false,
      touchCount: 0,
    }));

    // Handle swipe gestures
    if (distance > swipeThreshold && deltaTime < 300) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    // Handle tap gestures
    if (distance < tapThreshold && deltaTime < 300) {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTapTime.current;

      if (timeDiff < 300) {
        onDoubleTap?.();
      } else {
        onTap?.();
      }

      lastTapTime.current = currentTime;
    }
  }, [touchState, swipeThreshold, tapThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap, preventDefault]);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    node.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    node.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    node.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  return {
    ref,
    touchState,
    isTouching: touchState.isTouching,
  };
};

// Hook for swipe navigation
export const useSwipeNavigation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { ref } = useTouchGestures({
    onSwipeLeft: () => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => setIsAnimating(false), 300);
      }
    },
    onSwipeRight: () => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex(prev => Math.max(0, prev - 1));
        setTimeout(() => setIsAnimating(false), 300);
      }
    },
  });

  return {
    ref,
    currentIndex,
    setCurrentIndex,
    isAnimating,
  };
};

// Hook for pull-to-refresh
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const refreshThreshold = 80;

  const { ref } = useTouchGestures({
    onPan: (deltaX, deltaY) => {
      if (window.scrollY === 0 && deltaY > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(deltaY, refreshThreshold * 1.5));
      }
    },
    onSwipeDown: async () => {
      if (pullDistance > refreshThreshold && !isRefreshing) {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
      }
    },
  });

  return {
    ref,
    isRefreshing,
    pullDistance,
    isPulling,
    canRefresh: pullDistance > refreshThreshold,
  };
};

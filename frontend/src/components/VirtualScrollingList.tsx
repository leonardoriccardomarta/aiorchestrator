import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualScrollingListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface VirtualScrollingState {
  scrollTop: number;
  containerHeight: number;
  itemHeight: number;
  overscan: number;
}

/**
 * Virtual Scrolling List Component for efficient rendering of large datasets
 */
export function VirtualScrollingList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onScroll,
  className = '',
  style = {}
}: VirtualScrollingListProps<T>) {
  const [state, setState] = useState<VirtualScrollingState>({
    scrollTop: 0,
    containerHeight,
    itemHeight,
    overscan
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(state.scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex,
      offsetY: startIndex * itemHeight
    };
  }, [state, items.length, containerHeight, itemHeight, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, visibleRange]);

  // Handle scroll event
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    
    setState(prev => ({
      ...prev,
      scrollTop
    }));

    onScroll?.(scrollTop);
  }, [onScroll]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number) => {
    if (scrollElementRef.current) {
      const scrollTop = index * itemHeight;
      scrollElementRef.current.scrollTop = scrollTop;
    }
  }, [itemHeight]);



  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    scrollToItem(items.length - 1);
  }, [scrollToItem, items.length]);

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (items.length > 0 && state.scrollTop > 0) {
      const isNearBottom = state.scrollTop + containerHeight >= (items.length - 1) * itemHeight;
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [items.length, state.scrollTop, containerHeight, itemHeight, scrollToBottom]);

  // Update container height when it changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      containerHeight
    }));
  }, [containerHeight]);

  // Calculate total height
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`virtual-scrolling-container ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        ...style
      }}
      onScroll={handleScroll}
    >
      <div
        ref={scrollElementRef}
        style={{
          height: totalHeight,
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${visibleRange.offsetY}px)`
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                position: 'relative'
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Optimized List Item Component
 */
export const OptimizedListItem = React.memo<{
  children: React.ReactNode;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}>(({ children, height, className = '', style = {} }) => (
  <div
    className={`virtual-list-item ${className}`}
    style={{
      height,
      position: 'relative',
      ...style
    }}
  >
    {children}
  </div>
));

OptimizedListItem.displayName = 'OptimizedListItem';
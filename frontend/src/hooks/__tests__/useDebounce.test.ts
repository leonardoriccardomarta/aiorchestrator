import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    // Change value
    rerender({ value: 'changed', delay: 300 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial');
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Now value should be updated
    expect(result.current).toBe('changed');
  });

  it('cancels previous timeout on new value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    // Change value multiple times quickly
    rerender({ value: 'first', delay: 300 });
    rerender({ value: 'second', delay: 300 });
    rerender({ value: 'third', delay: 300 });
    
    // Value should still be initial
    expect(result.current).toBe('initial');
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Should only show the last value
    expect(result.current).toBe('third');
  });

  it('works with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    rerender({ value: 'changed', delay: 100 });
    
    // Should not change immediately
    expect(result.current).toBe('initial');
    
    // Fast forward less than delay
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    // Should still not change
    expect(result.current).toBe('initial');
    
    // Fast forward to complete delay
    act(() => {
      vi.advanceTimersByTime(50);
    });
    
    // Now should change
    expect(result.current).toBe('changed');
  });

  it('works with numbers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    rerender({ value: 42, delay: 300 });
    
    expect(result.current).toBe(0);
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe(42);
  });

  it('works with objects', () => {
    const initialObj = { name: 'initial' };
    const changedObj = { name: 'changed' };
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } }
    );

    rerender({ value: changedObj, delay: 300 });
    
    expect(result.current).toBe(initialObj);
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe(changedObj);
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = renderHook(() => useDebounce('test', 300));
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
}); 
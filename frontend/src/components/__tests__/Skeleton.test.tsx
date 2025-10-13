import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skeleton, { SkeletonText, SkeletonCard, SkeletonTable } from '../Skeleton';

// Mock the test matchers
declare global {
  interface JestMatchers<R> {
    toHaveStyle(style: Record<string, string>): R;
  }
}

describe('Skeleton', () => {
  it('renders the correct number of skeleton elements', () => {
    render(<Skeleton count={3} />);
    const elements = screen.getAllByTestId('skeleton-loader');
    expect(elements).toHaveLength(3);
  });

  it('applies custom width and height', () => {
    render(<Skeleton width={200} height={100} />);
    const element = screen.getByTestId('skeleton-loader');
    expect(element).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('applies circle style when circle prop is true', () => {
    render(<Skeleton circle />);
    const element = screen.getByTestId('skeleton-loader');
    expect(element).toHaveStyle({ borderRadius: '50%' });
  });
});

describe('SkeletonText', () => {
  it('renders the correct number of lines', () => {
    render(<SkeletonText lines={4} />);
    const elements = screen.getAllByTestId('skeleton-loader');
    expect(elements).toHaveLength(4);
  });
});

describe('SkeletonCard', () => {
  it('renders a card with avatar and text placeholders', () => {
    render(<SkeletonCard />);
    const elements = screen.getAllByTestId('skeleton-loader');
    expect(elements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonTable', () => {
  it('renders the correct number of rows and columns', () => {
    const rows = 3;
    const columns = 4;
    render(<SkeletonTable rows={rows} columns={columns} />);
    const elements = screen.getAllByTestId('skeleton-loader');
    // +columns for the header row
    expect(elements).toHaveLength((rows + 1) * columns);
  });
}); 
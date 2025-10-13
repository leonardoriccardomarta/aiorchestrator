import { describe, it, expect, vi } from 'vitest';

// Mock @liveblocks/client e @liveblocks/react
vi.mock('@liveblocks/client', () => ({
  createClient: vi.fn(() => ({})),
}));
vi.mock('@liveblocks/react', () => ({
  createRoomContext: vi.fn(() => ({
    RoomProvider: () => null,
    useRoom: vi.fn(),
    useMyPresence: vi.fn(),
    useUpdateMyPresence: vi.fn(),
    useOthers: vi.fn(),
    useStorage: vi.fn(),
    useMutation: vi.fn(),
  })),
}));

import { PricingOptimizationService } from './PricingOptimizationService';

describe('PricingOptimizationService', () => {
  it('should be instantiable', () => {
    const service = new PricingOptimizationService();
    expect(service).toBeInstanceOf(PricingOptimizationService);
  });
});
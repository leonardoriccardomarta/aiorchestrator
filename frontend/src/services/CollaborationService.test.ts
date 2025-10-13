import { describe, it, expect, vi } from 'vitest';

// Mock @liveblocks/client e @liveblocks/react
vi.mock('@liveblocks/client', () => ({
  createClient: vi.fn(() => ({
    // mock client methods if needed
  })),
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

import { CollaborationService } from './CollaborationService';

describe('CollaborationService', () => {
  it('should be instantiable', () => {
    const service = new CollaborationService('test-room');
    expect(service).toBeInstanceOf(CollaborationService);
  });
});
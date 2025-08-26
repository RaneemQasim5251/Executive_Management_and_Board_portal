// src/components/bookcase/types.ts
export type PackCardModel = {
    id: string;
    committeeName: string;
    monthLabel: string;
    year: number;
    version: number;
    status: 'new' | 'updated' | 'meeting' | 'published' | 'draft';
    unread?: number;           // red count bubble
    hasMeetingLink?: boolean;  // little camera icon
    hasRecording?: boolean;    // small play icon
    locked?: boolean;          // lock icon
  };
  
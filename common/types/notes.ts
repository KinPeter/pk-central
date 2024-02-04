import { BaseEntity, UUID } from './misc';

export interface Link {
  name: string;
  url: string;
}

export interface Note extends BaseEntity {
  userId?: UUID;
  text?: string;
  links: Link[];
  archived: boolean;
  pinned: boolean;
}

export type NoteRequest = Omit<Note, 'createdAt' | 'id' | 'userId'>;

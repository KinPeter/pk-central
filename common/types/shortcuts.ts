import { ShortcutCategory } from '../enums';
import { BaseEntity, UUID } from './misc';

export interface Shortcut extends BaseEntity {
  userId?: UUID;
  name: string;
  url: string;
  iconUrl: string;
  category: ShortcutCategory;
  priority: number;
}

export type ShortcutRequest = Omit<Shortcut, 'createdAt' | 'id' | 'userId'>;

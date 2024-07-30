import { BaseEntity, UUID } from './misc';

export interface Visit extends BaseEntity {
  userId?: UUID;
  city: string;
  country: string;
  year?: string;
  lat: number;
  lng: number;
}

export type VisitRequest = Omit<Visit, 'id' | 'userId' | 'createdAt'>;

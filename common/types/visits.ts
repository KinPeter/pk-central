import { UUID } from './misc';

export interface Visit {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface VisitDocument extends Visit {
  id: UUID;
  userId: UUID;
}

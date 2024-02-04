import { BaseEntity, UUID } from './misc';

export interface PersonalData extends BaseEntity {
  userId?: UUID;
  name: string;
  identifier: string;
  expiry: string | null;
}

export type PersonalDataRequest = Omit<PersonalData, 'createdAt' | 'id' | 'userId'>;

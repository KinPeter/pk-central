import { PersonalData, type PersonalDataRequest } from '../../common';

export const personalDataObjects: PersonalData[] = [
  {
    createdAt: new Date(),
    id: 'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    name: 'ID Card',
    identifier: 'AA112233',
    expiry: '2026-11-04',
  },
  {
    createdAt: new Date(),
    id: 'e2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    name: 'TK frequent flyer',
    identifier: 'TK00112233',
    expiry: null,
  },
];

export const validPersonalDataRequests: PersonalDataRequest[] = [
  {
    name: 'ID card',
    identifier: 'AA112233',
    expiry: '2026-11-04',
  },
  {
    name: 'TK frequent flyer',
    identifier: 'TK00112233',
    expiry: null,
  },
];

export const invalidPersonalDataRequests = [
  {
    name: 'ID card',
    identifier: '',
    expiry: '2026-11-04',
  },
  {
    name: '',
    identifier: 'AA112233',
    expiry: '2026-11-04',
  },
  {
    name: true,
    identifier: 'AA112233',
    expiry: '2026-11-04',
  },
  {
    name: 'TK frequent flyer',
    identifier: 123,
    expiry: '2026-11-04',
  },
  {
    name: 'TK frequent flyer',
    identifier: '123',
  },
];

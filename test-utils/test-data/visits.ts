import { VisitRequest } from 'pk-common';

export const visits = [
  {
    id: 'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    createdAt: new Date(),
    lat: 33.749262,
    lng: 132.792228,
    city: 'Tobe',
    country: 'Japan',
  },
  {
    id: 'b2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    createdAt: new Date(),
    lat: 42.6951525,
    lng: 27.7104213,
    city: 'Sunny Beach',
    country: 'Bulgaria',
  },
];

export const validVisitRequests: VisitRequest[] = [
  {
    lat: 48.2081743,
    lng: 16.3738189,
    city: 'Vienna',
    country: 'Austria',
  },
];

export const invalidVisitRequests = [
  {
    lat: '48.2081743',
    lng: 16.3738189,
    city: 'Vienna',
    country: 'Austria',
  },
  {
    lat: 48.2081743,
    lng: null,
    city: 'Vienna',
    country: 'Austria',
  },
  {
    lat: 48.2081743,
    lng: 16.3738189,
    country: 'Austria',
  },
  {
    lat: 48.2081743,
    lng: 16.3738189,
    city: 'Vienna',
  },
  {
    lat: 48.2081743,
    lng: '16.3738189',
    city: 'Vienna',
    country: 'Austria',
  },
  {
    lat: 48.2081743,
    lng: 16.3738189,
    city: 123,
    country: 'Austria',
  },
];

import { BaseEntity, UUID } from './misc';

export interface Flight extends BaseEntity {
  userId?: UUID;
  date: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  airline: Airline;
  aircraft: Aircraft;
  registration: string;
  seatNumber: string;
  seatType: SeatType;
  flightClass: FlightClass;
  flightReason: FlightReason;
  note: string;
  isPlanned?: boolean;
}

export type FlightRequest = Omit<Flight, 'createdAt' | 'id' | 'userId'>;

export interface Airport {
  city: string;
  name: string;
  country: string;
  iata: string;
  icao: string;
  lat: number;
  lng: number;
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
}

export interface Aircraft {
  name: string;
  icao: string;
}

export const SeatType = {
  AISLE: 'Aisle',
  MIDDLE: 'Middle',
  WINDOW: 'Window',
} as const;

export type SeatType = (typeof SeatType)[keyof typeof SeatType];

export const FlightClass = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Premium Economy',
  BUSINESS: 'Business',
  FIRST: 'First',
} as const;

export type FlightClass = (typeof FlightClass)[keyof typeof FlightClass];

export const FlightReason = {
  LEISURE: 'Leisure',
  BUSINESS: 'Business',
  CREW: 'Crew',
} as const;

export type FlightReason = (typeof FlightReason)[keyof typeof FlightReason];

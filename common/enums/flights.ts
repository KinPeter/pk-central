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

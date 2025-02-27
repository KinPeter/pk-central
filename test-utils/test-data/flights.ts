import { Flight, FlightClass, FlightReason, type FlightRequest, SeatType } from '../../common';

export const flights: Flight[] = [
  {
    createdAt: new Date(),
    date: '2023-12-16',
    flightNumber: 'A3337',
    from: {
      city: 'Chania',
      name: 'Souda',
      iata: 'CHQ',
      icao: 'LGSA',
      lat: 35.53175,
      lng: 24.14968,
      country: 'Greece',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '19:05:00',
    arrivalTime: '20:05:00',
    duration: '01:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 'SX-DVQ',
    seatNumber: '18C',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 268,
    id: 'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
  },
  {
    createdAt: new Date(),
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
    id: 'b2197832-6a6e-46c3-97a9-dd2a8de8a267',
    userId: '123',
    isPlanned: true,
  },
];

export const validFlightRequests: FlightRequest[] = [
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    isPlanned: false,
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: 'hello world',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
    isPlanned: true,
  },
];
export const invalidFlightRequests = [
  {
    date: '1023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: 'hello world',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: undefined,
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: null,
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: 'hello world',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '99:59:59',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: 'hello world',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: null,
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: null,
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: '',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: 123,
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: 'SeatType.AISLE',
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: null,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: '1123',
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: undefined,
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: '1123',
  },
  {
    date: '2023-12-16',
    flightNumber: 'A3877',
    from: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    to: {
      city: 'Athens',
      name: 'Eleftherios Venizelos',
      iata: 'ATH',
      icao: 'LGAV',
      lat: 37.93636,
      lng: 23.94447,
      country: 'Greece',
    },
    departureTime: '10:45:00',
    arrivalTime: '13:45:00',
    duration: '02:00:00',
    airline: {
      name: 'Aegean Airlines',
      iata: 'A3',
      icao: 'AEE',
    },
    aircraft: {
      name: 'Airbus A320',
      icao: 'A320',
    },
    registration: '',
    seatNumber: '',
    seatType: SeatType.AISLE,
    flightClass: FlightClass.ECONOMY,
    flightReason: FlightReason.LEISURE,
    note: '',
    distance: 1123,
    isPlanned: 'not-true',
  },
];

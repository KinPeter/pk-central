import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const visits = [
  // { city: 'Shanghai', country: 'China', lat: 31.23041, lng: 121.4737 }
];

const flights = [
  {
    date: '2024-05-18',
    flightNumber: 'LO2002',
    from: {
      city: 'Seoul',
      name: 'Incheon',
      iata: 'ICN',
      icao: 'RKSI',
      lat: 37.4492,
      lng: 126.45095,
      country: 'Korea',
    },
    to: {
      city: 'Budapest',
      name: 'Franz Liszt International',
      iata: 'BUD',
      icao: 'LHBP',
      lat: 47.43693,
      lng: 19.25559,
      country: 'Hungary',
    },
    departureTime: '08:15:00',
    arrivalTime: '13:50:00',
    duration: '12:35:00',
    airline: {
      name: 'LOT',
      iata: 'LO',
      icao: 'LOT',
    },
    aircraft: {
      name: 'Boeing 787-9',
      icao: 'B789',
    },
    registration: 'SP-LSD',
    seatNumber: '21F',
    seatType: 'Aisle',
    flightClass: 'Economy',
    flightReason: 'Leisure',
    note: '21J never again! Go for F',
    distance: 8148,
  },
];

for (const visit of visits) {
  const res = await fetch(`${process.env.SELF_URL}/visits`, {
    method: 'POST',
    body: JSON.stringify(visit),
    headers: { Authorization: `Bearer ${process.env.TOKEN}` },
  });
  const json = await res.json();
  console.log(json);
}

for (const flt of flights) {
  const res = await fetch(`${process.env.SELF_URL}/flights`, {
    method: 'POST',
    body: JSON.stringify(flt),
    headers: { Authorization: `Bearer ${process.env.TOKEN}` },
  });
  const json = await res.json();
  console.log(json);
}

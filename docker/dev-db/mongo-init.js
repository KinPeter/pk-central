db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'pkstartdev',
    },
  ],
})

db = db.getSiblingDB('central')

db.createCollection('init')

db.getCollection('init').insertOne({ initialized: new Date() })

db.createCollection('users')

db.getCollection('users').insertMany([
  {
    id: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    email: 'main@test.com',
    loginCode: '$2b$10$RnNHkTXygMXChtKP0feIt.dl4r0ZAGHrZo193qGtGJ3edeGgE3OQm', // 509950
    loginCodeExpires: new Date(2147483647000),
    salt: '$2b$10$RnNHkTXygMXChtKP0feIt.',
    passwordHash: '$2b$10$ESG91CanqubPddsEsRulTuePxQ3/Tnmj9Pe.hlFIcWJcJiuy2By8a', // password
    passwordSalt: '$2b$10$ESG91CanqubPddsEsRulTu',
  },
  {
    id: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
    email: 'other@test.com',
    loginCode: '$2b$10$RnNHkTXygMXChtKP0feIt.dl4r0ZAGHrZo193qGtGJ3edeGgE3OQm', // 509950
    loginCodeExpires: new Date(2147483647000),
    salt: '$2b$10$RnNHkTXygMXChtKP0feIt.',
    passwordHash: '$2b$10$ESG91CanqubPddsEsRulTuePxQ3/Tnmj9Pe.hlFIcWJcJiuy2By8a', // password
    passwordSalt: '$2b$10$ESG91CanqubPddsEsRulTu',
  },
])

db.createCollection('start-settings')

db.getCollection('start-settings').insertMany([
  {
    id: 'b26ef9a3-d1ff-417e-bce7-75188a6114c2',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    name: 'testuser',
    shortcutIconBaseUrl: 'https://stuff.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    stravaRedirectUri: null,
  },
  {
    id: 'b3b332e0-56fa-4302-9fee-54ee17a1df23',
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    name: 'other testuser',
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    stravaRedirectUri: null,
  },
])

db.createCollection('notes')

db.getCollection('notes').insertMany([
  {
    id: '5f53f1fa-87b6-4511-8bbc-e1b0ed4c4a4e',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    text: 'This is the latest note with links',
    archived: false,
    pinned: false,
    links: [
      { name: 'Google', url: 'https://www.google.com' },
      { name: 'Facebook', url: 'https://www.facebook.com' },
    ],
  },
  {
    id: 'b3b332e0-56fa-4302-9fee-54ee17a1df56',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(1626173700000),
    text: null,
    archived: false,
    pinned: false,
    links: [{ name: 'Only a link', url: 'https://www.angular.io' }],
  },
  {
    id: 'e07e7e53-23e0-43de-a998-94bdc0691781',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(1623217380000),
    text: 'This is a pinned note \nIt should have line breaks \nMore than one',
    archived: false,
    pinned: true,
    links: null,
  },
  {
    id: 'a6c488d9-25c6-4f74-98d3-659b138a0426',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(1622741100000),
    text: 'This is an archived note',
    archived: true,
    pinned: false,
    links: null,
  },
  {
    id: 'b2c332e0-56fa-4302-9fee-54ee17a1da23',
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(1626173700000),
    text: null,
    archived: false,
    pinned: false,
    links: [{ name: 'Other link', url: 'https://www.angular.io' }],
  },
])

db.createCollection('shortcuts')

db.getCollection('shortcuts').insertMany([
  {
    id: '7c944ee3-01bd-48d1-920a-c83d7444fcbf',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    category: 'TOP',
    url: 'https://wolt.com/hu/',
    iconUrl: 'wolt.png',
    name: 'Wolt',
    priority: 2,
  },
  {
    id: '4a018e25-06a1-4ce3-8736-1e0264dff758',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    iconUrl: 'revolut.png',
    priority: 1,
    url: 'https://app.revolut.com/start',
    category: 'TOP',
    name: 'Revolut',
  },
  {
    id: 'fe1d0670-6e4c-4b7e-9fd6-271635e7d47b',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    url: 'https://stackoverflow.com/',
    name: 'StackOverflow',
    category: 'CODING',
    priority: 1,
    iconUrl: 'stacko.png',
  },
  {
    id: '37cc25df-92ba-464d-9d4e-d591e78a59be',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    iconUrl: 'devto.png',
    url: 'https://dev.to/',
    category: 'CODING',
    priority: 4,
    name: 'Dev.to',
  },
  {
    id: 'f1bf666c-a0ec-4f6a-9d3a-ad4c79390bcf',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'Keep',
    url: 'https://keep.google.com/',
    category: 'GOOGLE',
    priority: 7,
    iconUrl: 'gkeep.png',
  },
  {
    id: '35384344-d1f2-4635-a195-53d6ef9647c4',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    category: 'GOOGLE',
    priority: 2,
    iconUrl: 'gdocs.png',
    name: 'Docs',
    url: 'https://docs.google.com/',
  },
  {
    id: 'cf1c0ef2-17ec-44c6-98b6-fbe2c008058e',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    priority: 1,
    name: 'Netflix',
    url: 'https://www.netflix.com/',
    category: 'FUN',
    iconUrl: 'netflix.png',
  },
  {
    id: '89622cd0-5604-482f-ae35-9f3c6b86f02f',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    priority: 1,
    url: 'https://www.facebook.com/',
    category: 'FUN',
    name: 'Facebook',
    iconUrl: 'facebook.png',
  },
  {
    id: '190496e7-2a6f-45e7-b703-5b5fad2d71fa',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'YahooMail',
    category: 'OTHERS',
    url: 'https://mail.yahoo.com/',
    iconUrl: 'yahoomail.png',
    priority: 5,
  },
  {
    id: '11df7bba-81a9-471f-9652-1ca1376fc302',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    category: 'OTHERS',
    priority: 2,
    iconUrl: 'flickr.png',
    url: 'https://www.flickr.com/',
    name: 'Flickr',
  },
  {
    id: '02dc5644-561c-41ce-84bf-0f44f813f2d2',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    priority: 1,
    iconUrl: 'gcloud.png',
    url: 'https://console.cloud.google.com',
    category: 'GOOGLE',
    name: 'Cloud Console',
  },
  {
    id: '2e944ee3-01bd-48d1-920a-c83d7444f554',
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
    category: 'TOP',
    url: 'https://wolt.com/hu/',
    iconUrl: 'wolt.png',
    name: 'Other Wolt',
    priority: 2,
  },
])

db.createCollection('personal-data')

db.getCollection('personal-data').insertMany([
  {
    id: 'a11607ae-73b8-4854-9b38-0439876e0770',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'ID card',
    identifier: '123456HE',
    expiry: '2026-09-16',
  },
  {
    id: '8b81f8be-cb15-4d4d-97cb-bb1f26273404',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'Address card',
    identifier: '654321YL',
    expiry: null,
  },
  {
    id: 'f21607ae-73b8-4854-9b38-0439876e0aab',
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
    name: 'Other ID card',
    identifier: '123456HE',
    expiry: '2026-09-16',
  },
])

db.createCollection('cycling')

db.getCollection('cycling').insertMany([
  {
    id: '98c09625-3396-4f5b-87d1-2967b823ad33',
    createdAt: new Date(),
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    weeklyGoal: 60,
    monthlyGoal: 300,
    chores: [
      {
        id: '61673674-c6b1-4c0d-84c5-79f4c5efea34',
        name: 'chain cleaning',
        kmInterval: 300,
        lastKm: 4926.2,
      },
    ],
  },
  {
    id: '34c09625-3396-4f5b-87d1-2967b823af43',
    createdAt: new Date(),
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    weeklyGoal: 99,
    monthlyGoal: 999,
    chores: [
      {
        id: '32373674-c6b1-4c0d-84c5-79f4c5efee72',
        name: 'other chain cleaning',
        kmInterval: 300,
        lastKm: 4926.2,
      },
    ],
  },
])

db.createCollection('activities')

db.getCollection('activities').insertMany([
  {
    id: '98c09625-3396-4f5b-87d1-2967b823ad33',
    createdAt: new Date(),
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    walkWeeklyGoal: 30,
    walkMonthlyGoal: 100,
    cyclingWeeklyGoal: 60,
    cyclingMonthlyGoal: 300,
    chores: [
      {
        id: '61673674-c6b1-4c0d-84c5-79f4c5efea34',
        name: 'chain cleaning',
        kmInterval: 300,
        lastKm: 4926.2,
      },
    ],
  },
  {
    id: '34c09625-3396-4f5b-87d1-2967b823af43',
    createdAt: new Date(),
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    walkWeeklyGoal: 9,
    walkMonthlyGoal: 29,
    cyclingWeeklyGoal: 99,
    cyclingMonthlyGoal: 999,
    chores: [
      {
        id: '32373674-c6b1-4c0d-84c5-79f4c5efee72',
        name: 'other chain cleaning',
        kmInterval: 300,
        lastKm: 4926.2,
      },
    ],
  },
])

db.createCollection('flights')

db.getCollection('flights').insertMany([
  {
    date: '2023-12-27',
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
    airline: { name: 'Aegean Airlines', iata: 'A3', icao: 'AEE' },
    aircraft: { name: 'Airbus A320', icao: 'A320' },
    registration: 'SX-DVQ',
    seatNumber: '18C',
    seatType: 'Aisle',
    flightClass: 'Economy',
    flightReason: 'Leisure',
    note: '',
    distance: 268,
    id: 'efce815a-ceae-4521-8db6-3a88b1c5b7c9',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
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
    airline: { name: 'Aegean Airlines', iata: 'A3', icao: 'AEE' },
    aircraft: { name: 'Airbus A320', icao: 'A320' },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: 'Aisle',
    flightClass: 'Economy',
    flightReason: 'Leisure',
    note: '',
    distance: 1123,
    id: '0a9be75c-e673-4410-8600-abaf10053890',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
  },
  {
    date: '2011-12-16',
    flightNumber: 'OTHER877',
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
    airline: { name: 'Aegean Airlines', iata: 'A3', icao: 'AEE' },
    aircraft: { name: 'Airbus A320', icao: 'A320' },
    registration: 'SX-DVR',
    seatNumber: '18D',
    seatType: 'Aisle',
    flightClass: 'Economy',
    flightReason: 'Leisure',
    note: 'Other user',
    distance: 1123,
    id: '1b8be75c-e673-4410-8600-abaf10053111',
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
  },
])

db.createCollection('visits')

db.getCollection('visits').insertMany([
  {
    lat: 59.9138688,
    lng: 10.7522454,
    city: 'Oslo',
    country: 'Norway',
    year: '2007',
    id: '17ebb676-c7b4-419c-b2a6-db8f89992e15',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
  },
  {
    lat: 52.3702157,
    lng: 4.8951679,
    city: 'Amsterdam',
    country: 'The Netherlands',
    year: '2006',
    id: '278cccc4-2051-4b9b-93ca-1389aff90a82',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
  },
  {
    lat: 52.3702157,
    lng: 4.8951679,
    city: 'Other Amsterdam',
    country: 'Other Netherlands',
    year: '2016',
    id: '167cccc4-2051-4b9b-93ca-1389aff90b39',
    userId: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
  },
])

db.createCollection('shared-keys')

db.getCollection('shared-keys').insertOne({
  airlabsApiKey: 'TBA',
  locationIqApiKey: 'TBA',
})

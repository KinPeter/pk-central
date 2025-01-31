import http from 'http'
import { parse } from 'url'

const airportsResponse = {
  response: [
    {
      name: 'John F. Kennedy International Airport',
      iata_code: 'JFK',
      icao_code: 'KJFK',
      lat: 40.6413,
      lng: -73.7781,
      country_code: 'US',
    },
    {
      name: 'Los Angeles International Airport',
      iata_code: 'LAX',
      icao_code: 'KLAX',
      lat: 33.9416,
      lng: -118.4085,
      country_code: 'US',
    },
    {
      name: 'Heathrow Airport',
      iata_code: 'LHR',
      icao_code: 'EGLL',
      lat: 51.47,
      lng: -0.4543,
      country_code: 'GB',
    },
  ],
}

const airlinesResponse = {
  response: [
    {
      name: 'American Airlines',
      iata_code: 'AA',
      icao_code: 'AAA',
    },
    {
      name: 'Airline B',
      iata_code: 'BB',
      icao_code: 'BBB',
    },
    {
      name: 'Airline C',
      iata_code: 'CC',
      icao_code: 'CCC',
    },
  ],
}

const reverseResponse = {
  lat: '40.7128',
  lon: '-74.0060',
  address: {
    city: 'New York',
    region: 'New York',
    country: 'United States',
    postcode: '10007',
    country_code: 'us',
  },
}

const birthdaysResponse = 'Santa Claus\t12/06\nBaby Jesus\t12/24'

const mailResponse = {
  message: 'Email sent successfully.',
}

const translationResponse = {
  translations: [
    {
      text: 'Hello there',
      detected_source_language: 'hu',
    },
  ],
}

const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true)
  const path = parsedUrl.pathname

  res.setHeader('Content-Type', 'application/json')

  if (path === '/airports') {
    res.writeHead(200)
    res.end(JSON.stringify(airportsResponse))
  } else if (path === '/airlines') {
    res.writeHead(200)
    res.end(JSON.stringify(airlinesResponse))
  } else if (path === '/reverse') {
    res.writeHead(200)
    res.end(JSON.stringify(reverseResponse))
  } else if (path === '/translate') {
    res.writeHead(200)
    res.end(JSON.stringify(translationResponse))
  } else if (path === '/birthdays') {
    res.setHeader('Content-Type', 'text/plain')
    res.writeHead(200)
    res.end(birthdaysResponse)
  } else if (path === '/mail') {
    res.writeHead(200)
    res.end(JSON.stringify(mailResponse))
  } else {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }
})

server.listen(9876, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:9876')
})

export interface SharedKeys {
  airlabsApiKey: string;
  locationIqApiKey: string;
  openWeatherApiKey: string;
  unsplashApiKey: string;
  stravaClientId: string;
  stravaClientSecret: string;
}

export interface AirlabsAirportResponse {
  response: Array<{
    name: string;
    iata_code: string;
    icao_code: string;
    lat: number;
    lng: number;
    country_code: string; // uppercase
  }>;
}

export interface AirlabsAirlineResponse {
  response: Array<{
    name: string;
    iata_code: string;
    icao_code: string;
  }>;
}

export interface LocationIqReverseResponse {
  lat: string;
  lon: string;
  address: {
    city?: string;
    region?: string;
    country?: string; // native name!
    postcode?: string;
    country_code?: string; // lowercase
  };
}

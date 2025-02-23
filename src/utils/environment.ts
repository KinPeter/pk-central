type EnvVariable =
  | 'MONGO_DB_URI'
  | 'MONGO_DB_NAME'
  | 'SERVER_ROUTE'
  | 'EMAIL_HOST'
  | 'EMAIL_USER'
  | 'EMAIL_PASS'
  | 'MAILER_URL'
  | 'MAILER_API_KEY'
  | 'JWT_SECRET'
  | 'LOGIN_CODE_EXPIRY'
  | 'TOKEN_EXPIRY'
  | 'NOTIFICATION_EMAIL'
  | 'EMAILS_ALLOWED'
  | 'PROXY_AIRLABS_AIRLINES_URL'
  | 'PROXY_AIRLABS_AIRPORTS_URL'
  | 'PROXY_LOCATION_REVERSE_URL'
  | 'PROXY_DEEPL_TRANSLATE_URL'
  | 'AIRLABS_API_KEY'
  | 'LOCATION_IQ_API_KEY'
  | 'OPEN_WEATHER_MAP_API_KEY'
  | 'UNSPLASH_API_KEY'
  | 'DEEPL_API_KEY'
  | 'STRAVA_CLIENT_ID'
  | 'STRAVA_CLIENT_SECRET'
  | 'GEMINI_API_KEY'
  | 'PK_ENV';

export function getEnv(...variables: EnvVariable[]): string[] {
  return variables.map(variable => {
    const value = process.env[variable];
    if (!value) {
      console.log(`Attempted to read ${variable} from the environment but there was no value.`);
    }
    return value ?? '';
  });
}

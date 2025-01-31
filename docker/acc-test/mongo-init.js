db.createUser({
  user: 'tester',
  pwd: 'tester',
  roles: [
    {
      role: 'readWrite',
      db: 'testdb',
    },
  ],
})

db = db.getSiblingDB('testdb')

db.createCollection('shared-keys')

db.getCollection('shared-keys').insertOne({
  airlabsApiKey: 'airlabsApiKey',
  locationIqApiKey: 'locationIqApiKey',
  openWeatherApiKey: 'openWeatherApiKey',
  unsplashApiKey: 'unsplashApiKey',
  deeplApiKey: 'deeplApiKey',
  stravaClientId: 'stravaClientId',
  stravaClientSecret: 'stravaClientSecret',
})

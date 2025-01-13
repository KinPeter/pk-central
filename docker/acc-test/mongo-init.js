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

db.createCollection('init')

db.getCollection('init').insertOne({ initialized: new Date() })

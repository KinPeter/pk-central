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

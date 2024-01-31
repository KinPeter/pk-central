db.createUser({
  user: 'pkstartdev',
  pwd: 'pkstartdev',
  roles: [
    {
      role: 'readWrite',
      db: 'pkstartdev',
    },
  ],
})

db = db.getSiblingDB('pkstartdev')

db.createCollection('init')

db.getCollection('init').insertOne({ initialized: new Date() })

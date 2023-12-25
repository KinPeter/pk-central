export class MockDb {
  collection = jasmine.createSpy('collection');
}

export class MockCollection {
  find = jasmine.createSpy('find');
  findOne = jasmine.createSpy('findOne');
  insertOne = jasmine.createSpy('insertOne');
  updateOne = jasmine.createSpy('updateOne');
}

export class MockCursor {
  toArray = jasmine.createSpy('toArray');
}

export class MockDbManager {
  constructor(
    public db: MockDb,
    public collection: MockCollection
  ) {}

  getMongoDb() {
    return { db: this.db };
  }

  closeMongoClient() {
    return true;
  }
}

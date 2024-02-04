import { jest } from '@jest/globals';

export class MockDb {
  collection = jest.fn();
}

export class MockCollection {
  find = jest.fn();
  findOne = jest.fn<() => Promise<any>>();
  insertOne = jest.fn<() => Promise<any>>();
  updateOne = jest.fn<() => Promise<any>>();
  findOneAndUpdate = jest.fn<() => Promise<any>>();
  findOneAndDelete = jest.fn<() => Promise<any>>();
}

export class MockCursor {
  toArray = jest.fn<() => Promise<any>>();
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

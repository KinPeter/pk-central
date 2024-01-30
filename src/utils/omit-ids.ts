import { ObjectId } from 'mongodb';

export function omitIds<T extends { _id?: ObjectId; userId?: string }>(arrayOfDocuments: Array<T>): Array<unknown> {
  return arrayOfDocuments.map(({ _id, userId, ...rest }) => rest);
}

export function omitIdsForOne<T extends { _id?: ObjectId; userId?: string }>(document: T): unknown {
  const { _id, userId, ...rest } = document;
  return rest;
}

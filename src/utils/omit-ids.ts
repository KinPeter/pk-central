import { ObjectId } from 'mongodb';

export function omitIds<T extends { _id?: ObjectId; userId?: string }>(arrayOfDocuments: Array<T>): Array<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return arrayOfDocuments.map(({ _id, userId, ...rest }) => rest);
}

export function omitIdsForOne<T extends { _id?: ObjectId; userId?: string }>(document: T): unknown {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, userId, ...rest } = document;
  return rest;
}

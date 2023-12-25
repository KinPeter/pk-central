import { ObjectId } from 'mongodb';

export function omitIds<T extends { _id: ObjectId; userId: string }>(arrayOfDocuments: Array<T>): Array<unknown> {
  return arrayOfDocuments.map(({ _id, userId, ...rest }) => rest);
}

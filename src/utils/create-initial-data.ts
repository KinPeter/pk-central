import { Db } from 'mongodb';
import { Activities, PkStartSettingsResource } from '../../common';
import { DbCollection } from './collections';
import { v4 as uuid } from 'uuid';

export async function createInitialStartSettings(db: Db, userId: string): Promise<void> {
  const collection = db.collection<PkStartSettingsResource>(DbCollection.START_SETTINGS);
  await collection.insertOne({
    id: uuid(),
    userId,
    name: null,
    shortcutIconBaseUrl: null,
    birthdaysUrl: null,
    stravaRedirectUri: null,
  });
}

export async function createInitialActivities(db: Db, userId: string): Promise<void> {
  const collection = db.collection<Activities>(DbCollection.ACTIVITIES);
  await collection.insertOne({
    id: uuid(),
    userId,
    createdAt: new Date(),
    chores: [],
    walkWeeklyGoal: 0,
    walkMonthlyGoal: 0,
    cyclingWeeklyGoal: 0,
    cyclingMonthlyGoal: 0,
  });
}

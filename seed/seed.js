import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const backupPath = path.resolve(__dirname, 'pk-central-backup.json');

const { user, startSettings, cycling, flights, notes, personalData, shortcuts, visits, activities } = JSON.parse(
  fs.readFileSync(backupPath, { encoding: 'utf-8' })
);

const mongoClient = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = (await mongoClient.connect()).db(process.env.MONGO_DB_NAME);

/**
 * User
 */
const usersCollection = db.collection('users');
delete user._id;
user.loginCode = undefined;
user.loginCodeExpires = undefined;
user.salt = undefined;
const userResult = await usersCollection.insertOne(user);
console.log(`${userResult.insertedId ? 1 : 0} documents were inserted to users`);

/**
 * StartSettings
 */
const settingsCollection = db.collection('start-settings');
delete startSettings._id;
const settingsResult = await settingsCollection.insertOne(startSettings);
console.log(`${settingsResult.insertedId ? 1 : 0} documents were inserted to start-settings.`);

/**
 * Flights
 */
const flightsCollection = db.collection('flights');
const flightsResult = await flightsCollection.insertMany(flights.map(f => ({ ...f, _id: undefined })));
console.log(`${flightsResult.insertedCount} documents were inserted to ${flightsCollection.collectionName}.`);

/**
 * Visits
 */
const visitsCollection = db.collection('visits');
const visitsResult = await visitsCollection.insertMany(visits.map(v => ({ ...v, _id: undefined })));
console.log(`${visitsResult.insertedCount} documents were inserted to ${visitsCollection.collectionName}.`);

/**
 * Shortcuts
 */
const shortcutsCollection = db.collection('shortcuts');
const shortcutsResults = await shortcutsCollection.insertMany(shortcuts.map(s => ({ ...s, _id: undefined })));
console.log(`${shortcutsResults.insertedCount} documents were inserted to ${shortcutsCollection.collectionName}.`);

/**
 * Notes
 */
const notesCollection = db.collection('notes');
const notesResults = await notesCollection.insertMany(notes.map(n => ({ ...n, _id: undefined })));
console.log(`${notesResults.insertedCount} documents were inserted to ${notesCollection.collectionName}.`);

/**
 * PersonalData
 */
const pDataCollection = db.collection('personal-data');
const pDataResult = await pDataCollection.insertMany(personalData.map(pd => ({ ...pd, _id: undefined })));
console.log(`${pDataResult.insertedCount} documents were inserted to ${pDataCollection.collectionName}.`);

/**
 * Cycling
 */
const cyclingCollection = db.collection('cycling');
delete cycling._id;
const cyclingResult = await cyclingCollection.insertOne(cycling);
console.log(`${cyclingResult.insertedId ? 1 : 0} documents were inserted to ${cyclingCollection.collectionName}.`);

/**
 * Activities
 */
const activitiesCollection = db.collection('activities');
delete activities._id;
const activitiesResult = await activitiesCollection.insertOne(activities);
console.log(
  `${activitiesResult.insertedId ? 1 : 0} documents were inserted to ${activitiesCollection.collectionName}.`
);

/**
 * Close connection
 */
await mongoClient.close();

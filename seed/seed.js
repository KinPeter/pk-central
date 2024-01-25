import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Resolve the absolute path to the CSV file using __dirname
const flightsPath = path.resolve(__dirname, 'flights.json');
const visitsPath = path.resolve(__dirname, 'visits.json');
const startPath = path.resolve(__dirname, 'start-backup.json');

const flights = JSON.parse(fs.readFileSync(flightsPath, { encoding: 'utf-8' }));
const visits = JSON.parse(fs.readFileSync(visitsPath, { encoding: 'utf-8' }));
const startData = JSON.parse(fs.readFileSync(startPath, { encoding: 'utf-8' }));

const mongoClient = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = (await mongoClient.connect()).db(process.env.MONGO_DB_NAME);

/**
 * Flights
 */
// const flightsCollection = db.collection('flights');
// const flightDocs = flights.map(flight => ({
//   ...flight,
//   id: uuid(),
//   userId: process.env.USER_ID,
// }));
// console.log(`Number of flights: ${flightDocs.length}`);
// const insertFlightsResult = await flightsCollection.insertMany(flightDocs);
// console.log(`${insertFlightsResult.insertedCount} documents were inserted to ${flightsCollection.collectionName}.`);

/**
 * Visits
 */
// const visitsCollection = db.collection('visits');
// const visitDocs = visits.map(visit => ({
//   ...visit,
//   id: uuid(),
//   userId: process.env.USER_ID,
// }));
// console.log(`Number of visits: ${visitDocs.length}`);
// const insertVisitsResult = await visitsCollection.insertMany(visitDocs);
// console.log(`${insertVisitsResult.insertedCount} documents were inserted to ${visitsCollection.collectionName}.`);

/**
 * Start
 */
// const { settings } = startData.user;
// const settingsCollection = db.collection('start-settings');
// const settingsResult = await settingsCollection.insertOne({
//   id: uuid(),
//   userId: process.env.USER_ID,
//   name: startData.user.name,
//   ...settings,
// });
// console.log(`${settingsResult.insertedId ? 1 : 0} documents were inserted to start-settings.`);

const { shortcuts, notes, personalData, cycling } = startData;

const shortcutsCollection = db.collection('shortcuts');
const shortcutDocs = shortcuts.map(data => {
  delete data._id;
  return {
    ...data,
    id: uuid(),
    userId: process.env.USER_ID,
  };
});
console.log(`Number of shortcuts: ${shortcutDocs.length}`);
const shortcutsResults = await shortcutsCollection.insertMany(shortcutDocs);
console.log(`${shortcutsResults.insertedCount} documents were inserted to ${shortcutsCollection.collectionName}.`);

const notesCollection = db.collection('notes');
const notesDocs = notes.map(data => {
  delete data._id;
  return {
    ...data,
    id: uuid(),
    userId: process.env.USER_ID,
  };
});
console.log(`Number of notes: ${notesDocs.length}`);
const notesResults = await notesCollection.insertMany(notesDocs);
console.log(`${notesResults.insertedCount} documents were inserted to ${notesCollection.collectionName}.`);

const pDataCollection = db.collection('personal-data');
const pDataDocs = personalData.map(data => {
  delete data._id;
  return {
    ...data,
    id: uuid(),
    userId: process.env.USER_ID,
  };
});
console.log(`Number of personal data: ${pDataDocs.length}`);
const pDataResult = await pDataCollection.insertMany(pDataDocs);
console.log(`${pDataResult.insertedCount} documents were inserted to ${pDataCollection.collectionName}.`);

const cyclingCollection = db.collection('cycling');
delete cycling._id;
const cyclingResult = await cyclingCollection.insertOne({
  ...cycling,
  id: uuid(),
  userId: process.env.USER_ID,
});
console.log(`${cyclingResult.insertedId ? 1 : 0} documents were inserted to ${cyclingCollection.collectionName}.`);

/**
 * Close connection
 */
await mongoClient.close();

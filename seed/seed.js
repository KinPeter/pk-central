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

const flights = JSON.parse(fs.readFileSync(flightsPath, { encoding: 'utf-8' }));
const visits = JSON.parse(fs.readFileSync(visitsPath, { encoding: 'utf-8' }));

const mongoClient = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = (await mongoClient.connect()).db(process.env.MONGO_DB_NAME);

const flightsCollection = db.collection('flights');
const flightDocs = flights.map(flight => ({
  ...flight,
  id: uuid(),
  userId: process.env.USER_ID,
}));
console.log(`Number of flights: ${flightDocs.length}`);
// console.log(flightDocs);
const insertFlightsResult = await flightsCollection.insertMany(flightDocs);
console.log(`${insertFlightsResult.insertedCount} documents were inserted to ${flightsCollection.collectionName}.`);

// const visitsCollection = db.collection('visits');
// const visitDocs = visits.map(visit => ({
//   ...visit,
//   id: uuid(),
//   userId: process.env.USER_ID,
// }));
// console.log(`Number of visits: ${visitDocs.length}`);
// // console.log(visitDocs);
// const insertVisitsResult = await visitsCollection.insertMany(visitDocs);
// console.log(`${insertVisitsResult.insertedCount} documents were inserted to ${visitsCollection.collectionName}.`);

await mongoClient.close();

import { MongoDbManager } from '../../utils/mongo-db-manager';
import { EmailManager } from '../../utils/email-manager';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { Cycling, DataBackup, Flight, Note, PersonalData, PkStartSettings, Shortcut, Visit } from 'pk-common';
import { AuthManager } from '../../utils/auth-manager';

export async function sendDataBackup(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  emailManager?: EmailManager
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const result = { user } as DataBackup;

    const settingsCollection = db.collection<PkStartSettings>('start-settings');
    result.startSettings = (await settingsCollection.findOne({ userId: user.id })) ?? ({} as PkStartSettings);
    const name = result.startSettings?.name ?? 'User';

    const cyclingCollection = db.collection<Cycling>('cycling');
    result.cycling = (await cyclingCollection.findOne({ userId: user.id })) ?? ({} as Cycling);

    const flightsCollection = db.collection<Flight>('flights');
    const flightsCursor = flightsCollection.find({ userId: user.id });
    result.flights = await flightsCursor.toArray();

    const notesCollection = db.collection<Note>('notes');
    const notesCursor = notesCollection.find({ userId: user.id });
    result.notes = await notesCursor.toArray();

    const personalDataCollection = db.collection<PersonalData>('personal-data');
    const personalDataCursor = personalDataCollection.find({ userId: user.id });
    result.personalData = await personalDataCursor.toArray();

    const shortcutsCollection = db.collection<Shortcut>('shortcuts');
    const shortcutsCursor = shortcutsCollection.find({ userId: user.id });
    result.shortcuts = await shortcutsCursor.toArray();

    const visitsCollection = db.collection<Visit>('visits');
    const visitsCursor = visitsCollection.find({ userId: user.id });
    result.visits = await visitsCursor.toArray();

    if (emailManager) {
      const res = await emailManager.sendDataBackup(name, user.email, result);
      return new OkResponse({ message: 'Check your inbox', response: res });
    } else {
      return new OkResponse<DataBackup>(result);
    }
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}

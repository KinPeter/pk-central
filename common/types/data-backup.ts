import { User } from './auth';
import { Note } from './notes';
import { Shortcut } from './shortcuts';
import { PersonalData } from './personal-data';
import { Cycling } from './cycling';
import { PkStartSettingsResource } from './start-settings';
import { Flight } from './flights';
import { Visit } from './visits';
import { Activities } from './activities';

export interface DataBackup {
  user: User;
  startSettings: PkStartSettingsResource;
  notes: Note[];
  shortcuts: Shortcut[];
  personalData: PersonalData[];
  cycling: Cycling;
  activities: Activities;
  flights: Flight[];
  visits: Visit[];
}

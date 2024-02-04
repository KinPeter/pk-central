import { User } from './auth';
import { Note } from './notes';
import { Shortcut } from './shortcuts';
import { PersonalData } from './personal-data';
import { Cycling } from './cycling';
import { PkStartSettings } from './start-settings';
import { Flight } from './flights';
import { Visit } from './visits';

export interface DataBackup {
  user: User;
  startSettings: PkStartSettings;
  notes: Note[];
  shortcuts: Shortcut[];
  personalData: PersonalData[];
  cycling: Cycling;
  flights: Flight[];
  visits: Visit[];
}

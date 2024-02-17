import { Flight } from './flights';
import { Visit } from './visits';

export interface Trips {
  flights: Flight[];
  visits: Visit[];
}

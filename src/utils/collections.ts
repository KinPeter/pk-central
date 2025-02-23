export const DbCollection = {
  ACTIVITIES: 'activities',
  CYCLING: 'cycling',
  FLIGHTS: 'flights',
  NOTES: 'notes',
  PERSONAL_DATA: 'personal-data',
  SHORTCUTS: 'shortcuts',
  START_SETTINGS: 'start-settings',
  USERS: 'users',
  VISITS: 'visits',
} as const;

export type DbCollection = (typeof DbCollection)[keyof typeof DbCollection];

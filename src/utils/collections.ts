export const DbCollection = {
  ACTIVITIES: 'activities',
  CYCLING: 'cycling',
  FLIGHTS: 'flights',
  NOTES: 'notes',
  PERSONAL_DATA: 'personal-data',
  SHARED_KEYS: 'shared-keys',
  SHORTCUTS: 'shortcuts',
  START_SETTINGS: 'start-settings',
  USERS: 'users',
  VISITS: 'visits',
} as const;

export type DbCollection = (typeof DbCollection)[keyof typeof DbCollection];

import { Activities, type CyclingChoreRequest, type SetGoalsRequest } from '../../common';

export const activitiesData: Activities = {
  userId: '123',
  id: 'abc123',
  walkWeeklyGoal: 0,
  walkMonthlyGoal: 0,
  cyclingWeeklyGoal: 0,
  cyclingMonthlyGoal: 0,
  createdAt: new Date(),
  chores: [
    {
      id: 'c1',
      name: 'chain cleaning',
      lastKm: 1200,
      kmInterval: 200,
    },
  ],
};

export const validChoreRequest: CyclingChoreRequest = {
  lastKm: 100,
  kmInterval: 100,
  name: 'test',
};

export const invalidChoreRequests = [
  {
    lastKm: '100',
    kmInterval: 100,
    name: 'test',
  },
  {
    lastKm: 100,
    kmInterval: 100,
  },
  {
    lastKm: 100,
    kmInterval: '100',
    name: 'test',
  },
  {
    lastKm: 100,
    kmInterval: 100,
    name: 230,
  },
  {
    name: 't',
    lastKm: 100,
    kmInterval: 100,
  },
  {
    name: 'test',
    lastKm: -4.123,
    kmInterval: 100,
  },
];

export const validGoalsRequests: SetGoalsRequest[] = [
  {
    cyclingMonthlyGoal: 200,
    cyclingWeeklyGoal: 50,
    walkMonthlyGoal: 100,
    walkWeeklyGoal: 25,
  },
  {
    cyclingMonthlyGoal: 0,
    cyclingWeeklyGoal: 0,
    walkMonthlyGoal: 0,
    walkWeeklyGoal: 25,
  },
];

export const invalidGoalsRequests = [
  {
    walkWeeklyGoal: 0,
    walkMonthlyGoal: 0,
    cyclingWeeklyGoal: 0,
    cyclingMonthlyGoal: null,
  },
  {
    walkWeeklyGoal: 0,
    walkMonthlyGoal: 0,
    cyclingWeeklyGoal: undefined,
    cyclingMonthlyGoal: 0,
  },
  {
    walkWeeklyGoal: 0,
    walkMonthlyGoal: '123',
    cyclingWeeklyGoal: 0,
    cyclingMonthlyGoal: 0,
  },
  {
    cyclingWeeklyGoal: 0,
    cyclingMonthlyGoal: 0,
  },
  {
    walkWeeklyGoal: -123,
    walkMonthlyGoal: 0,
    cyclingWeeklyGoal: 0,
    cyclingMonthlyGoal: 0,
  },
];

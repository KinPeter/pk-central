import { Cycling, type CyclingChoreRequest } from '../../common';

export const cyclingData: Cycling = {
  userId: '123',
  id: 'abc123',
  monthlyGoal: 0,
  weeklyGoal: 0,
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

export const invalidMonthlyGoalRequests = [
  {
    monthlyGoal: null,
  },
  {
    monthlyGoal: undefined,
  },
  {
    monthlyGoal: '123',
  },
  {
    weeklyGoal: 123,
  },
  {
    monthlyGoal: -123,
  },
];

export const invalidWeeklyGoalRequests = [
  {
    weeklyGoal: null,
  },
  {
    weeklyGoal: undefined,
  },
  {
    weeklyGoal: '123',
  },
  {
    monthlyGoal: 123,
  },
  {
    weeklyGoal: -123,
  },
];

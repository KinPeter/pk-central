import { BaseEntity, UUID } from './misc';

export interface CyclingChore {
  id: UUID;
  name: string;
  kmInterval: number;
  lastKm: number;
}

export interface Activities extends BaseEntity {
  userId: UUID;
  cyclingWeeklyGoal: number | null;
  cyclingMonthlyGoal: number | null;
  walkWeeklyGoal: number | null;
  walkMonthlyGoal: number | null;
  chores: CyclingChore[] | null;
}

export type SetGoalsRequest = Pick<
  Activities,
  'cyclingWeeklyGoal' | 'cyclingMonthlyGoal' | 'walkWeeklyGoal' | 'walkMonthlyGoal'
>;
export type CyclingChoreRequest = Omit<CyclingChore, 'id'>;

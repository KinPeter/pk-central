import { BaseEntity, UUID } from './misc';

export interface CyclingChore {
  id: UUID;
  name: string;
  kmInterval: number;
  lastKm: number;
}

export interface Cycling extends BaseEntity {
  userId: UUID;
  weeklyGoal: number | null;
  monthlyGoal: number | null;
  chores: CyclingChore[] | null;
}

export type SetWeeklyGoalRequest = Pick<Cycling, 'weeklyGoal'>;
export type SetMonthlyGoalRequest = Pick<Cycling, 'monthlyGoal'>;
export type CyclingChoreRequest = Omit<CyclingChore, 'id'>;

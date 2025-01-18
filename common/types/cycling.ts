import { BaseEntity } from './misc';
import { CyclingChore } from './activities';
import type { UUID } from './misc';

export interface Cycling extends BaseEntity {
  userId: UUID;
  weeklyGoal: number | null;
  monthlyGoal: number | null;
  chores: CyclingChore[] | null;
}

export type SetWeeklyGoalRequest = Pick<Cycling, 'weeklyGoal'>;
export type SetMonthlyGoalRequest = Pick<Cycling, 'monthlyGoal'>;

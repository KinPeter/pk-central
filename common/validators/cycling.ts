import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';

export const weeklyGoalSchema = yup.object({
  weeklyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
});

export const monthlyGoalSchema = yup.object({
  monthlyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
});

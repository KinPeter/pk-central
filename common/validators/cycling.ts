import * as yup from 'yup';
import { ValidationError } from '../enums';

export const weeklyGoalSchema = yup.object({
  weeklyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
});

export const monthlyGoalSchema = yup.object({
  monthlyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
});

export const choreSchema = yup.object({
  kmInterval: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  lastKm: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  name: yup.string().strict().min(2, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
});

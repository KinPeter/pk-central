import * as yup from 'yup';
import { ValidationError } from '../enums';

export const choreSchema = yup.object({
  kmInterval: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  lastKm: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  name: yup.string().strict().min(2, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
});

export const goalsSchema = yup.object({
  cyclingWeeklyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  cyclingMonthlyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  walkWeeklyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  walkMonthlyGoal: yup.number().strict().min(0, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
});

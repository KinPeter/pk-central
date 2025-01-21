import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { SIMPLE_DATE_REGEX } from '../utils/regex';

export const personalDataSchema = yup.object({
  name: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  identifier: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  expiry: yup
    .string()
    .strict()
    .matches(SIMPLE_DATE_REGEX, ValidationError.INVALID_DATE)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
});

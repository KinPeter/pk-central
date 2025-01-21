import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { YEAR_REGEX } from '../utils/regex';

export const visitSchema = yup.object({
  city: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  country: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  year: yup.string().matches(YEAR_REGEX, ValidationError.INVALID_FORMAT),
  lat: yup.number().strict().required(ValidationError.NUMBER_REQUIRED),
  lng: yup.number().strict().required(ValidationError.NUMBER_REQUIRED),
});

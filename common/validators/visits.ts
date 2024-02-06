import * as yup from 'yup';
import { ValidationError } from '../enums';

export const visitSchema = yup.object({
  city: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  country: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  lat: yup.number().strict().required(ValidationError.NUMBER_REQUIRED),
  lng: yup.number().strict().required(ValidationError.NUMBER_REQUIRED),
});

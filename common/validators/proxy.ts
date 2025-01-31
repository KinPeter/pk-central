import * as yup from 'yup';
import { DeeplLanguage } from '../enums/proxy';
import { ValidationError } from '../enums/api-errors';

export const translationSchema = yup.object({
  text: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  sourceLang: yup
    .string()
    .oneOf(Object.values(DeeplLanguage), ValidationError.NOT_SUPPORTED_VALUE)
    .required(ValidationError.STRING_REQUIRED),
  targetLang: yup
    .string()
    .oneOf(Object.values(DeeplLanguage), ValidationError.NOT_SUPPORTED_VALUE)
    .required(ValidationError.STRING_REQUIRED),
});

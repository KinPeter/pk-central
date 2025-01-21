import * as yup from 'yup';
import { ShortcutCategory } from '../enums/shortcut-category';
import { ValidationError } from '../enums/api-errors';
import { FLEXIBLE_URL_REGEX } from '../utils/regex';

export const shortcutSchema = yup.object({
  name: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  url: yup.string().url(ValidationError.INVALID_URL).required(ValidationError.STRING_REQUIRED),
  iconUrl: yup
    .string()
    .matches(FLEXIBLE_URL_REGEX, ValidationError.INVALID_URL)
    .required(ValidationError.STRING_REQUIRED),
  category: yup
    .string()
    .oneOf(Object.values(ShortcutCategory), ValidationError.INVALID_CATEGORY)
    .required(ValidationError.STRING_REQUIRED),
  priority: yup
    .number()
    .strict()
    .min(1, ValidationError.MIN_VALUE)
    .max(10, ValidationError.MAX_VALUE)
    .required(ValidationError.NUMBER_REQUIRED),
});

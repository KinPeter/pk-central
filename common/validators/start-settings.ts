import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';

export const pkStartSettingsSchema = yup.object({
  name: yup.string().strict().nullable().defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  shortcutIconBaseUrl: yup
    .string()
    .url(ValidationError.INVALID_URL)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  birthdaysUrl: yup
    .string()
    .url(ValidationError.INVALID_URL)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  stravaRedirectUri: yup
    .string()
    .url(ValidationError.INVALID_URL)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
});

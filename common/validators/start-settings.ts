import * as yup from 'yup';
import { ValidationError } from '../enums';

export const pkStartSettingsSchema = yup.object({
  name: yup.string().strict().nullable().required(ValidationError.NULLABLE_FIELD_REQUIRED),
  weatherApiKey: yup.string().strict().nullable().required(ValidationError.NULLABLE_FIELD_REQUIRED),
  locationApiKey: yup.string().strict().nullable().defined(ValidationError.NULLABLE_FIELD_REQUIRED),
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
  koreanUrl: yup.string().url(ValidationError.INVALID_URL).nullable().defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  stravaClientId: yup.string().strict().nullable().defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  stravaClientSecret: yup.string().strict().nullable().defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  stravaRedirectUri: yup
    .string()
    .url(ValidationError.INVALID_URL)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
});

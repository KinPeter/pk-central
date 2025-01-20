import * as yup from 'yup';
import { LOGIN_CODE_REGEX } from '../utils';
import { ValidationError } from '../enums';

export const emailRequestSchema = yup.object({
  email: yup.string().email(ValidationError.INVALID_EMAIL).required(ValidationError.STRING_REQUIRED),
});

export const loginVerifyRequestSchema = emailRequestSchema.shape({
  loginCode: yup
    .string()
    .strict()
    .matches(LOGIN_CODE_REGEX, ValidationError.INVALID_LOGIN_CODE)
    .required(ValidationError.STRING_REQUIRED),
});

export const passwordAuthRequestSchema = emailRequestSchema.shape({
  password: yup.string().strict().min(5, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
});

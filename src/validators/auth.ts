import * as yup from 'yup';

export const emailRequestSchema = yup.object({
  email: yup.string().email().required(),
});

export interface EmailRequest extends yup.InferType<typeof emailRequestSchema> {}

export const loginVerifyRequestSchema = emailRequestSchema.shape({
  loginCode: yup.string().matches(/\d{6}/).required(),
});

export interface LoginVerifyRequest extends yup.InferType<typeof loginVerifyRequestSchema> {}

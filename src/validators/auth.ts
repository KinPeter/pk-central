import * as yup from 'yup';

export const emailRequestSchema = yup.object({
  email: yup.string().email().required(),
});

export interface EmailRequest extends yup.InferType<typeof emailRequestSchema> {}

export const loginVerifyRequestSchema = emailRequestSchema.shape({
  loginCode: yup
    .string()
    .strict()
    .matches(/^\d{6}$/)
    .required(),
});

export interface LoginVerifyRequest extends yup.InferType<typeof loginVerifyRequestSchema> {}

export const magicLinkParamsSchema = yup.object({
  token: yup.string().min(5).required(),
  redirectEnv: yup.string().oneOf(['prod', 'dev']).required(),
});

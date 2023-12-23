import * as yup from 'yup';

export const emailRequestSchema = yup.object({
  email: yup.string().email().required(),
});

export interface EmailRequest extends yup.InferType<typeof emailRequestSchema> {}

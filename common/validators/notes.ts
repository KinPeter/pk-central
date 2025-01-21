import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { Link } from '../types';

export const linkSchema = yup.object({
  name: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  url: yup.string().url(ValidationError.INVALID_URL).required(ValidationError.STRING_REQUIRED),
});

export const noteSchema = yup.object({
  text: yup
    .string()
    .strict()
    .when('links', {
      is: (links: Array<Link>) => links.length === 0,
      then: schema => schema.required(ValidationError.TEXT_OR_LINK_REQUIRED),
      otherwise: schema => schema.notRequired(),
    }),
  links: yup.array().of(linkSchema).required(),
  archived: yup.boolean().strict().required(),
  pinned: yup.boolean().strict().required(),
});

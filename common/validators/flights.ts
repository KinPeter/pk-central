import * as yup from 'yup';
import { ValidationError } from '../enums';
import { SIMPLE_DATE_REGEX_POSSIBLE_PAST, SIMPLE_TIME_REGEX } from '../utils';
import { FlightClass, FlightReason, SeatType } from '../types';

export const airportSchema = yup.object({
  city: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  name: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  country: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  iata: yup.string().strict().length(3, ValidationError.EXACT_LENGTH).required(ValidationError.STRING_REQUIRED),
  icao: yup.string().strict().length(4, ValidationError.EXACT_LENGTH).required(ValidationError.STRING_REQUIRED),
  lat: yup.number().strict().required(ValidationError.NUMBER_REQUIRED),
  lng: yup.number().strict().required(ValidationError.NUMBER_REQUIRED),
});

export const airlineSchema = yup.object({
  name: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  iata: yup.string().strict().length(2, ValidationError.EXACT_LENGTH).required(ValidationError.STRING_REQUIRED),
  icao: yup.string().strict().length(3, ValidationError.EXACT_LENGTH).required(ValidationError.STRING_REQUIRED),
});
export const aircraftSchema = yup.object({
  name: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  icao: yup.string().strict().min(1, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
});

export const flightSchema = yup.object({
  date: yup
    .string()
    .matches(SIMPLE_DATE_REGEX_POSSIBLE_PAST, ValidationError.INVALID_DATE)
    .required(ValidationError.STRING_REQUIRED),
  flightNumber: yup.string().strict().min(3, ValidationError.MIN_LENGTH).required(ValidationError.STRING_REQUIRED),
  from: airportSchema.required(ValidationError.OBJECT_REQUIRED),
  to: airportSchema.required(ValidationError.OBJECT_REQUIRED),
  departureTime: yup
    .string()
    .matches(SIMPLE_TIME_REGEX, ValidationError.INVALID_TIME)
    .required(ValidationError.STRING_REQUIRED),
  arrivalTime: yup
    .string()
    .matches(SIMPLE_TIME_REGEX, ValidationError.INVALID_TIME)
    .required(ValidationError.STRING_REQUIRED),
  duration: yup
    .string()
    .matches(SIMPLE_TIME_REGEX, ValidationError.INVALID_TIME)
    .required(ValidationError.STRING_REQUIRED),
  distance: yup.number().strict().min(1, ValidationError.MIN_VALUE).required(ValidationError.NUMBER_REQUIRED),
  airline: airlineSchema.required(ValidationError.OBJECT_REQUIRED),
  aircraft: aircraftSchema.required(ValidationError.OBJECT_REQUIRED),
  registration: yup.string().strict().defined(ValidationError.STRING_REQUIRED).default(''),
  seatNumber: yup.string().strict().defined(ValidationError.STRING_REQUIRED).default(''),
  seatType: yup.string().strict().oneOf(Object.values(SeatType)).required(ValidationError.STRING_REQUIRED),
  flightClass: yup.string().strict().oneOf(Object.values(FlightClass)).required(ValidationError.STRING_REQUIRED),
  flightReason: yup.string().strict().oneOf(Object.values(FlightReason)).required(ValidationError.STRING_REQUIRED),
  note: yup.string().strict().defined(ValidationError.STRING_REQUIRED).default(''),
  isPlanned: yup.boolean().optional().default(undefined),
});

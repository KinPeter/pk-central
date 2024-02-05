export const LOGIN_CODE_REGEX = new RegExp(/^\d{6}$/);
export const FLEXIBLE_URL_REGEX = new RegExp(
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@%{}!\$&'\(\)\*\+,;=.]+$/
);

export const SIMPLE_DATE_REGEX = new RegExp(/^([2-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
export const SIMPLE_DATE_REGEX_POSSIBLE_PAST = new RegExp(
  /^([2-9]\d{3}|19\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
);
export const SIMPLE_TIME_REGEX = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/);

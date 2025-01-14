import { PasswordAuthRequest } from '../../common';

export const userEmail = `test${new Date().getTime()}@test.com`;

export const authRequest: PasswordAuthRequest = {
  email: userEmail,
  password: 'password',
};

export const updatedAuthRequest: PasswordAuthRequest = {
  email: userEmail,
  password: 'abc12345',
};

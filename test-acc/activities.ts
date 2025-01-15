import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
import { activitiesData, validChoreRequest, validGoalsRequests } from '../test-utils/test-data/activities';

export async function activitiesTests(API_URL: string) {
  describe('Activities', () => {
    let choreId: string;

    it(
      'should get the initial activities',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/activities`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, activitiesData);
        expect(json.id).toMatch(uuidV4Regex);
        expect(json.chores.length).toEqual(0);
        expect(json.walkWeeklyGoal).toEqual(0);
        expect(json.walkMonthlyGoal).toEqual(0);
        expect(json.cyclingWeeklyGoal).toEqual(0);
        expect(json.cyclingMonthlyGoal).toEqual(0);
      })
    );

    it(
      'should update the goals',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/activities/goals`, {
          method: 'PATCH',
          body: JSON.stringify(validGoalsRequests[0]),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, activitiesData);
        expect(json.chores.length).toEqual(0);
        expect(json.walkWeeklyGoal).toEqual(validGoalsRequests[0].walkWeeklyGoal);
        expect(json.walkMonthlyGoal).toEqual(validGoalsRequests[0].walkMonthlyGoal);
        expect(json.cyclingWeeklyGoal).toEqual(validGoalsRequests[0].cyclingWeeklyGoal);
        expect(json.cyclingMonthlyGoal).toEqual(validGoalsRequests[0].cyclingMonthlyGoal);
      })
    );

    it(
      'should add a chore',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/activities/chore`, {
          method: 'POST',
          body: JSON.stringify(validChoreRequest),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(201);
        expectToHaveNecessaryKeys(json, activitiesData);
        expect(json.chores.length).toEqual(1);
        expect(json.chores[0].id).toMatch(uuidV4Regex);
        choreId = json.chores[0].id;
        expectToHaveNecessaryKeys(json.chores[0], validChoreRequest);
        expect(json.chores[0].name).toBe(validChoreRequest.name);
        expect(json.chores[0].kmInterval).toBe(validChoreRequest.kmInterval);
        expect(json.chores[0].lastKm).toBe(validChoreRequest.lastKm);
      })
    );

    it(
      'should update a chore',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/activities/chore/${choreId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...validChoreRequest, lastKm: validChoreRequest.lastKm + 100 }),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, activitiesData);
        expect(json.chores.length).toEqual(1);
        expectToHaveNecessaryKeys(json.chores[0], validChoreRequest);
        expect(json.chores[0].name).toBe(validChoreRequest.name);
        expect(json.chores[0].kmInterval).toBe(validChoreRequest.kmInterval);
        expect(json.chores[0].lastKm).toBe(validChoreRequest.lastKm + 100);
      })
    );

    it(
      'should delete a chore',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/activities/chore/${choreId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, activitiesData);
        expect(json.chores.length).toEqual(0);
      })
    );

    it.each([
      ['GET', '/activities', undefined],
      ['PUT', '/activities/goals', validGoalsRequests[0]],
      ['POST', '/activities/chore', validChoreRequest],
      ['PUT', '/activities/chore', validChoreRequest],
      ['DELETE', '/activities/chore', undefined],
    ])('should get unauthorized for %s %s request without token', (method, path, body) => {
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${path}`, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: getInvalidHeaders(),
        });
        await expectUnauthorized(res);
      });
    });
  });
}

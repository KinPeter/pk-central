import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys, assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';
import { uuidV4Regex } from '../test-utils/constants';
import { activitiesData, validChoreRequest, validGoalsRequests } from '../test-utils/test-data/activities';

export async function activitiesTests(API_URL: string): Promise<void> {
  return await describe('Activities', async () => {
    let choreId = '';

    await it('should get the initial activities', async () => {
      const res = await fetch(`${API_URL}/activities`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, activitiesData);
      assert.match(json.id, uuidV4Regex);
      assert.strictEqual(json.chores.length, 0);
      assert.strictEqual(json.walkWeeklyGoal, 0);
      assert.strictEqual(json.walkMonthlyGoal, 0);
      assert.strictEqual(json.cyclingWeeklyGoal, 0);
      assert.strictEqual(json.cyclingMonthlyGoal, 0);
    });

    await it('should update the goals', async () => {
      const res = await fetch(`${API_URL}/activities/goals`, {
        method: 'PATCH',
        body: JSON.stringify(validGoalsRequests[0]),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, activitiesData);
      assert.strictEqual(json.chores.length, 0);
      assert.strictEqual(json.walkWeeklyGoal, validGoalsRequests[0].walkWeeklyGoal);
      assert.strictEqual(json.walkMonthlyGoal, validGoalsRequests[0].walkMonthlyGoal);
      assert.strictEqual(json.cyclingWeeklyGoal, validGoalsRequests[0].cyclingWeeklyGoal);
      assert.strictEqual(json.cyclingMonthlyGoal, validGoalsRequests[0].cyclingMonthlyGoal);
    });

    await it('should add a chore', async () => {
      const res = await fetch(`${API_URL}/activities/chore`, {
        method: 'POST',
        body: JSON.stringify(validChoreRequest),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 201);
      assertToHaveNecessaryKeys(json, activitiesData);
      assert.strictEqual(json.chores.length, 1);
      assert.match(json.chores[0].id, uuidV4Regex);
      choreId = json.chores[0].id;
      assertToHaveNecessaryKeys(json.chores[0], validChoreRequest);
      assert.strictEqual(json.chores[0].name, validChoreRequest.name);
      assert.strictEqual(json.chores[0].kmInterval, validChoreRequest.kmInterval);
      assert.strictEqual(json.chores[0].lastKm, validChoreRequest.lastKm);
    });

    await it('should update a chore', async () => {
      const res = await fetch(`${API_URL}/activities/chore/${choreId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...validChoreRequest, lastKm: validChoreRequest.lastKm + 100 }),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, activitiesData);
      assert.strictEqual(json.chores.length, 1);
      assertToHaveNecessaryKeys(json.chores[0], validChoreRequest);
      assert.strictEqual(json.chores[0].name, validChoreRequest.name);
      assert.strictEqual(json.chores[0].kmInterval, validChoreRequest.kmInterval);
      assert.strictEqual(json.chores[0].lastKm, validChoreRequest.lastKm + 100);
    });

    await it('should delete a chore', async () => {
      const res = await fetch(`${API_URL}/activities/chore/${choreId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, activitiesData);
      assert.strictEqual(json.chores.length, 0);
    });

    const requests = [
      ['GET', '/activities', undefined],
      ['PATCH', '/activities/goals', validGoalsRequests[0]],
      ['POST', '/activities/chore', validChoreRequest],
      ['PUT', '/activities/chore/choreId', validChoreRequest],
      ['DELETE', '/activities/chore/choreId', undefined],
    ];
    for (const [method, path, body] of requests) {
      await it(`should get unauthorized for requests without token (${method} ${path})`, async () => {
        const res = await fetch(`${API_URL}${path}`, {
          method: method as string,
          body: body ? JSON.stringify(body) : undefined,
          headers: getInvalidHeaders(),
        });
        await assertUnauthorized(res);
      });
    }
  });
}

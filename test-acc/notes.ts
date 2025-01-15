import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, uuidV4Regex } from '../test-utils/constants';
import { validNoteRequests } from '../test-utils/test-data/notes';
import { assertToHaveNecessaryKeys, assertUnauthorized, getHeaders, getInvalidHeaders } from 'test-utils/acc-utils';

export async function notesTests(API_URL: string): Promise<void> {
  return await describe('Notes', async () => {
    const endpoint = '/notes';
    let itemId: string;
    const keys = Object.keys(validNoteRequests[0]).filter(key => key !== 'userId');

    await it('should create a note', async () => {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validNoteRequests[0]),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 201);
      assertToHaveNecessaryKeys(json, validNoteRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        assert.deepEqual(json[key], validNoteRequests[0][key as keyof (typeof validNoteRequests)[0]]);
      });
    });

    await it('should update a note', async () => {
      const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...validNoteRequests[0], pinned: true }),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, validNoteRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        if (key !== 'pinned') {
          assert.deepEqual(json[key], validNoteRequests[0][key as keyof (typeof validNoteRequests)[0]]);
        } else {
          assert.strictEqual(json[key], true);
        }
      });
    });

    await it('should create a new and get all notes', async () => {
      const createRes = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validNoteRequests[1]),
        headers: getHeaders(),
      });
      assert.strictEqual(createRes.status, 201);

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.length, 2);
      assertToHaveNecessaryKeys(json[0], validNoteRequests[0]);
      assertToHaveNecessaryKeys(json[1], validNoteRequests[0]);
    });

    await it('should delete a note', async () => {
      const deleteRes = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      assert.strictEqual(deleteRes.status, 200);

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.length, 1);
      assertToHaveNecessaryKeys(json[0], validNoteRequests[0]);
      assert.notStrictEqual(json[0].id, itemId);
    });

    const requests = [
      ['GET', endpoint, undefined],
      ['POST', endpoint, validNoteRequests[0]],
      ['PUT', `${endpoint}/${randomUUID}`, validNoteRequests[0]],
      ['DELETE', `${endpoint}/${randomUUID}`, undefined],
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

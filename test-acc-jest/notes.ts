import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
import { validNoteRequests } from '../test-utils/test-data/notes';

export async function notesTests(API_URL: string) {
  describe('Notes', () => {
    const endpoint = '/notes';
    let itemId: string;
    const keys = Object.keys(validNoteRequests[0]).filter(key => key !== 'userId');

    it(
      'should create a note',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validNoteRequests[0]),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(201);
        expectToHaveNecessaryKeys(json, validNoteRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          expect(json[key]).toEqual(validNoteRequests[0][key as keyof (typeof validNoteRequests)[0]]);
        });
      })
    );

    it(
      'should update a note',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...validNoteRequests[0], pinned: true }),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validNoteRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          if (key !== 'pinned') {
            expect(json[key]).toEqual(validNoteRequests[0][key as keyof (typeof validNoteRequests)[0]]);
          } else {
            expect(json[key]).toBe(true);
          }
        });
      })
    );

    it(
      'should create a new and get all notes',
      runSequentially(async () => {
        const createRes = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validNoteRequests[1]),
          headers: getHeaders(),
        });
        expect(createRes.status).toBe(201);

        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(json.length).toEqual(2);
        expectToHaveNecessaryKeys(json[0], validNoteRequests[0]);
        expectToHaveNecessaryKeys(json[1], validNoteRequests[0]);
      })
    );

    it(
      'should delete a note',
      runSequentially(async () => {
        const deleteRes = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        expect(deleteRes.status).toBe(200);

        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(json.length).toEqual(1);
        expectToHaveNecessaryKeys(json[0], validNoteRequests[0]);
        expect(json[0].id).not.toEqual(itemId);
      })
    );

    it.each([
      ['GET', endpoint, undefined],
      ['POST', endpoint, validNoteRequests[0]],
      ['PUT', endpoint, validNoteRequests[0]],
      ['DELETE', endpoint, undefined],
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

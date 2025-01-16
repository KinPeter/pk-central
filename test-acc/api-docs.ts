import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export async function apiDocsTests(API_URL: string): Promise<void> {
  return await describe('Api Docs', async () => {
    await it('should get the docs', async () => {
      assert.strictEqual(1, 1);
      const res = await fetch(`${API_URL}/`);
      const text = await res.text();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(text.startsWith('<!-- GENERATED CONTENT -->'), true);
      assert.strictEqual(text.includes('<title>PK Central</title>'), true);
    });
  });
}

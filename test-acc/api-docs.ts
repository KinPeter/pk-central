import { expect, it, describe } from '@jest/globals';

export function apiDocsTests(API_URL: string) {
  describe('API Docs', () => {
    it('should get the docs', async () => {
      const res = await fetch(`${API_URL}/`);
      const text = await res.text();
      expect(res.status).toBe(200);
      expect(text.startsWith('<!-- GENERATED CONTENT --><!doctype html>')).toBe(true);
      expect(text).toContain('<title>PK Central</title>');
    });
  });
}

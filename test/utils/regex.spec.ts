import { describe, it, expect } from '@jest/globals';
import { COORDINATES_QUERY_REGEX } from '../../common';

describe('regex', () => {
  describe('coordinates query regex', () => {
    it.each([
      ['12.1234,12.123456', true],
      ['-12.1234,12.123456', true],
      ['173.1234,-65.123456', true],
      ['12,122.123456', true],
      ['12.1234,77', true],
      ['34,56', true],
      ['12.1234 , 12.123456', false],
      ['Asd,34.2121', false],
      ['542.21,ASD', false],
      ['', false],
      ['34.56456', false],
      [',34.56456', false],
      ['34,56234,', false],
    ])('should match proper coordinates query format', (query, shouldMatch) => {
      console.log({ query, shouldMatch });
      const match = query.match(COORDINATES_QUERY_REGEX);

      if (shouldMatch) {
        expect(match).not.toBeNull();
        expect(match).toHaveLength(3); // first element is the full string, second lat, third long
      } else {
        expect(match).toBeNull();
      }
    });
  });
});

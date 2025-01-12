import { describe, it, expect } from '@jest/globals';
import { getParams } from '../../server/request-utils';

describe('Server - request utils', () => {
  describe('convertRequest', () => {
    it('should convert the IncomingMessage to Request object', () => {
      // Test implementation
    });
  });

  describe('getParams', () => {
    it.each([
      {
        pathOptions: ['/activities', '/activities/:operation', '/activities/:operation/:id'],
        pathname: '/activities',
        expected: {},
      },
      {
        pathOptions: ['/activities', '/activities/:operation', '/activities/:operation/:id'],
        pathname: '/activities/initialize',
        expected: { operation: 'initialize' },
      },
      {
        pathOptions: ['/activities', '/activities/:operation', '/activities/:operation/:id'],
        pathname: '/activities/chore/123',
        expected: { operation: 'chore', id: '123' },
      },
    ])('should extract the parameters from the URL', ({ pathOptions, pathname, expected }) => {
      // Test implementation
      expect(getParams(pathOptions, pathname)).toEqual(expected);
    });
  });
});

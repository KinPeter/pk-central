import { omitIds } from './omit-ids.js';

describe('omitIds', () => {
  const array1 = [
    { foo: 'bar', _id: 'some id1', id: 'realId1', userId: 'user1' },
    { foo: 'baz', _id: 'some id2', id: 'realId2', userId: 'user1' },
  ];
  const array2 = [
    { foo: 'bar', id: 'realId1', userId: 'user1' },
    { foo: 'baz', id: 'realId2', userId: 'user1' },
  ];
  const array3 = [
    { foo: 'bar', _id: 'some id1', id: 'realId1' },
    { foo: 'baz', _id: 'some id2', id: 'realId2' },
  ];
  const array4 = [
    { foo: 'bar', id: 'realId1' },
    { foo: 'baz', id: 'realId2' },
  ];

  [array1, array2, array3, array4].forEach(array => {
    it('should omit _id and userId fields ', () => {
      const result: any[] = omitIds<any>(array);
      expect(result[0].hasOwnProperty('_id')).toBeFalse();
      expect(result[1].hasOwnProperty('_id')).toBeFalse();
      expect(result[0].hasOwnProperty('userId')).toBeFalse();
      expect(result[1].hasOwnProperty('userId')).toBeFalse();
      expect(result[0].foo).toEqual('bar');
      expect(result[1].foo).toEqual('baz');
      expect(result[0].id).toEqual('realId1');
      expect(result[1].id).toEqual('realId2');
    });
  });
});

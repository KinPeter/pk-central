import { omitIds, omitIdsForOne } from './omit-ids.js';

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

describe('omitIdsForOne', () => {
  const obj1 = { foo: 'bar', _id: 'some id1', id: 'realId1', userId: 'user1' };
  const obj2 = { foo: 'bar', id: 'realId1', userId: 'user1' };
  const obj3 = { foo: 'bar', _id: 'some id1', id: 'realId1' };
  const obj4 = { foo: 'bar', id: 'realId1' };

  [obj1, obj2, obj3, obj4].forEach(obj => {
    it('should omit _id and userId fields ', () => {
      const result: any = omitIdsForOne<any>(obj);
      expect(result.hasOwnProperty('_id')).toBeFalse();
      expect(result.hasOwnProperty('userId')).toBeFalse();
      expect(result.foo).toEqual('bar');
      expect(result.id).toEqual('realId1');
    });
  });
});

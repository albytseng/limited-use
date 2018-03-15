import assert from 'assert';
import LimitedUse from '../src/limited-use';
import CollectiveUse from '../src/collective-use';

class ProperUseClass {use(){} disuse(){}};
class ImproperUseClass {use(){}};

describe('CollectiveUse', function() {
  describe('constructor(...args)', function() {
    const make = (...args) => () => new CollectiveUse(...args);

    const tests = [
      {
        desc: 'should succeed with no args',
        args: [],
        toAssert: {method: 'doesNotThrow', args: []},
      },
      {
        desc: 'should succeed with proper `args`',
        args: [new LimitedUse(), new ProperUseClass()],
        toAssert: {method: 'doesNotThrow', args: []},
      },
      {
        desc: 'should throw with mix of proper and improper `args`',
        args: [new LimitedUse(), new ProperUseClass(), new ImproperUseClass()],
        toAssert: {method: 'throws', args: [TypeError]},
      },
    ];

    tests.forEach(function(test) {
      it(test.desc, function() {
        assert[test.toAssert.method](make(...test.args), ...test.toAssert.args);
      });
    });
  });

  describe('.isUsable', function() {
    const useful1 = new LimitedUse(() => {}, 2);
    const useful2 = new LimitedUse(() => {}, 1);
    const collective = new CollectiveUse(useful1, useful2);

    it('should be true when the set is not disused and when at least one member is usable', function() {
      assert(collective.isUsable);
      assert(useful1.isUsable);
      assert(useful2.isUsable);

      collective.useSync();
      assert(collective.isUsable);
      assert(useful1.isUsable);
      assert(!useful2.isUsable);

      collective.useSync();
      assert(!collective.isUsable);
      assert(!useful1.isUsable);
      assert(!useful2.isUsable);
    });
  });

  describe('.isDisused', function() {
    it('should be true when the set is disused', function() {
      const collective = new CollectiveUse();
      assert(!collective.isDisused);
      collective.disuse();
      assert(collective.isDisused);
    });
  });

  describe('.has(obj)', function() {
    const useful1 = new LimitedUse();
    const useful2 = new LimitedUse();
    const useful3 = new LimitedUse();
    const collective = new CollectiveUse(useful1, useful2);

    it('should return true when `obj` is a member of the set', function() {
      assert(collective.has(useful1));
    });

    it('should return false when `obj` is not a member of the set', function() {
      assert(!collective.has(useful3));
    })
  });

  describe('.add(...args)', function() {
    const make = (...args) => () => new CollectiveUse(...args);

    const tests = [
      {
        desc: 'should succeed with no args',
        args: [],
        toAssert: {method: 'doesNotThrow', args: []},
      },
      {
        desc: 'should succeed with proper `args`',
        args: [new LimitedUse(), new ProperUseClass()],
        toAssert: {method: 'doesNotThrow', args: []},
      },
      {
        desc: 'should throw with mix of proper and improper `args`',
        args: [new LimitedUse(), new ProperUseClass(), new ImproperUseClass()],
        toAssert: {method: 'throws', args: [TypeError]},
      },
    ];
  });

  describe('.remove(obj)', function() {
    const useful1 = new LimitedUse();
    const useful2 = new LimitedUse();
    const collective = new CollectiveUse(useful1);

    it('should return false when `obj` is not successfully removed', function() {
      assert(!collective.remove(useful2));
    });

    it('should return true when `obj` is successfully removed', function() {
      assert(collective.remove(useful1));
    });
  });

  describe('.clear()', function() {
    const useful1 = new LimitedUse();
    const useful2 = new LimitedUse();
    const collective = new CollectiveUse(useful1, useful2);

    it('should cause `has()` to return false for any member', function() {
      assert(collective.has(useful1));
      assert(collective.has(useful2));
      collective.clear();
      assert(!collective.has(useful1));
      assert(!collective.has(useful2));
    });
  });

  describe('.use(...args)', function() {
    let useful1;
    let useful2;
    const promise1 = new Promise(res => {
      useful1 = new LimitedUse(arg => setTimeout(() => res(arg)), 2);
    });
    const promise2 = new Promise(res => {
      useful2 = new LimitedUse(arg => setTimeout(() => res(arg)));
    });
    const collective = new CollectiveUse(useful1, useful2);

    it('should consume one use with same `args` on each member asynchronously', function() {
      collective.use('hello');
      return Promise.all([promise1, promise2]).then((results) => {
        results.forEach(r => assert.strictEqual(r, 'hello'));
        assert(useful1.isUsable);
        assert(!useful2.isUsable);
      });
    });
  });

  describe('.useSync(...args)', function() {
    let useful1;
    let useful2;
    useful1 = new LimitedUse(arg => {
      assert(arg, 'hello');
      assert(useful2.isUsable);
    });
    useful2 = new LimitedUse(arg => {
      assert(arg, 'hello');
      assert(!useful1.isUsable);
    });
    const collective = new CollectiveUse(useful1, useful2);

    it('should consume one use with same `args` on each member synchronously', function() {
      collective.use('hello');
    });
  });

  describe('.disuse()', function() {
    const useful1 = new LimitedUse(() => {});
    const useful2 = new LimitedUse(() => {}, 2);
    const collective = new CollectiveUse(useful1, useful2);

    it('should mark this set and every member as unusable', function() {
      assert(!collective.isDisused);
      assert(useful1.isUsable);
      assert(useful2.isUsable);
      collective.disuse();
      assert(collective.isDisused);
      assert(!useful1.isUsable);
      assert(!useful2.isUsable);
    });
  });
});

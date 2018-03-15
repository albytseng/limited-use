import assert from 'assert';
import LimitedUse from '../src/limited-use';

const usageSimple = () => {};

const makeGetAttr = (attr, n, ...args) => {
  const limitedUse = new LimitedUse(...args);
  for (let i = 0; i < n; i++) {
    limitedUse.use();
  }
  return limitedUse[attr];
};

describe('LimitedUse', function() {
  describe('static .hasLimitedUse(obj)', function() {
    it('should return true when `obj` is a `LimitedUse` instance', function() {
      assert(LimitedUse.hasLimitedUse(new LimitedUse()));
    });
    it('should return false when `obj` is not a `LimitedUse` instance', function() {
      assert(!LimitedUse.hasLimitedUse('hello'));
    });
  });

  describe('constructor()', function() {
    const make = (...args) => () => new LimitedUse(...args);

    const tests = [
      {
        args: [usageSimple],
        toAssert: {method: 'doesNotThrow', args: []},
      },
      {
        args: [usageSimple, 2],
        toAssert: {method: 'doesNotThrow', args: []},
      },
      {
        args: [1],
        toAssert: {method: 'throws', args: [TypeError]},
      },
    ];

    tests.forEach(function(test) {
      it(`${test.toAssert.method} with these args: ${test.args}`, function() {
        assert[test.toAssert.method](make(...test.args), ...test.toAssert.args);
      });
    });
  });

  describe('.isUsable', function() {
    const tests = [
      {args: ['isUsable', 0, usageSimple], toAssert: true},
      {args: ['isUsable', 1, usageSimple], toAssert: false},
      {args: ['isUsable', 2, usageSimple], toAssert: false},
    ];

    tests.forEach(function(test) {
      it(`should be ${test.toAssert} for a 1-use object after ${test.args[1]} uses`, function() {
        assert.strictEqual(makeGetAttr(...test.args), test.toAssert);
      });
    });
  });

  describe('.isDisused', function() {
    const tests = [
      {args: ['isDisused', 0, usageSimple], toAssert: false},
      {args: ['isDisused', 1, usageSimple], toAssert: true},
      {args: ['isDisused', 2, usageSimple], toAssert: true},
    ];

    tests.forEach(function(test) {
      it(`should be ${test.toAssert} for a 1-use object after ${test.args[1]} uses`, function() {
        assert.strictEqual(makeGetAttr(...test.args), test.toAssert);
      });
    });
  });

  describe('.use()', function() {
    it('should cause .isUsable to be false after it is called more times than the limit', function() {
      const limit = 3;
      const limitedUse = new LimitedUse(usageSimple, limit);
      for (let i = 0; i < limit - 1; i++) {
        limitedUse.use();
        assert(limitedUse.isUsable);
      }
      limitedUse.use();
      assert(!limitedUse.isUsable);
    });
  });

  describe('.disuse()', function() {
    it('should immediately cause .isUsable to be false', function() {
      const limitedUse = new LimitedUse(usageSimple, 4);
      assert(limitedUse.isUsable);
      limitedUse.disuse();
      assert(!limitedUse.isUsable);
    });
  });
});

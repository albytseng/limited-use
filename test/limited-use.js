import assert from 'assert';
import LimitedUse from '../src/limited-use';

const usageSimple = () => {};

describe('LimitedUse', function() {
  describe('#constructor()', function() {
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

  describe('#isUsable, #isDisused', function() {
    const make = (n, ...args) => {
      const limitedUse = new LimitedUse(...args);
      for (let i = 0; i < n; i++) {
        limitedUse.use();
      }
      return limitedUse.isUsable;
    };

    const tests = [
      {args: [0, usageSimple], toAssert: {isUsable: true, isDisused: false}},
      {args: [1, usageSimple], toAssert: {isUsable: false, isDisused: true}},
      {args: [2, usageSimple], toAssert: {isUsable: false, isDisused: true}},
    ];

    tests.forEach(function(test) {
      it(`should be opposites: isUsable should be ${test.toAssert} for a 1-use object after ${test.args[0]} uses`, function() {
        const isUsableResult = make(...test.args);
        assert.strictEqual(isUsableResult, test.toAssert.isUsable);
        assert.strictEqual(!isUsableResult, test.toAssert.isDisused);
      });
    });
  });

  describe('#use()', function() {
    it('should cause #isUsable to be false after it is called more times than the limit', function() {
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

  describe('#disuse()', function() {
    it('should immediately cause #isUsable to be false', function() {
      const limitedUse = new LimitedUse(usageSimple, 4);
      assert(limitedUse.isUsable);
      limitedUse.disuse();
      assert(!limitedUse.isUsable);
    });
  });
});

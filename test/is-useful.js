import assert from 'assert';
import isUseful from '../src/is-useful';

describe(`#isUseful(obj)`, function() {
  it('should return false when `obj` has no `use()`', function() {
    assert(!isUseful(new class {disuse(){}}()));
  });
  it('should return false when `obj` has no `disuse()`', function() {
    assert(!isUseful(new class {use(){}}()));
  });
  it('should return true when `obj` has `use()` and `disuse()`', function() {
    assert(isUseful(new class {use(){} disuse(){}}()));
  });
});

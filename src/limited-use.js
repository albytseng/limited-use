/** Holds `usageFn`s for `LimitedUse` instances. */
const _usageFns = new WeakMap();
const _setUsageFn = WeakMap.prototype.set.bind(_usageFns);
const _getUsageFn = WeakMap.prototype.get.bind(_usageFns);

/** Holds `usageLimit` counts for `LimitedUse` instances. */
const _usageLimits = new WeakMap();
const _setUsageLimit = WeakMap.prototype.set.bind(_usageLimits);
const _getUsageLimit = WeakMap.prototype.get.bind(_usageLimits);

/**
 * Class representing a function with limited use.
 */
class LimitedUse {
  /**
   * Checks if `obj` is a `LimitedUse` instance.
   * @param {object} obj The object to check.
   * @returns {boolean} Whether `obj` is a `LimitedUse` instance.
   */
  static hasLimitedUse(obj) {
    return obj instanceof LimitedUse;
  }

  /**
   * Creates a `LimitedUse` instance.
   * @param {function} [usageFn = () => {}] The function to limit in use.
   * @param {number} [usageLimit = 1] The maximum allowed number of usages.
   */
  constructor(usageFn = () => {}, usageLimit = 1) {
    if (
      typeof usageFn !== 'function'
      || typeof usageLimit !== 'number'
      || usageLimit < 0
    ) {
      throw TypeError(
        `Invalid arguments to the \`LimitedClass\` constructor, which takes a \`usageFn\` function and an optional \`usageLimit\` number.`
      );
    }

    _setUsageFn(this, usageFn);
    _setUsageLimit(this, usageLimit);
  }

  /**
   * Indicates whether `usageFn` can still be called.
   * @returns {boolean} True if `usageFn` can still be called.
   */
  get isUsable() {
    return _getUsageLimit(this) > 0;
  }

  /**
   * The negation of `isUsable`.
   * @returns {boolean} True if `isUsable` is false.
   */
  get isDisused() {
    return !this.isUsable;
  }

  /**
   * Calls `usageFn` if it is still usable.
   * @param {...*} [args] Arbitrary arguments to pass to `usageFn`.
   * @returns {void}
   */
  use(...args) {
    const usageLimit = _getUsageLimit(this);
    if (usageLimit <= 0) return;
    _setUsageLimit(this, usageLimit - 1);
    _getUsageFn(this)(...args);
  }

  /**
   * Immediately makes `usageFn` unusable.
   * @returns {void}
   */
  disuse() {
    _setUsageLimit(this, 0);
  }
}

export default LimitedUse;

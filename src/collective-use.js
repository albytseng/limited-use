import isUseful from './is-useful';

/** Holds collections of `*Use` instances for `CollectiveUse` instances. */
const _usefulCollections = new WeakMap();
const _setUsefulCollection = WeakMap.prototype.set.bind(_usefulCollections);
const _getUsefulCollection = WeakMap.prototype.get.bind(_usefulCollections);

/** Holds `isDisused` states for `CollectiveUse` instances. */
const _isDisusedStates = new WeakMap();
const _setIsDisusedState = WeakMap.prototype.set.bind(_isDisusedStates);
const _getIsDisusedState = WeakMap.prototype.get.bind(_isDisusedStates);

/**
 * An aggregate of `*Use` instances that can be used/disused as a group.
 */
class CollectiveUse {
  /**
   * Creates a `CollectiveUse` instance.
   */
  constructor(...usefuls) {
    _setIsDisusedState(this, false);
    const usefulCollection = new Set();
    this._addToCollection(usefulCollection, ...usefuls);
    _setUsefulCollection(this, usefulCollection);
  }

  /**
   * Indicates whether this set has not been disused and that there is at least
   * one member that is still usable.
   * @returns {boolean} True if not disused and at least one member is usable.
   */
  get isUsable() {
    return (
      !_getIsDisusedState(this)
      && Array.from(_getUsefulCollection(this)).some(u => u.isUsable)
    );
  }

  /**
   * Indicates whether this set and every member has been disused.
   * @returns {boolean} True if disused.
   */
  get isDisused() {
    return _getIsDisusedState(this);
  }

  /**
   * Checks if `useful` is a member of this `CollectiveUse` instance.
   * @param {object} useful The `*Use` object to check membership of.
   * @returns {boolean} True if `useful` is a member.
   */
  has(useful) {
    return !_getIsDisusedState(this) && _getUsefulCollection(this).has(useful);
  }

  /**
   * Adds `*Use` instances to this `CollectiveUse` instance.
   * @param {...*} usefuls One or more `*Use` instances.
   * @returns {void}
   */
  add(...usefuls) {
    if (_getIsDisusedState(this)) return;
    this._addToCollection(_getUsefulCollection(this), ...usefuls);
  }

  /**
   * Removes the `*Use` instance from this `CollectiveUse` instance.
   * @param {object} useful The `*Use` instance to remove.
   * @returns {boolean} True if the removal was successful, else false.
   */
  remove(useful) {
    if (_getIsDisusedState(this)) return;
    return _getUsefulCollection(this).delete(useful);
  }

  /**
   * Removes all members from this `CollectiveUse` instance.
   * @returns {void}
   */
  clear() {
    if (_getIsDisusedState(this)) return;
    _getUsefulCollection(this).clear();
  }

  /**
   * Asynchronously executes the `use()` method of every member of this
   * `CollectiveUse` instance.
   * @param {...*} [args] Arbitrary arguments to pass to `use()`.
   * @returns {void}
   */
  use(...args) {
    if (_getIsDisusedState(this)) return;
    for (const useful of _getUsefulCollection(this)) {
      setTimeout(() => useful.use(...args));
    }
  }

  /**
   * Synchronously executes the `use()` method of every member of this
   * `CollectiveUse` instance.
   * @param {...*} [args] Arbitrary arguments to pass to `use()`.
   * @returns {void}
   */
  useSync(...args) {
    if (_getIsDisusedState(this)) return;
    for (const useful of _getUsefulCollection(this)) {
      useful.use(...args);
    }
  }

  /**
   * Marks this `CollectiveUse` instance, and every member, as unusable.
   * @returns {void}
   */
  disuse() {
    if (_getIsDisusedState(this)) return;
    for (const useful of _getUsefulCollection(this)) {
      useful.disuse();
    }
    _setIsDisusedState(this, true);
  }

  /**
   * Adds `*Use` instances to the given collection object.
   * @private
   * @param {object} collection The collection to add to.
   * @param {...*} usefuls One or more `*Use` instances.
   * @returns {void}
   */
  _addToCollection(collection, ...usefuls) {
    if (usefuls.length < 1) return;

    if (
      !collection
      || typeof collection !== 'object'
      || typeof collection.add !== 'function'
      || typeof collection[Symbol.iterator] !== 'function'
    ) {
      throw TypeError(
        `The \`collection\` argument must have an \`add()\` method and be iterable.`
      );
    }

    for (const useful of usefuls) {
      if (!isUseful(useful)) {
        throw TypeError(
          `Arguments to \`CollectiveUse\`'s constructor and \`add()\` method must have \`use()\` and \`disuse()\` methods.`
        );
      }
      collection.add(useful);
    }
  }
}

export default CollectiveUse;

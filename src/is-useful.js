/**
 * Checks if `obj` can be used/disused.
 * @param {type} obj The object to check.
 * @return {type} True if `obj` can be used/disused.
 */
const isUseful = obj => {
  return (
    obj
    && typeof obj === 'object'
    && typeof obj.use === 'function'
    && typeof obj.disuse === 'function'
  );
}

export default isUseful;

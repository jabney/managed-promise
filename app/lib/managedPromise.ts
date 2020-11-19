/**
 * Create a one-at-a-time promise function that will always
 * return the same promise by the same key until it's fulfilled.
 */
type KeyedPromiseFn<K, T> = (key?: K | null) => Promise<T>;

export const managedPromise = <K, T>(
  fn: KeyedPromiseFn<K, T>,
): KeyedPromiseFn<K, T> => {
  const promises = new Map<K | null, Promise<T>>();

  // Return either the in-flight promise or create a new one for the key.
  return (key = null) => {
    let promise = promises.get(key);

    if (promise === undefined) {
      // Create and manage the promise.
      promise = fn(key).then((data) => {
        promises.delete(key);
        return data;
      });
      promises.set(key, promise);
    }

    return promise;
  };
};

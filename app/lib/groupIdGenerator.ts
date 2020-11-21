import { idGenerator } from './idGenerator';

export const groupIdGenerator = () => {
  const promiseIdMap = new Map<Promise<any>, number>();
  const newId = idGenerator();

  return (promise: Promise<any>) => {
    let id = promiseIdMap.get(promise);
    if (id == null) {
      id = newId();
      promiseIdMap.set(promise, id);
    }
    return id;
  };
};

import React, {useEffect, useState} from 'react';
import {ListService, ReadonlyList} from 'app/services/ListService';

export const ListContext = React.createContext<{
  list: ReadonlyList;
  addItem: () => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  clear: () => Promise<void>;
}>({
  list: [],
  addItem: () => Promise.reject('context not initialized'),
  deleteItem: () => Promise.reject('context not initialized'),
  clear: () => Promise.reject('context not initialized'),
});

export const ListProvider: React.FC = ({children}) => {
  const [svc] = useState(() => new ListService());
  const [list, setList] = useState<ReadonlyList>([]);

  useEffect(() => svc.observe(setList), []);

  return (
    <ListContext.Provider
      value={{
        list,
        addItem: () => svc.add(),
        deleteItem: (id: number) => svc.delete(id),
        clear: () => svc.clear(),
      }}>
      {children}
    </ListContext.Provider>
  );
};

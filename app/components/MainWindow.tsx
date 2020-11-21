import React from 'react';
import { Button } from './Button';
import { List } from './List';
import { useListContext } from './ListProvider';

export const MainWindow: React.FC = () => {
  const { addItem } = useListContext();

  return (
    <>
      <List />
      <Button text="Send Promise" onPress={addItem} />
    </>
  );
};

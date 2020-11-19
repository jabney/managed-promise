import React, {useContext} from 'react';
import {Button} from './Button';
import {List} from './List';
import {ListContext} from './ListProvider';

export const MainWindow: React.FC = () => {
  const {addItem} = useContext(ListContext);

  return (
    <>
      <List />
      <Button text="Send Promise" onPress={() => addItem()} />
    </>
  );
};

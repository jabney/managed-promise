import React from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Item } from 'app/services/ListService';

interface Props {
  item: Item;
  index: number;
}

export const ListItem: React.FC<Props> = ({ item }) => {
  return (
    <Animated.View style={[styles.container, { backgroundColor: item.color }]}>
      <Text style={styles.text}>{item.request}</Text>
      {item.response && <Text style={styles.text}>{item.response}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 12,
    paddingHorizontal: 16,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    flex: 1,
  },
});

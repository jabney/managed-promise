import React from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Item } from 'app/services/ListService';
import { schemeCategory10, color as d3Color } from 'd3';

interface Props {
  item: Item;
  index: number;
}

const getColor = (num: number) =>
  d3Color(schemeCategory10[num % 10])
    ?.darker(2)
    .formatHex() ?? '#777';

export const ListItem: React.FC<Props> = ({ item }) => (
  <Animated.View
    style={[styles.container, { backgroundColor: getColor(item.responseId) }]}>
    <Text style={styles.text}>{`Request: ${item.id + 1}`}</Text>
    {item.responseId != null && (
      <Text style={styles.text}>{`Response: ${item.responseId + 1}`}</Text>
    )}
  </Animated.View>
);

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

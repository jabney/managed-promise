import React from 'react'
import { Text, StyleSheet, Animated } from 'react-native'
import { Item } from 'app/services/ListService'
import { schemeCategory10, color } from 'd3'

interface Props {
  item: Item
  index: number
}

const getGroupColor = (num: number) =>
  color(schemeCategory10[num % 10])
    ?.darker(2)
    .formatHex() ?? '#777'

export const ListItem: React.FC<Props> = ({ item }) => (
  <Animated.View
    style={[
      styles.container,
      { backgroundColor: getGroupColor(item.groupId) },
    ]}>
    <Text style={styles.text}>{`Request: ${item.id + 1}`}</Text>
    {item.groupId != null && (
      <Text style={styles.text}>{`Response: ${item.groupId + 1}`}</Text>
    )}
  </Animated.View>
)

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
})

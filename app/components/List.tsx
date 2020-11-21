import React, { useEffect, useRef } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { useListContext } from 'app/components/ListProvider'
import { Item } from 'app/services/ListService'
import { ListItem } from './ListItem'

const renderItem = ({ item, index }: ListRenderItemInfo<Item>) => {
  return <ListItem item={item} index={index} />
}

const keyExtractor = (item: Item, index: number) => item.id.toString()

export const List: React.FC = React.memo(() => {
  const ref = useRef<FlatList<Item> | null>(null)
  const { list } = useListContext()

  useEffect(() => void setTimeout(() => void ref.current?.scrollToEnd(), 100), [
    list.length,
  ])

  return (
    <FlatList
      ref={ref}
      data={list}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
})

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {ListProvider} from './components/ListProvider';
import {MainWindow} from './components/MainWindow';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ListProvider>
        <MainWindow />
      </ListProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
});

export default App;

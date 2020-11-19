import React, {useCallback, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  onPress: () => void;
  text: string;
}

const fadeInOut = (anim: Animated.Value) => {
  Animated.sequence([
    Animated.timing(anim, {
      toValue: 0,
      duration: 125,
      useNativeDriver: true,
    }),
    Animated.timing(anim, {
      toValue: 1,
      duration: 125,
      useNativeDriver: true,
    }),
  ]).start();
};

export const Button: React.FC<Props> = ({onPress, text}) => {
  const [anim] = useState(() => new Animated.Value(1));

  const [opacity] = useState(() =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  );

  const handlePress = useCallback(() => {
    onPress();
    fadeInOut(anim);
  }, []);

  return (
    <Animated.View
      style={[
        styles.buttonView,
        {
          opacity,
        },
      ]}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    height: 64,
    padding: 12,
  },
  button: {
    flex: 1,
    backgroundColor: 'steelblue',
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

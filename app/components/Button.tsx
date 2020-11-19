import React, { useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  onPress: () => void;
  text: string;
}

const fadeIn = (anim: Animated.Value) => () =>
  Animated.timing(anim, {
    toValue: 1,
    duration: 125,
    useNativeDriver: true,
  }).start();

const fadeOut = (anim: Animated.Value) => () =>
  Animated.timing(anim, {
    toValue: 0,
    duration: 125,
    useNativeDriver: true,
  }).start();

const opacityInterpolator = (anim: Animated.Value) =>
  anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

export const Button: React.FC<Props> = ({ onPress, text }) => {
  const [anim] = useState(() => new Animated.Value(1));
  const [opacity] = useState(() => opacityInterpolator(anim));

  const handlers = useMemo(
    () => ({
      fadeIn: fadeIn(anim),
      fadeOut: fadeOut(anim),
      onPress: onPress,
    }),
    [onPress],
  );

  return (
    <Animated.View
      style={[
        styles.buttonView,
        {
          opacity,
        },
      ]}>
      <Pressable
        style={styles.button}
        onPressIn={handlers.fadeOut}
        onPress={handlers.onPress}
        onPressOut={handlers.fadeIn}>
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

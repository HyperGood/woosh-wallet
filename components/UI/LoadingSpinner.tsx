import { useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, View, ColorValue, Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  color?: ColorValue;
}

const startRotationAnimation = (durationMs: number, rotationDegree: Animated.Value): void => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 360,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();
};

const LoadingSpinner = ({ color = '#ffffff' }: Props): JSX.Element => {
  const rotationDegree = useRef(new Animated.Value(0)).current;

  //Only working on Android, it resolves back navigation functionality
  //When you press back button or use going back gesture it removes enterily the native functionality
  //and does nothing
  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  })

  useEffect(() => {
    startRotationAnimation(1000, rotationDegree);
  }, [rotationDegree]);

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <View style={[styles.background, { borderColor: color }]} />
      <Animated.View
        style={[
          styles.progress,
          { borderTopColor: color },
          {
            transform: [
              {
                rotateZ: rotationDegree.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const height = 24;

const styles = StyleSheet.create({
  container: {
    width: height,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: height / 2,
    borderWidth: 4,
    opacity: 0.25,
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: height / 2,
    borderWidth: 4,
  },
});

export default LoadingSpinner;

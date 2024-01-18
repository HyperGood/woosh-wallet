import { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/global-styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  children?: React.ReactNode;
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(({ children }, ref) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);
  const isActive = useCallback(() => {
    return active.value;
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      scrollTo,
      isActive,
    }),
    [scrollTo, isActive]
  );
  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = context.value.y + event.translationY;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value < -SCREEN_HEIGHT / 4) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        scrollTo(0);
      }
    });

  const reanimatedBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );
    return { borderRadius, transform: [{ translateY: translateY.value }] };
  });

  useEffect(() => {
    scrollTo(-SCREEN_HEIGHT / 2);
  }, []);

  const rBackDropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
    };
  });

  const rBackDropProps = useAnimatedStyle(() => {
    return {
      pointerEvents: active.value ? 'auto' : 'none',
    };
  });

  return (
    <>
      <Animated.View
        animatedProps={rBackDropProps}
        onTouchStart={() => {
          scrollTo(0);
        }}
        style={[
          { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
          rBackDropStyle,
        ]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, reanimatedBottomSheetStyle]}>
          <View style={styles.line} />
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
});
export default BottomSheet;
const styles = StyleSheet.create({
  bottomSheetContainer: {
    width: '100%',
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.light,
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 40,
    height: 4,
    borderRadius: 100,
    backgroundColor: COLORS.gray[400],
    alignSelf: 'center',
    marginVertical: 16,
  },
});

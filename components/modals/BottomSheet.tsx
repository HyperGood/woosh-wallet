import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  Layout,
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
  maxHeight?: number;
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  open: () => void;
  isActive: () => boolean;
  close: () => void;
};

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, maxHeight = SCREEN_HEIGHT }, ref) => {
    const translateY = useSharedValue(maxHeight);

    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== maxHeight;
      translateY.value = withSpring(destination, {
        mass: 0.4,
        damping: 20,
      });
    }, []);

    const close = useCallback(() => {
      'worklet';
      return scrollTo(maxHeight);
    }, [maxHeight, scrollTo]);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          'worklet';
          scrollTo(0);
        },
        scrollTo,
        isActive,
        close,
      }),
      [scrollTo, isActive, close]
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
      .onEnd((event) => {
        if (event.translationY > 100) {
          // Close the Action Tray when the user swipes down
          close();
        } else {
          // Restore to the previous position if the users doesn't swipe down enough
          scrollTo(context.value.y);
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
          onTouchStart={close}
          style={[
            { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
            rBackDropStyle,
          ]}
        />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.bottomSheetContainer, reanimatedBottomSheetStyle]}>
            <View style={styles.line} />
            <Animated.View layout={Layout} entering={FadeIn} exiting={FadeOut}>
              {children}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);
export default BottomSheet;
const styles = StyleSheet.create({
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: COLORS.gray[800],
    position: 'absolute',
    borderRadius: 25,
    bottom: 30,
    borderCurve: 'continuous',
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

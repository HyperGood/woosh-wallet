/**
 * BottomSheet Component
 *
 * A reusable component for creating a bottom sheet in the project.
 * It provides functionality for three main use cases: opening, closing,
 * and scrolling the bottom sheet, along with gesture-based interaction
 * for dragging the sheet up and down.
 * All of this powered by the reanimated library.
 *
 * @param props - The props for the BottomSheet component.
 * @param props.children - The content to be rendered within the bottom sheet. By default it takes the screen height.
 * @param props.maxHeight - The maximum height of the bottom sheet when fully expanded.
 * 
 * @returns A React component representing the BottomSheet.
 * 
 * How to use it:
 * - Import the component.
 * - Wrap the component around the content you want to display in the bottom sheet.
 * - Pass the ref prop to get access to the methods, this prop needs to be declared using "useRef" React hook.
 * - Pass the maxHeight prop to set the maximum height of the bottom sheet using a number.
 * - Use the scrollTo method to scroll the bottom sheet to a specific position.
 * - Use the open method to open the bottom sheet.
 * - Use the close method to close the bottom sheet.
 * - Use the isActive method to check if the bottom sheet is open or closed.
 * - Use the getHeight method to get the current height of the bottom sheet.
 * 
 * @example
 * 
 * Methods usage:
 * 
 * const bottomSheetRef = useRef<BottomSheetRefProps>(null);
 * bottomSheetRef.current?.scrollTo(100);
 * bottomSheetRef.current?.open();
 * bottomSheetRef.current?.close();
 * bottomSheetRef.current?.isActive();
 * bottomSheetRef.current?.getHeight();
 * const content...
 * 
 * Component usage:
 * 
 * <BottomSheet ref={bottomSheetRef}>{content}</BottomSheet>
 *
 */
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, View, Keyboard } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  Layout,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/global-styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

type BottomSheetProps = {
  children?: React.ReactNode;
  maxHeight?: number;
  colorMode?: 'light' | 'dark';
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  open: () => void;
  isActive: () => boolean;
  close: () => void;
  getHeight: () => number;
};

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, maxHeight = SCREEN_HEIGHT, colorMode = 'dark' }, ref) => {
    //Define shared values for reanimated
    const translateY = useSharedValue(maxHeight);
    const active = useSharedValue(false);
    const height = useSharedValue(0);

    //This function scrolls the bottom sheet to the given destination
    const scrollTo = useCallback((destination: number) => {
      'worklet';
      //Active value is used to determine if the bottom sheet is open or closed
      //If the destination is not the max height, the bottom sheet is open
      // 0 = to the top of the screen & maxHeight = to the bottom of the screen (closed)
      active.value = destination !== maxHeight;
      //Animate the bottom sheet to the given destination
      translateY.value = withSpring(destination, {
        mass: 0.4,
        damping: 12,
      });
    }, []);

    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };

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
        getHeight: () => height.value,
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
        'worklet';
        if (event.translationY > 100) {
          // Close the Action Tray when the user swipes down
          close();
          runOnJS(dismissKeyboard)();
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

    const bottomSheetColor = colorMode === 'light' ? COLORS.light : COLORS.gray[800];

    return (
      <>
        <Animated.View
          animatedProps={rBackDropProps}
          onTouchStart={close}
          style={[
            {
              height: SCREEN_HEIGHT,
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
            rBackDropStyle,
          ]}
        />
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              { backgroundColor: bottomSheetColor },
              reanimatedBottomSheetStyle,
            ]}
            onLayout={(evt) => {
              height.value = evt.nativeEvent.layout.height;
            }}>
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
    bottom: 0,
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

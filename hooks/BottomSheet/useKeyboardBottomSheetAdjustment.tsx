import { useCallback } from 'react';
import { Keyboard, Dimensions } from 'react-native';

import { BottomSheetRefProps } from '../../components/modals/BottomSheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useKeyboardBottomSheetAdjustment = (
  addContactRef: React.RefObject<BottomSheetRefProps>
) => {
  const keyboardBottomSheetAdjustment = useCallback(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      const isActive = addContactRef.current?.isActive();
      const MAX_VALUE = SCREEN_HEIGHT * 0.88;
      const bottomSheetHeight = addContactRef.current?.getHeight()!;
      const scrollValue = bottomSheetHeight === MAX_VALUE ? 0 : -(MAX_VALUE - bottomSheetHeight);

      if (isActive) addContactRef.current?.scrollTo(scrollValue);
    });

    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      const isActive = addContactRef.current?.isActive();
      if (isActive) {
        addContactRef.current?.scrollTo(0);
      }
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [addContactRef]);

  return { keyboardBottomSheetAdjustment };
};

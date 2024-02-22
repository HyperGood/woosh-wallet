import { useCallback } from 'react';

import { BottomSheetRefProps } from '../../components/modals/BottomSheet';

export const useToggleBottomSheet = (
  addContactRef: React.RefObject<BottomSheetRefProps>,
  isActionTrayOpened: { value: boolean },
  close: () => void
) => {
  const toggleBottomSheet = useCallback(() => {
    const isActive = addContactRef.current?.isActive() ?? false;
    isActionTrayOpened.value = !isActive;
    isActive ? close() : addContactRef.current?.open();
  }, [addContactRef, close, isActionTrayOpened]);

  return toggleBottomSheet;
};

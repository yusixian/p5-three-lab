import { useLayoutEffect, useRef } from 'react';

type VisibleHookCallBacks = {
  onDestroy?: () => void;
  onVisible?: () => void;
  onHide?: () => void;
};

export const useGLActive = (
  visible: boolean,
  effectFun: () => VisibleHookCallBacks | undefined,
) => {
  const callbacksRef = useRef<VisibleHookCallBacks | undefined>(undefined);
  const isVisibleRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    // Initialize callbacks
    callbacksRef.current = effectFun();

    return () => {
      // Only call onHide if currently visible
      if (isVisibleRef.current) {
        callbacksRef.current?.onHide?.();
      }
      // Always call onDestroy on cleanup
      callbacksRef.current?.onDestroy?.();
      // Reset state
      isVisibleRef.current = false;
    };
  }, [effectFun]);

  useLayoutEffect(() => {
    if (!visible) {
      // If becoming invisible and was previously visible
      if (isVisibleRef.current) {
        callbacksRef.current?.onHide?.();
        isVisibleRef.current = false;
      }
      return;
    }

    // If becoming visible and wasn't previously visible
    if (!isVisibleRef.current) {
      callbacksRef.current?.onVisible?.();
      isVisibleRef.current = true;
    }

    return () => {
      // Cleanup when visible effect is destroyed
      if (isVisibleRef.current) {
        callbacksRef.current?.onHide?.();
        isVisibleRef.current = false;
      }
    };
  }, [visible]);
};

import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error';

export function useToast() {
  const [toastType, setToastType] = useState<ToastType | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (toastType) {
      timer = setTimeout(() => {
        setToastType(null);
      }, 10000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [toastType]);

  return {
    showToast: (toastType: ToastType) => {
      setToastType(toastType);
    },
    toastType: toastType,
  };
}

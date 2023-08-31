import { useEffect } from 'react';

export const useInterval = (callback: () => void, delay: number) => {
  useEffect(() => {
    //initil call
    callback();

    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
};

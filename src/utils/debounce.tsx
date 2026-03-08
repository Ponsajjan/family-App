import { useRef } from "react";

type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

export const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> => {
  const debounceRef = useRef<number | null>(null);

  const debouncedFunc = (...args: Parameters<T>): void => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      func(...args);
    }, delay);
  };

  debouncedFunc.cancel = () => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  return debouncedFunc;
};

"use client";

import {useEffect, useState} from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): {
  value: T;
  setValue: (value: T | ((val: T) => T)) => void;
  remove: () => void;
} => {
  const readValue = (): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // storage 이벤트 및 커스텀 이벤트 구독
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncValue = () => setStoredValue(readValue());

    // 다른 탭에서 변경 감지
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) syncValue();
    };
    window.addEventListener("storage", onStorage);

    // 같은 탭 내 커스텀 이벤트 감지
    window.addEventListener(`local-storage-${key}`, syncValue);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(`local-storage-${key}`, syncValue);
    };
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event(`local-storage-${key}`));
      }
    } catch (error) {
      // do nothing
    }
  };

  const remove = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new Event(`local-storage-${key}`));
      }
      setStoredValue(initialValue);
    } catch (error) {
      // Ignore remove errors
    }
  };

  return {value: storedValue, setValue, remove} as const;
};

export default useLocalStorage;

// src/hooks/useLocalStorage.js
import { useState, useEffect, useCallback } from 'react'; // Added useCallback

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”:", error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      if (value instanceof Function) {
        setStoredValue(prevStoredValue => {
          const newValue = value(prevStoredValue); 
          window.localStorage.setItem(key, JSON.stringify(newValue));
          return newValue; 
        });
      } else {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error setting localStorage key “" + key + "”:", error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
            console.error("Error parsing storage change for key “" + key + "”:", error);
            setStoredValue(initialValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
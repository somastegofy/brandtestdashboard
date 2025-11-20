import { useState, useCallback, useEffect, useRef } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T), skipHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

const STORAGE_KEY_PREFIX = 'studio_history_';
const MAX_HISTORY_SIZE = 50;

export function useHistory<T>(
  initialState: T,
  storageKey?: string
): UseHistoryReturn<T> {
  const fullStorageKey = storageKey ? `${STORAGE_KEY_PREFIX}${storageKey}` : null;

  const loadFromStorage = (): HistoryState<T> => {
    if (!fullStorageKey) {
      return {
        past: [],
        present: initialState,
        future: [],
      };
    }

    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          past: parsed.past || [],
          present: parsed.present || initialState,
          future: parsed.future || [],
        };
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
    }

    return {
      past: [],
      present: initialState,
      future: [],
    };
  };

  const [history, setHistory] = useState<HistoryState<T>>(loadFromStorage);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (fullStorageKey) {
      try {
        const toStore = {
          past: history.past.slice(-MAX_HISTORY_SIZE),
          present: history.present,
          future: history.future.slice(0, MAX_HISTORY_SIZE),
        };
        localStorage.setItem(fullStorageKey, JSON.stringify(toStore));
      } catch (error) {
        console.error('Failed to save history to storage:', error);
      }
    }
  }, [history, fullStorageKey]);

  const setState = useCallback((newState: T | ((prev: T) => T), skipHistory = false) => {
    setHistory((currentHistory) => {
      const resolvedNewState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(currentHistory.present)
        : newState;

      if (skipHistory) {
        return {
          ...currentHistory,
          present: resolvedNewState,
        };
      }

      const newPast = [...currentHistory.past, currentHistory.present].slice(-MAX_HISTORY_SIZE);

      return {
        past: newPast,
        present: resolvedNewState,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((currentHistory) => {
      if (currentHistory.past.length === 0) {
        return currentHistory;
      }

      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);
      const newFuture = [currentHistory.present, ...currentHistory.future].slice(0, MAX_HISTORY_SIZE);

      return {
        past: newPast,
        present: previous,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => {
      if (currentHistory.future.length === 0) {
        return currentHistory;
      }

      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);
      const newPast = [...currentHistory.past, currentHistory.present].slice(-MAX_HISTORY_SIZE);

      return {
        past: newPast,
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: history.present,
      future: [],
    });

    if (fullStorageKey) {
      try {
        localStorage.removeItem(fullStorageKey);
      } catch (error) {
        console.error('Failed to clear history from storage:', error);
      }
    }
  }, [history.present, fullStorageKey]);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clearHistory,
  };
}

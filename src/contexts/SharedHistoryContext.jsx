/**
 * Shared History Context
 * Manages shared undo/redo history across multiple editors
 */

import React, { createContext, useContext, useMemo } from 'react';
import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';

const Context = createContext({});

export function SharedHistoryContext({ children }) {
  const historyState = useMemo(() => createEmptyHistoryState(), []);
  
  return (
    <Context.Provider value={{ historyState }}>
      {children}
    </Context.Provider>
  );
}

export function useSharedHistoryContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSharedHistoryContext must be used within SharedHistoryContext');
  }
  return context;
}

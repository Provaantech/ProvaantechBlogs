/**
 * Settings Context for Lexical Playground
 * Manages feature toggles and editor settings
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const DEFAULT_SETTINGS = {
  // Editor features
  isRichText: true,
  isCollab: false,
  emptyEditor: false,
  measureTypingPerf: false,
  
  // Plugin features
  isMaxLength: false,
  isCharLimit: false,
  isCharLimitUtf8: false,
  hasLinkAttributes: false,
  isAutocomplete: false,
  isCodeHighlighted: true,
  
  // UI features
  showTreeView: true,
  treeViewPosition: 'right', // 'right', 'bottom', 'modal'
  showTableOfContents: false,
  showNestedEditorTreeView: false,
  shouldUseLexicalContextMenu: false,
  shouldPreserveNewLinesInMarkdown: false,
  shouldAllowHighlightingWithBrackets: false,
  selectionAlwaysOnDisplay: false,
  
  // Table features
  tableCellMerge: true,
  tableCellBackgroundColor: true,
  tableHorizontalScroll: true,
  
  // List features
  listStrictIndent: false,
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  setOption: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const setOption = useCallback((name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setOption }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;

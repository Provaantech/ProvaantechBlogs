/**
 * Settings Panel Component
 * Provides toggles for all playground features
 */

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import Toast from './Toast';

function Switch({ onClick, checked, text }) {
  return (
    <div className="setting-item">
      <label className="switch-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onClick()}
          className="switch-input"
        />
        <span className="switch-slider"></span>
        <span className="switch-text">{text}</span>
      </label>
    </div>
  );
}

function Select({ value, onChange, options, text }) {
  return (
    <div className="setting-item">
      <label className="select-label">
        <span className="select-text">{text}</span>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="select-input"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function Settings() {
  const { settings, setOption } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
  
  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const {
    measureTypingPerf,
    isCollab,
    isRichText,
    isMaxLength,
    hasLinkAttributes,
    isCharLimit,
    isCharLimitUtf8,
    isAutocomplete,
    showTreeView,
    treeViewPosition,
    showNestedEditorTreeView,
    showTableOfContents,
    shouldUseLexicalContextMenu,
    shouldPreserveNewLinesInMarkdown,
    shouldAllowHighlightingWithBrackets,
    selectionAlwaysOnDisplay,
    isCodeHighlighted,
  } = settings;

  return (
    <>
      <button
        id="options-button"
        className={`settings-button ${showSettings ? 'active' : ''}`}
        onClick={() => setShowSettings(!showSettings)}
        title="Settings"
      >
        ⚙️
      </button>
      
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>Editor Settings</h3>
            <button 
              className="settings-close"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
          </div>
          
          <div className="settings-content">
            <div className="settings-section">
              <h4>Editor Features</h4>
              <Switch
                onClick={() => setOption('measureTypingPerf', !measureTypingPerf)}
                checked={measureTypingPerf}
                text="Measure Performance"
              />
              <Switch
                onClick={() => setOption('showTreeView', !showTreeView)}
                checked={showTreeView}
                text="Debug View"
              />
              {showTreeView && (
                <Select
                  value={treeViewPosition}
                  onChange={(value) => {
                    setOption('treeViewPosition', value);
                    const positionNames = {
                      'right': 'Right Panel',
                      'bottom': 'Bottom Dock',
                      'modal': 'Modal Overlay'
                    };
                    showToast(`Debug view moved to ${positionNames[value]}`);
                    // Auto-close settings panel after position change
                    setTimeout(() => setShowSettings(false), 500);
                  }}
                  options={[
                    { value: 'right', label: '📋 Right Panel' },
                    { value: 'bottom', label: '⬇️ Bottom Dock' },
                    { value: 'modal', label: '🪟 Modal Overlay' }
                  ]}
                  text="Debug Position"
                />
              )}
              <Switch
                onClick={() => setOption('showNestedEditorTreeView', !showNestedEditorTreeView)}
                checked={showNestedEditorTreeView}
                text="Nested Editors Debug View"
              />
              <Switch
                onClick={() => {
                  setOption('isRichText', !isRichText);
                  setOption('isCollab', false);
                }}
                checked={isRichText}
                text="Rich Text"
              />
            </div>

            <div className="settings-section">
              <h4>Text Features</h4>
              <Switch
                onClick={() => setOption('isCharLimit', !isCharLimit)}
                checked={isCharLimit}
                text="Character Limit"
              />
              <Switch
                onClick={() => setOption('isCharLimitUtf8', !isCharLimitUtf8)}
                checked={isCharLimitUtf8}
                text="Character Limit (UTF-8)"
              />
              <Switch
                onClick={() => setOption('hasLinkAttributes', !hasLinkAttributes)}
                checked={hasLinkAttributes}
                text="Link Attributes"
              />
              <Switch
                onClick={() => setOption('isMaxLength', !isMaxLength)}
                checked={isMaxLength}
                text="Max Length"
              />
              <Switch
                onClick={() => setOption('isAutocomplete', !isAutocomplete)}
                checked={isAutocomplete}
                text="Autocomplete"
              />
            </div>

            <div className="settings-section">
              <h4>UI Features</h4>
              <Switch
                onClick={() => setOption('showTableOfContents', !showTableOfContents)}
                checked={showTableOfContents}
                text="Table Of Contents"
              />
              <Switch
                onClick={() => setOption('shouldUseLexicalContextMenu', !shouldUseLexicalContextMenu)}
                checked={shouldUseLexicalContextMenu}
                text="Use Lexical Context Menu"
              />
              <Switch
                onClick={() => setOption('shouldPreserveNewLinesInMarkdown', !shouldPreserveNewLinesInMarkdown)}
                checked={shouldPreserveNewLinesInMarkdown}
                text="Preserve newlines in Markdown"
              />
              <Switch
                onClick={() => setOption('shouldAllowHighlightingWithBrackets', !shouldAllowHighlightingWithBrackets)}
                checked={shouldAllowHighlightingWithBrackets}
                text="Use Brackets for Highlighting"
              />
              <Switch
                onClick={() => setOption('selectionAlwaysOnDisplay', !selectionAlwaysOnDisplay)}
                checked={selectionAlwaysOnDisplay}
                text="Retain Selection"
              />
              <Switch
                onClick={() => setOption('isCodeHighlighted', !isCodeHighlighted)}
                checked={isCodeHighlighted}
                text="Code Highlighting"
              />
            </div>
          </div>
        </div>
      )}
      
      <Toast 
        message={toast.message}
        isVisible={toast.show}
        onClose={hideToast}
        type={toast.type}
      />
    </>
  );
}

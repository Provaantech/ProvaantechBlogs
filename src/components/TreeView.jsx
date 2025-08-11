/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView as LexicalTreeView } from '@lexical/react/LexicalTreeView';
import * as React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function TreeView() {
  const [editor] = useLexicalComposerContext();
  const { settings, setOption } = useSettings();
  const { treeViewPosition } = settings;
  
  const handleClose = () => {
    setOption('showTreeView', false);
  };
  
  const wrapperClass = `tree-view-wrapper position-${treeViewPosition}`;
  
  if (treeViewPosition === 'modal') {
    return (
      <>
        <div className="tree-view-modal-backdrop" onClick={handleClose} />
        <div className={wrapperClass}>
          <div className="tree-view-header">
            <div>
              <h3>Editor State Tree</h3>
              <p>Live view of the editor's internal state</p>
            </div>
            <button className="tree-view-close" onClick={handleClose}>
              ×
            </button>
          </div>
          <div className="tree-view-content">
            <LexicalTreeView
              viewClassName="tree-view-output"
              timeTravelPanelClassName="debug-timetravel-panel"
              timeTravelButtonClassName="debug-timetravel-button"
              timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
              timeTravelPanelButtonClassName="debug-timetravel-panel-button"
              editor={editor}
            />
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className={wrapperClass}>
      <div className="tree-view-header">
        <div>
          <h3>Editor State Tree</h3>
          <p>Live view of the editor's internal state</p>
        </div>
        {treeViewPosition === 'bottom' && (
          <button className="tree-view-close" onClick={handleClose}>
            ×
          </button>
        )}
      </div>
      <div className="tree-view-content">
        <LexicalTreeView
          viewClassName="tree-view-output"
          timeTravelPanelClassName="debug-timetravel-panel"
          timeTravelButtonClassName="debug-timetravel-button"
          timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
          timeTravelPanelButtonClassName="debug-timetravel-panel-button"
          editor={editor}
        />
      </div>
    </div>
  );
}

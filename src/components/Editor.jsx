/**
 * Complete Lexical Editor Component — UPDATED
 * Adds Equation, Excalidraw, Poll and Emoji node registration + plugin components
 * while preserving all original functionality.
 */

import React, { useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer'; 
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';

import EditorTheme from '../themes/EditorTheme';
import EditorNodes from '../constants/EditorNodes';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import ComponentPickerPlugin from '../plugins/ComponentPickerPlugin';
import ImagesPlugin from '../plugins/ImagesPlugin';
import FloatingTextFormatToolbarPlugin from '../plugins/FloatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin';
import MentionsPlugin from '../plugins/MentionsPlugin';
import EmojiPlugin from '../plugins/EmojiPlugin';
import EmojisPlugin from '../plugins/EmojisPlugin';
import EmojiPickerPlugin from '../plugins/EmojiPickerPlugin';
import ActionsPlugin from '../plugins/ActionsPlugin';
import TreeView from './TreeView';
import { useSettings } from '../contexts/SettingsContext';

/* --- NEW imports: nodes + plugin components --- */
/* Make sure these files exist at the paths shown (I'll include short implementations below). */
import { EmojiNode } from '../nodes/EmojiNode';
import { EquationNode } from '../nodes/EquationNode';
import { ExcalidrawNode } from '../nodes/ExcalidrawNode';
import { PollNode } from '../nodes/PollNode';

import EquationPlugin from '../plugins/EquationPlugin';
import ExcalidrawPlugin from '../plugins/ExcalidrawPlugin';
import PollPlugin from '../plugins/PollPlugin';
/* --- end new imports --- */

// URL matchers for auto-linking
const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
    };
  },
];

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export default function Editor() {
  const { settings } = useSettings();
  const { showTreeView, treeViewPosition } = settings;
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  
  // Add bottom margin when tree view is in bottom position 
  const containerStyle = showTreeView && treeViewPosition === 'bottom' 
    ? { marginBottom: '40vh' }
    : {};
    
  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  
  // --- IMPORTANT: extend existing EditorNodes non-destructively ---
  // EditorNodes is the array your project already uses. We append extra nodes
  // so existing nodes are kept intact.
  const initialConfig = {
    namespace: 'MyEditor',
    theme: EditorTheme,
    nodes: [
      ...EditorNodes,
      // new nodes appended — if any are already inside EditorNodes this is harmless
      EmojiNode,
      EquationNode,
      ExcalidrawNode,
      PollNode,
    ],
    onError(error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container" style={containerStyle}>
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="editor-input" />
                </div>
              </div>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ComponentPickerPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <TablePlugin />
          <HashtagPlugin />
          <ImagesPlugin captionsEnabled={true} />
          <MentionsPlugin />
          <EmojiPlugin />
          <EmojisPlugin />
          <EmojiPickerPlugin />

          {/* --- NEW plugin components added below (non-destructive) --- */}
          <EquationPlugin />
          <ExcalidrawPlugin />
          <PollPlugin />
          {/* --- end new plugin components --- */}

          <ActionsPlugin />
          {floatingAnchorElem && (
            <>
              <FloatingTextFormatToolbarPlugin
                anchorElem={floatingAnchorElem}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            </>
          )}
        </div>
      </div>
      {settings.showTreeView && <TreeView />}
    </LexicalComposer>
  );
}

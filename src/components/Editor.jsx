/**
 * Complete Lexical Editor Component
 * Full functionality JavaScript version
 */

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
// import { CodeHighlightPlugin } from '@lexical/react/LexicalCodeHighlightPlugin';
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
import { useState, useRef } from 'react';


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
  
  const initialConfig = {
    namespace: 'MyEditor',
    theme: EditorTheme,
    nodes: EditorNodes,
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

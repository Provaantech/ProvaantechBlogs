/**
 * Toolbar Context
 * Manages toolbar state and formatting options
 */

import React, { createContext, useContext, useCallback, useState } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isListNode, ListNode } from '@lexical/list';
import { $isCodeNode } from '@lexical/code';
import { $isQuoteNode } from '@lexical/rich-text';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $isLinkNode } from '@lexical/link';
import { $isParentElementRTL } from '@lexical/selection';

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const ToolbarContext = createContext({});

export function ToolbarProvider({ children }) {
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [fontSize, setFontSize] = useState('15px');
  const [fontColor, setFontColor] = useState('#000');
  const [bgColor, setBgColor] = useState('#fff');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [elementFormat, setElementFormat] = useState('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, setModal] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [canUndoInReview, setCanUndoInReview] = useState(false);
  const [canRedoInReview, setCanRedoInReview] = useState(false);

  const updateToolbar = useCallback((editor) => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        let element =
          anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);
        
        setSelectedElementKey(elementKey);
        
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type);
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage();
            setCodeLanguage(language ? language : '');
            return;
          }
        }

        // Update text format
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsSubscript(selection.hasFormat('subscript'));
        setIsSuperscript(selection.hasFormat('superscript'));
        setIsCode(selection.hasFormat('code'));
        setIsRTL($isParentElementRTL(selection));

        // Update links
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent) || $isLinkNode(node)) {
          setIsLink(true);
        } else {
          setIsLink(false);
        }
      }
    });
  }, []);

  return (
    <ToolbarContext.Provider
      value={{
        blockType,
        setBlockType,
        selectedElementKey,
        setSelectedElementKey,
        fontSize,
        setFontSize,
        fontColor,
        setFontColor,
        bgColor,
        setBgColor,
        fontFamily,
        setFontFamily,
        elementFormat,
        setElementFormat,
        isLink,
        setIsLink,
        isBold,
        setIsBold,
        isItalic,
        setIsItalic,
        isUnderline,
        setIsUnderline,
        isStrikethrough,
        setIsStrikethrough,
        isSubscript,
        setIsSubscript,
        isSuperscript,
        setIsSuperscript,
        isCode,
        setIsCode,
        canUndo,
        setCanUndo,
        canRedo,
        setCanRedo,
        modal,
        setModal,
        isRTL,
        setIsRTL,
        codeLanguage,
        setCodeLanguage,
        canUndoInReview,
        setCanUndoInReview,
        canRedoInReview,
        setCanRedoInReview,
        updateToolbar,
      }}
    >
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbarState(editor) {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error('useToolbarState must be used within ToolbarProvider');
  }
  return context;
}

// Helper function
function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function $isAtNodeEnd(point) {
  if (point.type === 'text') {
    return point.offset === point.getNode().getTextContentSize();
  }
  return point.offset === point.getNode().getChildrenSize();
}

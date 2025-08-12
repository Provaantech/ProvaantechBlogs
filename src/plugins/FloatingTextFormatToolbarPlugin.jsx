/**
 * Floating Text Format Toolbar Plugin
 * Context-aware formatting toolbar that appears on text selection
 */

import { $isCodeHighlightNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { getDOMRangeRect } from '../utils/getDOMRangeRect';
import { setFloatingElemPosition } from '../utils/setFloatingElemPosition';

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
}) {
  const popupCharStylesEditorRef = useRef(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div ref={popupCharStylesEditorRef} className="floating-text-format-popup">
      <button
        type="button"
        className={`popup-item spaced ${isBold ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isItalic ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isUnderline ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isStrikethrough ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isSubscript ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        aria-label="Format Subscript"
      >
        <i className="format subscript" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isSuperscript ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        aria-label="Format Superscript"
      >
        <i className="format superscript" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isCode ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        aria-label="Insert Code"
      >
        <i className="format code" />
      </button>
      <button
        type="button"
        className={`popup-item spaced ${isLink ? 'active' : ''}`}
        onClick={insertLink}
        aria-label="Insert Link"
      >
        <i className="format link" />
      </button>
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor,
  anchorElem,
  setIsLinkEditMode,
) {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not show the popup if the editor is not in focus or readonly
      if (editor.isComposing() || editor.getRootElement() !== document.activeElement) {
        setIsText(false);
        return;
      }

      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update links
      if ($isLinkNode(node.getParent()) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node) || $isParagraphNode(node));
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsSubscript(selection.hasFormat('subscript'));
        setIsSuperscript(selection.hasFormat('superscript'));
        setIsCode(selection.hasFormat('code'));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isCode={isCode}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
    />,
    anchorElem,
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
  setIsLinkEditMode,
}) {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode);
}

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

function $isParagraphNode(node) {
  return node.getType() === 'paragraph';
}

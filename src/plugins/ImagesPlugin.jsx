/**
 * Images Plugin
 * Handles image insertion via URL or file upload with drag and drop support
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
} from 'lexical';
import { useEffect } from 'react';
import * as React from 'react';

import { $createImageNode, $isImageNode, ImageNode } from '../nodes/ImageNode';

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageUriDialogBody({
  onClick,
}) {
  const [src, setSrc] = React.useState('');
  const [altText, setAltText] = React.useState('');

  const isDisabled = src === '';

  return (
    <>
      <div className="Input__wrapper">
        <label className="Input__label">Image URL</label>
        <input
          className="Input__input"
          placeholder="i.e. https://source.unsplash.com/random"
          onChange={(e) => setSrc(e.target.value)}
          value={src}
          data-test-id="image-modal-url-input"
        />
      </div>
      <div className="Input__wrapper">
        <label className="Input__label">Alt Text</label>
        <input
          className="Input__input"
          placeholder="Random unsplash image"
          onChange={(e) => setAltText(e.target.value)}
          value={altText}
          data-test-id="image-modal-alt-text-input"
        />
      </div>
      <div className="Dialog__actions">
        <button
          className="Button"
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          Confirm
        </button>
      </div>
    </>
  );
}

export function InsertImageUploadedDialogBody({
  onClick,
}) {
  const [src, setSrc] = React.useState('');
  const [altText, setAltText] = React.useState('');

  const isDisabled = src === '';

  const loadImage = (files) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    if (files !== null && files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <>
      <div className="Input__wrapper">
        <label className="Input__label">Image Upload</label>
        <input
          type="file"
          className="Input__input"
          onChange={(e) => loadImage(e.target.files)}
          accept="image/*"
          data-test-id="image-modal-file-upload"
        />
      </div>
      <div className="Input__wrapper">
        <label className="Input__label">Alt Text</label>
        <input
          className="Input__input"
          placeholder="Descriptive alternative text"
          onChange={(e) => setAltText(e.target.value)}
          value={altText}
          data-test-id="image-modal-alt-text-input"
        />
      </div>
      <div className="Dialog__actions">
        <button
          className="Button"
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          Confirm
        </button>
      </div>
    </>
  );
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}) {
  const [mode, setMode] = React.useState(null);
  const hasModifier = React.useRef(false);

  React.useEffect(() => {
    hasModifier.current = false;
    const handler = (e) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const onClick = (payload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      {!mode && (
        <div className="Dialog__buttons">
          <button
            className="Button"
            data-test-id="image-modal-option-sample"
            onClick={() =>
              onClick(
                hasModifier.current
                  ? {
                      altText:
                        'Daylight fir trees forest glacier green high ice landscape',
                      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
                    }
                  : {
                      altText: 'Yellow flower in tilt shift lens',
                      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                    },
              )
            }>
            Sample
          </button>
          <button
            className="Button"
            data-test-id="image-modal-option-url"
            onClick={() => setMode('url')}>
            URL
          </button>
          <button
            className="Button"
            data-test-id="image-modal-option-file"
            onClick={() => setMode('file')}>
            File
          </button>
        </div>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode({
            ...payload,
            captionsEnabled: captionsEnabled,
          });
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [captionsEnabled, editor]);

  return null;
}

function onDragStart(event) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(TRANSPARENT_IMAGE, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );

  return true;
}

function onDragover(event) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function onDrop(event, editor) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event) {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== 'image') {
    return null;
  }

  return data;
}

function canDropImage(event) {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor-image') &&
    target.parentElement &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

function getDragSelection(event) {
  let range;
  const target = event.target;
  const targetWindow =
    target == null ? null : target.nodeType === 9 ? target.defaultView : target.ownerDocument.defaultView;
  const domSelection = targetWindow?.getSelection();
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}

// Transparent image for drag preview
const TRANSPARENT_IMAGE = document.createElement('img');
TRANSPARENT_IMAGE.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

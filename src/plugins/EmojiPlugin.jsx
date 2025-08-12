/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '😍', '🤩', '😘', '😗', '😚', '😙', '😋',
  '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔',
  '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭',
  '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐',
  '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴',
  '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒',
  '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
  '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻',
  '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋', '🖖',
  '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
  '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏',
  '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾',
  '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷',
  '🦴', '👀', '👁', '👅', '👄', '💋', '🩸', '🌍', '🌎', '🌏',
  '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '⭐', '🌟',
  '💫', '✨', '⚡', '☄️', '💥', '🔥', '🌪', '🌈', '☀️', '🌤',
  '⛅', '🌥', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️',
  '⛄', '🌬', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫'
];

export const INSERT_EMOJI_COMMAND = createCommand('INSERT_EMOJI_COMMAND');

function EmojiPicker({ editor, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmojis = useMemo(() => {
    if (!searchTerm) return EMOJI_LIST;
    return EMOJI_LIST.filter((emoji) =>
      // Simple emoji filtering - in a real app you'd want emoji names/descriptions
      emoji.includes(searchTerm)
    );
  }, [searchTerm]);

  const insertEmoji = useCallback(
    (emoji) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([$createTextNode(emoji)]);
        }
      });
      onClose();
    },
    [editor, onClose]
  );

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="emoji-search"
        />
        <button onClick={onClose} className="emoji-picker-close">
          ×
        </button>
      </div>
      <div className="emoji-grid">
        {filteredEmojis.map((emoji, index) => (
          <button
            key={index}
            className="emoji-item"
            onClick={() => insertEmoji(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EmojiPlugin() {
  const [editor] = useLexicalComposerContext();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      INSERT_EMOJI_COMMAND,
      () => {
        setShowPicker(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
  }, []);

  return showPicker
    ? createPortal(
        <>
          <div className="emoji-picker-overlay" onClick={handleClosePicker} />
          <EmojiPicker editor={editor} onClose={handleClosePicker} />
        </>,
        document.body
      )
    : null;
}

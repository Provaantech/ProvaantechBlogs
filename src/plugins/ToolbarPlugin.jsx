/**
 * Complete Toolbar Plugin
 * Full functionality toolbar with all formatting options
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
  $patchStyleText,
} from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $createHeadingNode, $isHeadingNode, $createQuoteNode, $isQuoteNode } from '@lexical/rich-text';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from '@lexical/code';
import {
  INSERT_TABLE_COMMAND,
  $isTableNode,
} from '@lexical/table';
import { INSERT_IMAGE_COMMAND, InsertImageDialog } from './ImagesPlugin';
import { INSERT_EMOJI_COMMAND } from './EmojiPlugin';
import { useActionsPlugin } from './ActionsPlugin';
import { getSelectedNode } from '../utils/getSelectedNode';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('14px');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFF00');
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Use the ActionsPlugin hook
  const { openActionsModal, ActionsModal } = useActionsPlugin();

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsRTL($isParentElementRTL(selection));

      // Check for highlight format
      setIsHighlight(selection.hasFormat('highlight'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode(codeLanguage || getDefaultCodeLanguage()));
        }
      });
    }
  };

  const handleCodeLanguageChange = (language) => {
    setCodeLanguage(language);
    if (blockType === 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getTopLevelElementOrThrow();
          if ($isCodeNode(element)) {
            element.setLanguage(language);
          }
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' });
  };

  const insertHorizontalRule = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = $createHorizontalRuleNode();
        selection.insertNodes([node]);
      }
    });
  };

  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-family': family,
        });
      }
    });
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-size': size,
        });
      }
    });
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'color': color,
        });
      }
    });
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'background-color': color,
        });
      }
    });
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Clear all text formats
        const formats = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'highlight'];
        formats.forEach(format => {
          if (selection.hasFormat(format)) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
          }
        });
        
        // Clear all styles (font, colors, etc.)
        $patchStyleText(selection, {
          'font-family': '',
          'font-size': '',
          'color': '',
          'background-color': '',
        });
      }
    });
  };

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        className="toolbar-item spaced"
        title="Undo (Ctrl+Z)"
        aria-label="Undo">
        ↶
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        className="toolbar-item"
        title="Redo (Ctrl+Y)"
        aria-label="Redo">
        ↷
      </button>
      <Divider />
      
      {/* Block Type Selector */}
      <select
        className="toolbar-item block-controls"
        title="Change block type"
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'paragraph') formatParagraph();
          else if (value.startsWith('h')) formatHeading(value);
          else if (value === 'ul') formatBulletList();
          else if (value === 'ol') formatNumberedList();
          else if (value === 'code') formatCode();
          else if (value === 'quote') formatQuote();
        }}
        value={blockType}>
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="quote">Quote Block</option>
        <option value="ul">Bullet List</option>
        <option value="ol">Numbered List</option>
        <option value="code">Code Block</option>
      </select>
      
      {/* Code Language Selector - only show when code block is selected */}
      {blockType === 'code' && (
        <select
          className="toolbar-item code-language"
          title="Code Language"
          onChange={(e) => handleCodeLanguageChange(e.target.value)}
          value={codeLanguage}>
          {getCodeLanguages().map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      )}
      <Divider />
      
      {/* Font Family Selector */}
      <select
        className="toolbar-item font-family"
        title="Font Family"
        onChange={(e) => handleFontFamilyChange(e.target.value)}
        value={fontFamily}>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Verdana">Verdana</option>
        <option value="Georgia">Georgia</option>
        <option value="Palatino">Palatino</option>
        <option value="Garamond">Garamond</option>
        <option value="Bookman">Bookman</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Trebuchet MS">Trebuchet MS</option>
        <option value="Arial Black">Arial Black</option>
      </select>
      
      {/* Font Size Selector */}
      <select
        className="toolbar-item font-size"
        title="Font Size"
        onChange={(e) => handleFontSizeChange(e.target.value)}
        value={fontSize}>
        <option value="10px">10px</option>
        <option value="11px">11px</option>
        <option value="12px">12px</option>
        <option value="13px">13px</option>
        <option value="14px">14px</option>
        <option value="15px">15px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="22px">22px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
        <option value="36px">36px</option>
        <option value="48px">48px</option>
        <option value="72px">72px</option>
      </select>
      
      {/* Color Controls */}
      <input
        type="color"
        className="toolbar-item color-picker"
        title="Text Color"
        value={textColor}
        onChange={(e) => handleTextColorChange(e.target.value)}
      />
      <input
        type="color"
        className="toolbar-item color-picker"
        title="Background Color"
        value={backgroundColor}
        onChange={(e) => handleBackgroundColorChange(e.target.value)}
      />
      <Divider />
      
      {/* Text Formatting */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        title="Bold (Ctrl+B)"
        aria-label="Format Bold">
        <strong>B</strong>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        title="Italic (Ctrl+I)"
        aria-label="Format Italics">
        <em>I</em>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        title="Underline (Ctrl+U)"
        aria-label="Format Underline">
        <u>U</u>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        title="Strikethrough"
        aria-label="Format Strikethrough">
        <s>S</s>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
        title="Inline Code"
        aria-label="Insert Code">
        {'</>'}
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        className={'toolbar-item spaced ' + (isSubscript ? 'active' : '')}
        title="Subscript"
        aria-label="Format Subscript">
        X₂
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        className={'toolbar-item spaced ' + (isSuperscript ? 'active' : '')}
        title="Superscript"
        aria-label="Format Superscript">
        X²
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
        }}
        className={'toolbar-item spaced ' + (isHighlight ? 'active' : '')}
        title="Highlight Text"
        aria-label="Highlight Text">
        🖍️
      </button>
      <button
        onClick={insertLink}
        className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
        title="Insert/Edit Link"
        aria-label="Insert Link">
        🔗
      </button>
      
      {/* Clear Formatting */}
      <button
        onClick={clearFormatting}
        className="toolbar-item spaced"
        title="Clear Formatting"
        aria-label="Clear Formatting">
        🧹
      </button>
      <Divider />
      
      {/* Lists */}
      <button
        onClick={formatBulletList}
        className={'toolbar-item spaced ' + (blockType === 'ul' ? 'active' : '')}
        title="Bullet List"
        aria-label="Insert Unordered List">
        •
      </button>
      <button
        onClick={formatNumberedList}
        className={'toolbar-item spaced ' + (blockType === 'ol' ? 'active' : '')}
        title="Numbered List"
        aria-label="Insert Ordered List">
        1.
      </button>
      <Divider />
      
      {/* Alignment */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item spaced"
        title="Align Left"
        aria-label="Left Align">
        ⬅
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item spaced"
        title="Align Center"
        aria-label="Center Align">
        ⬌
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item spaced"
        title="Align Right"
        aria-label="Right Align">
        ➡
      </button>
      <Divider />
      
      {/* Table & Horizontal Rule */}
      <button
        onClick={insertTable}
        className="toolbar-item spaced"
        title="Insert Table (3x3)"
        aria-label="Insert Table">
        📋
      </button>
      <button
        onClick={insertHorizontalRule}
        className="toolbar-item spaced"
        title="Insert Horizontal Rule"
        aria-label="Insert Horizontal Rule">
        ━━━
      </button>
      <button
        onClick={() => setShowImageModal(true)}
        className="toolbar-item spaced"
        title="Insert Image"
        aria-label="Insert Image">
        🖼️
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(INSERT_EMOJI_COMMAND);
        }}
        className="toolbar-item spaced"
        title="Insert Emoji"
        aria-label="Insert Emoji">
        😀
      </button>
      
      <Divider />
      
      {/* Document Actions */}
      <button
        onClick={openActionsModal}
        className="toolbar-item"
        title="Document Actions - Export, Import, Clear"
        aria-label="Document Actions">
        📄
      </button>
      
      {/* Image Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Insert Image</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowImageModal(false)}
                title="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <InsertImageDialog
                activeEditor={editor}
                onClose={() => setShowImageModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Actions Modal */}
      {ActionsModal}
    </div>
  );
}

// Helper functions
function createParagraphNode() {
  return $createParagraphNode();
}

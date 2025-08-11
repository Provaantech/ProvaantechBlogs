/**
 * Component Picker Plugin
 * Provides slash (/) commands for inserting various elements
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createCodeNode } from '@lexical/code';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

class ComponentPickerOption extends MenuOption {
  constructor(title, options) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}) {
  let className = 'component-picker-item';
  if (isSelected) {
    className += ' selected';
  }
  
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      {option.icon && <span className="component-picker-icon">{option.icon}</span>}
      <div className="component-picker-content">
        <span className="component-picker-title">{option.title}</span>
        {option.keyboardShortcut && (
          <span className="component-picker-shortcut">{option.keyboardShortcut}</span>
        )}
      </div>
    </li>
  );
}

function getDynamicOptions(editor, queryString) {
  const options = [];

  if (queryString == null) {
    return options;
  }

  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: '📊',
            keywords: ['table'],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, {columns, rows}),
          }),
      ),
    );
  }

  return options;
}

function getBaseOptions(editor) {
  return [
    new ComponentPickerOption('Paragraph', {
      icon: '¶',
      keywords: ['normal', 'paragraph', 'p', 'text'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    new ComponentPickerOption('Heading 1', {
      icon: 'H1',
      keywords: ['heading', 'header', 'h1'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h1'));
          }
        }),
    }),
    new ComponentPickerOption('Heading 2', {
      icon: 'H2',
      keywords: ['heading', 'header', 'h2'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h2'));
          }
        }),
    }),
    new ComponentPickerOption('Heading 3', {
      icon: 'H3',
      keywords: ['heading', 'header', 'h3'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h3'));
          }
        }),
    }),
    new ComponentPickerOption('Bulleted List', {
      icon: '•',
      keywords: ['bulleted list', 'unordered list', 'ul'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Numbered List', {
      icon: '1.',
      keywords: ['numbered list', 'ordered list', 'ol'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Check List', {
      icon: '☑',
      keywords: ['check list', 'todo list'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Quote', {
      icon: '"',
      keywords: ['blockquote', 'quote'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption('Code Block', {
      icon: '</>', 
      keywords: ['code', 'code block'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createCodeNode());
          }
        }),
    }),
    new ComponentPickerOption('Horizontal Rule', {
      icon: '―',
      keywords: ['horizontal rule', 'divider', 'hr'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    new ComponentPickerOption('Table', {
      icon: '📊',
      keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: '3',
          rows: '3',
        }),
    }),
  ];
}

export default function ComponentPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor);
    
    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');
    
    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption,
      nodeToRemove,
      closeMenu,
      matchingString,
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect();
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="component-picker-menu">
                <ul className="component-picker-list">
                  {options.map((option, i) => (
                    <ComponentPickerMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}

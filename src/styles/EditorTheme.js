/**
 * Complete Lexical Editor Theme
 * Full functionality JavaScript version
 */

const EditorTheme = {
  // Paragraph styles
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  
  // Heading styles
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  
  // List styles
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
    checklist: 'editor-list-checklist',
  },
  
  // Text formatting
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
    highlight: 'editor-text-highlight',
    subscript: 'editor-text-subscript',
    superscript: 'editor-text-superscript',
  },
  
  // Links
  link: 'editor-link',
  
  // Code blocks
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAtrule',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenBoolean',
    builtin: 'editor-tokenBuiltin',
    cdata: 'editor-tokenCdata',
    char: 'editor-tokenChar',
    class: 'editor-tokenClass',
    'class-name': 'editor-tokenClassName',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenConstant',
    deleted: 'editor-tokenDeleted',
    doctype: 'editor-tokenDoctype',
    entity: 'editor-tokenEntity',
    function: 'editor-tokenFunction',
    important: 'editor-tokenImportant',
    inserted: 'editor-tokenInserted',
    keyword: 'editor-tokenKeyword',
    namespace: 'editor-tokenNamespace',
    number: 'editor-tokenNumber',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenProlog',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenRegex',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenString',
    symbol: 'editor-tokenSymbol',
    tag: 'editor-tokenTag',
    url: 'editor-tokenUrl',
    variable: 'editor-tokenVariable',
  },
  
  // Tables
  table: 'editor-table',
  tableCell: 'editor-table-cell',
  tableCellHeader: 'editor-table-cell-header',
  tableRow: 'editor-table-row',
  tableSelection: 'editor-table-selection',
  
  // Images
  image: 'editor-image',
  
  // Hashtags
  hashtag: 'editor-hashtag',
  
  // Alignment
  alignLeft: 'editor-align-left',
  alignCenter: 'editor-align-center',
  alignRight: 'editor-align-right',
  alignJustify: 'editor-align-justify',
  
  // Indent
  indent: 'editor-indent',
  
  // Horizontal rule
  hr: 'editor-hr',
  
  // Root element
  root: 'editor-root',
  
  // Focus
  focus: 'editor-focus',
};

export default EditorTheme;

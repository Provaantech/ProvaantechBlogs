/**
 * Complete Editor Nodes Configuration
 * All available nodes for full playground functionality
 */

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { HashtagNode } from '@lexical/hashtag';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ImageNode } from '../nodes/ImageNode';
import { EmojiNode } from '../nodes/EmojiNode.jsx';
import { MentionNode } from '../nodes/MentionNode';

/**
 * Complete list of nodes for full playground functionality
 * This matches the original playground's node capabilities
 */
const EditorNodes = [
  // Rich text nodes
  HeadingNode,
  QuoteNode,
  
  // List nodes
  ListNode,
  ListItemNode,
  
  // Code nodes
  CodeNode,
  CodeHighlightNode,
  
  // Table nodes
  TableNode,
  TableCellNode,
  TableRowNode,
  
  // Link nodes
  LinkNode,
  AutoLinkNode,
  
  // Hashtag nodes
  HashtagNode,
  
  // Mark nodes (for highlighting)
  MarkNode,
  
  // Overflow nodes
  OverflowNode,
  
  // Horizontal rule
  HorizontalRuleNode,
  
  // Image nodes
  ImageNode,
  
  // Custom nodes
  EmojiNode,
  MentionNode,
];

export default EditorNodes;

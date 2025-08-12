/**
 * Mention Node
 * Custom node for @mentions functionality
 */

import { $applyNodeReplacement, TextNode } from 'lexical';

export class MentionNode extends TextNode {
  __mention;

  static getType() {
    return 'mention';
  }

  static clone(node) {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createMentionNode(serializedNode.mention);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mention, text, key) {
    super(text ?? mention, key);
    this.__mention = mention;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      mention: this.__mention,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = 'editor-mention';
    return dom;
  }

  exportDOM() {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity() {
    return true;
  }

  canInsertTextBefore() {
    return false;
  }

  canInsertTextAfter() {
    return false;
  }

  getMention() {
    return this.__mention;
  }

  setMention(mention) {
    const writable = this.getWritable();
    writable.__mention = mention;
  }
}

function convertMentionElement(domNode) {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode(textContent);
    return {
      node,
    };
  }

  return null;
}

export function $createMentionNode(mention) {
  const mentionNode = new MentionNode(mention);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(node) {
  return node instanceof MentionNode;
}

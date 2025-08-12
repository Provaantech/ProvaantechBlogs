// src/nodes/EmojiNode.jsx
import {
  $applyNodeReplacement,
  TextNode
} from 'lexical';

// Single EmojiNode definition
export class EmojiNode extends TextNode {
  __className;

  static getType() {
    return 'emoji';
  }

  static clone(node) {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className, text, key) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config) {
    const dom = document.createElement('span');
    const inner = super.createDOM(config);
    dom.className = this.__className || 'emoji-inline';
    inner.className = 'emoji-inner';
    dom.appendChild(inner);
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner, config);
    return false;
  }

  static importJSON(serializedNode) {
    return $createEmojiNode(
      serializedNode.className || 'emoji-inline',
      serializedNode.text
    ).updateFromJSON(serializedNode);
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      className: this.getClassName(),
    };
  }

  getClassName() {
    const self = this.getLatest();
    return self.__className;
  }
}

// Factory & type check functions
export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className = 'emoji-inline', emojiText = '😊') {
  const node = new EmojiNode(className, emojiText).setMode('token');
  return $applyNodeReplacement(node);
} 

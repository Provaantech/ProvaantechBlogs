// src/nodes/EmojiNode.js
import { DecoratorNode } from 'lexical';
import React from 'react';

export class EmojiNode extends DecoratorNode {
  __emoji;
  static getType() { return 'emoji'; }
  static clone(node) { return new EmojiNode(node.__emoji, node.__key); }

  constructor(emoji, key) {
    super(key);
    this.__emoji = emoji;
  }

  static importJSON(serialized) {
    return $createEmojiNode(serialized.emoji);
  }

  exportJSON() {
    return {
      type: 'emoji',
      emoji: this.__emoji,
      version: 1,
    };
  }

  decorate() {
    return <span className="emoji-inline" aria-hidden="true">{this.__emoji}</span>;
  }
}

export function $createEmojiNode(emoji = '😊') {
  return new EmojiNode(emoji);
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

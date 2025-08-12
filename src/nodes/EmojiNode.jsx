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

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $applyNodeReplacement,
  TextNode,
} from 'lexical';

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
    dom.className = this.__className;
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
      serializedNode.className,
      serializedNode.text,
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

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className, emojiText) {
  const node = new EmojiNode(className, emojiText).setMode('token');
  return $applyNodeReplacement(node);
}

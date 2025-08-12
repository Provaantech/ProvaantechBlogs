// src/nodes/ExcalidrawNode.js
import { DecoratorNode } from 'lexical';
import React from 'react';

export class ExcalidrawNode extends DecoratorNode {
  __src;
  static getType() { return 'excalidraw'; }
  static clone(node) { return new ExcalidrawNode(node.__src, node.__key); }

  constructor(src = '', key) {
    super(key);
    this.__src = src;
  }

  static importJSON(serialized) {
    return $createExcalidrawNode(serialized.src);
  }

  exportJSON() {
    return { type: 'excalidraw', src: this.__src, version: 1 };
  }

  decorate() {
    return (
      <div className="excalidraw-node">
        <img src={this.__src} alt="drawing" style={{ maxWidth: '100%', display:'block' }} />
      </div>
    );
  }
}

export function $createExcalidrawNode(src = '') {
  return new ExcalidrawNode(src);
}

export function $isExcalidrawNode(node) {
  return node instanceof ExcalidrawNode;
}

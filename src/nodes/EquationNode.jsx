// src/nodes/EquationNode.js
import { DecoratorNode } from 'lexical';
import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export class EquationNode extends DecoratorNode {
  __latex;
  static getType() { return 'equation'; }
  static clone(node) { return new EquationNode(node.__latex, node.__key); }

  constructor(latex = '', key) {
    super(key);
    this.__latex = latex;
  }

  static importJSON(serialized) {
    return $createEquationNode(serialized.latex);
  }

  exportJSON() {
    return {
      type: 'equation',
      latex: this.__latex,
      version: 1
    };
  }

  decorate() {
    // render to HTML using KaTeX
    const html = katex.renderToString(this.__latex || '', { throwOnError: false });
    return <span className="equation-node" dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

export function $createEquationNode(latex = '') {
  return new EquationNode(latex);
}

export function $isEquationNode(node) {
  return node instanceof EquationNode;
}

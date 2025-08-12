// src/nodes/PollNode.js
import { DecoratorNode } from 'lexical';
import React from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export class PollNode extends DecoratorNode {
  __question;
  __options; // array of {label, votes}
  static getType() { return 'poll'; }
  static clone(node) { return new PollNode(node.__question, node.__options, node.__key); }

  constructor(question = '', options = [], key) {
    super(key);
    this.__question = question;
    this.__options = options;
  }

  static importJSON(serialized) {
    return $createPollNode(serialized.question, serialized.options || []);
  }

  exportJSON() {
    return { type: 'poll', question: this.__question, options: this.__options, version: 1 };
  }

  decorate() {
    return <PollComponent nodeKey={this.getKey()} question={this.__question} options={this.__options} />;
  }

  // Mutators (must be called inside editor.update)
  setQuestion(q) {
    const writable = this.getWritable();
    writable.__question = q;
  }
  setOptions(opts) {
    const writable = this.getWritable();
    writable.__options = opts;
  }
}

export function $createPollNode(question = 'Poll?', options = ['Yes','No']) {
  const ops = options.map((label) => ({ label, votes: 0 }));
  return new PollNode(question, ops);
}

export function $isPollNode(node) {
  return node instanceof PollNode;
}

/* PollComponent: small interactive UI that persists votes into the node */
function PollComponent({ nodeKey, question, options }) {
  const [editor] = useLexicalComposerContext();
  const [localOptions, setLocalOptions] = React.useState(options);

  React.useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const vote = (index) => {
    // update node data inside editor.update so it persists
    editor.update(() => {
      const node = editor.getEditorState()._nodeMap.get(nodeKey); // best-effort access
      // safer approach using $getNodeByKey inside lexical read/write:
      try {
        const {$getNodeByKey} = require('lexical');
        const target = $getNodeByKey(nodeKey);
        if (target && target.setOptions) {
          const updated = target.__options.map((o, i) => i === index ? { ...o, votes: (o.votes || 0) + 1 } : o);
          target.setOptions(updated);
          setLocalOptions(updated);
        }
      } catch (err) {
        // fallback: update local only (won't persist)
        const copy = localOptions.slice();
        copy[index] = { ...copy[index], votes: (copy[index].votes || 0) + 1 };
        setLocalOptions(copy);
      }
    });
  };

  return (
    <div className="poll-node" style={{border:'1px solid #ddd', padding:8, borderRadius:6, maxWidth:600}}>
      <strong>{question}</strong>
      <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:6}}>
        {localOptions.map((opt, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div>{opt.label}</div>
            <div style={{display:'flex', gap:8}}>
              <div style={{minWidth:40, textAlign:'right'}}>{opt.votes || 0}</div>
              <button onClick={() => vote(i)}>Vote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

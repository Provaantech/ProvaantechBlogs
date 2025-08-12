// src/plugins/PollPlugin.jsx
import React, { useState } from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createPollNode } from "../nodes/PollNode";
import { $getSelection, $isRangeSelection } from "lexical";

export default function PollPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('Your question?');
  const [opts, setOpts] = useState(['Yes', 'No']);

  const insert = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = $createPollNode(question, opts);
        selection.insertNodes([node]);
      }
    });
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Poll</button>
      {open && (
        <div className="lexical-modal">
          <div className="lexical-modal-inner">
            <h4>Create Poll</h4>
            <input value={question} onChange={(e)=>setQuestion(e.target.value)} />
            <div style={{marginTop:8}}>
              {opts.map((o,i) => (
                <input key={i} value={o} onChange={(e)=>{ const copy = [...opts]; copy[i] = e.target.value; setOpts(copy); }} style={{display:'block', marginTop:4}} />
              ))}
            </div>
            <div style={{marginTop:8}}>
              <button onClick={insert}>Insert Poll</button>
              <button onClick={()=>setOpen(false)} style={{marginLeft:8}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

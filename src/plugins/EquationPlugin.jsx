// src/plugins/EquationPlugin.jsx
import React, { useState } from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createEquationNode } from "../nodes/EquationNode";
import { $getSelection, $isRangeSelection } from "lexical";

export default function EquationPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [latex, setLatex] = useState('\\frac{a}{b}');

  const insert = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = $createEquationNode(latex);
        selection.insertNodes([node]);
      }
    });
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>∑</button>
      {open && (
        <div className="lexical-modal">
          <div className="lexical-modal-inner">
            <h4>Insert LaTeX (KaTeX)</h4>
            <textarea value={latex} onChange={(e) => setLatex(e.target.value)} rows={4} />
            <div style={{marginTop:8}}>
              <button onClick={insert}>Insert</button>
              <button onClick={() => setOpen(false)} style={{marginLeft:8}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// src/plugins/ExcalidrawPlugin.jsx
import React, { useState } from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createExcalidrawNode } from "../nodes/ExcalidrawNode";
import { $getSelection, $isRangeSelection } from "lexical";

export default function ExcalidrawPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const onFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const insert = () => {
    if (!preview) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = $createExcalidrawNode(preview);
        selection.insertNodes([node]);
      }
    });
    setOpen(false);
    setPreview(null);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Draw</button>
      {open && (
        <div className="lexical-modal">
          <div className="lexical-modal-inner">
            <h4>Insert Drawing (PNG/JPG)</h4>
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files[0])} />
            {preview && <img src={preview} alt="preview" style={{maxWidth:250, marginTop:8}}/>}
            <div style={{marginTop:8}}>
              <button onClick={insert} disabled={!preview}>Insert</button>
              <button onClick={() => { setOpen(false); setPreview(null); }} style={{marginLeft:8}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

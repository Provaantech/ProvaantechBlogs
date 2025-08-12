/**
 * ActionsPlugin - Export/Import functionality
 * Provides document management features: export to JSON/HTML/Markdown, import, and clear
 * Based on the original Lexical playground implementation
 */

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TRANSFORMERS } from '@lexical/markdown';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
} from 'lexical';
import { useCallback, useState } from 'react';

import Button from '../ui/Button';
import Modal from '../ui/Modal';

function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateMarkdown(editor) {
  let markdown = '';
  
  editor.getEditorState().read(() => {
    const root = $getRoot();
    const textContent = root.getTextContent();
    
    // Simple markdown conversion - convert text content to markdown
    // This is a basic implementation; you can enhance it based on your needs
    const lines = textContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim()) {
        markdown += line + '\n\n';
      }
    });
  });
  
  return markdown || 'No content to export.';
}

function ActionsModalContent({ editor, onClose }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [importContent, setImportContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('export');

  const handleExport = useCallback(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      let content = '';
      let filename = '';
      let contentType = 'text/plain';

      switch (exportFormat) {
        case 'json': {
          const editorState = editor.getEditorState();
          content = JSON.stringify(editorState.toJSON(), null, 2);
          filename = 'lexical-editor-content.json';
          contentType = 'application/json';
          break;
        }
        case 'html': {
          content = $generateHtmlFromNodes(editor, null);
          filename = 'lexical-editor-content.html';
          contentType = 'text/html';
          break;
        }
        case 'markdown': {
          content = generateMarkdown(editor);
          filename = 'lexical-editor-content.md';
          contentType = 'text/markdown';
          break;
        }
        default:
          return;
      }

      downloadFile(content, filename, contentType);
    });
  }, [editor, exportFormat]);

  const handleImport = useCallback(() => {
    if (!importContent.trim()) return;

    setIsImporting(true);
    
    try {
      // Try to parse as JSON first (editor state)
      try {
        const parsedContent = JSON.parse(importContent);
        if (parsedContent && parsedContent.root) {
          // Valid Lexical editor state - use setEditorState outside of update
          const newEditorState = editor.parseEditorState(importContent);
          editor.setEditorState(newEditorState);
          setImportContent('');
          onClose();
          return;
        }
      } catch (e) {
        // Not valid JSON, continue to other methods
      }

      // For HTML or plain text, use update
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // Try to parse as HTML
        if (importContent.includes('<') && importContent.includes('>')) {
          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(importContent, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            
            // Insert nodes properly
            if (nodes.length > 0) {
              nodes.forEach(node => {
                try {
                  root.append(node);
                } catch (err) {
                  console.warn('Could not append node:', err);
                  // Fallback: create a paragraph with the text content
                  const textContent = node.getTextContent ? node.getTextContent() : '';
                  if (textContent) {
                    const paragraph = $createParagraphNode();
                    paragraph.append($createTextNode(textContent));
                    root.append(paragraph);
                  }
                }
              });
            } else {
              // No nodes generated, fallback to text
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(importContent));
              root.append(paragraph);
            }
          } catch (e) {
            console.error('HTML parsing failed:', e);
            // Fallback to plain text
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(importContent));
            root.append(paragraph);
          }
        } else {
          // Treat as plain text - split into paragraphs
          const lines = importContent.split('\n');
          if (lines.length === 0 || (lines.length === 1 && !lines[0].trim())) {
            // Empty content, add a single empty paragraph
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          } else {
            lines.forEach(line => {
              const paragraph = $createParagraphNode();
              if (line.trim()) {
                paragraph.append($createTextNode(line));
              }
              root.append(paragraph);
            });
          }
        }
      });

      setImportContent('');
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import content. Please check the format.');
    } finally {
      setIsImporting(false);
    }
  }, [editor, importContent, onClose]);

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        // Add an empty paragraph to maintain editor state
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        paragraph.select();
      });
      onClose();
    }
  }, [editor, onClose]);

  const handleCopyContent = useCallback(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      navigator.clipboard.writeText(textContent).then(() => {
        alert('Content copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy content to clipboard.');
      });
    });
  }, [editor]);

  return (
    <div className="ActionsPlugin">
      <div className="ActionsPlugin__tabs">
        <button 
          className={`ActionsPlugin__tab ${activeTab === 'export' ? 'ActionsPlugin__tab--active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export
        </button>
        <button 
          className={`ActionsPlugin__tab ${activeTab === 'import' ? 'ActionsPlugin__tab--active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          Import
        </button>
        <button 
          className={`ActionsPlugin__tab ${activeTab === 'actions' ? 'ActionsPlugin__tab--active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
      </div>

      <div className="ActionsPlugin__content">
        {activeTab === 'export' && (
          <div className="ActionsPlugin__section">
            <h3>Export Content</h3>
            <p>Download your content in various formats:</p>
            
            <div className="ActionsPlugin__format-selector">
              <label className="ActionsPlugin__format-option">
                <input
                  type="radio"
                  name="exportFormat"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <div className="ActionsPlugin__format-info">
                  <span>JSON (Editor State)</span>
                  <small>Perfect restoration with all formatting</small>
                </div>
              </label>
              
              <label className="ActionsPlugin__format-option">
                <input
                  type="radio"
                  name="exportFormat"
                  value="html"
                  checked={exportFormat === 'html'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <div className="ActionsPlugin__format-info">
                  <span>HTML</span>
                  <small>Clean HTML markup</small>
                </div>
              </label>
              
              <label className="ActionsPlugin__format-option">
                <input
                  type="radio"
                  name="exportFormat"
                  value="markdown"
                  checked={exportFormat === 'markdown'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <div className="ActionsPlugin__format-info">
                  <span>Markdown</span>
                  <small>GitHub-compatible markdown</small>
                </div>
              </label>
            </div>

            <div className="ActionsPlugin__buttons">
              <Button onClick={handleExport} variant="primary">
                Download {exportFormat.toUpperCase()}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="ActionsPlugin__section">
            <h3>Import Content</h3>
            <p>Paste JSON, HTML, or plain text to import:</p>
            
            <textarea
              className="ActionsPlugin__textarea"
              placeholder="Paste your content here (JSON editor state, HTML, or plain text)..."
              value={importContent}
              onChange={(e) => setImportContent(e.target.value)}
              rows={10}
            />
            
            <div className="ActionsPlugin__buttons">
              <Button 
                onClick={handleImport} 
                variant="primary"
                disabled={!importContent.trim() || isImporting}
              >
                {isImporting ? 'Importing...' : 'Import Content'}
              </Button>
              <Button 
                onClick={() => setImportContent('')} 
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="ActionsPlugin__section">
            <h3>Quick Actions</h3>
            
            <div className="ActionsPlugin__action-item">
              <div className="ActionsPlugin__action-info">
                <h4>Copy Content</h4>
                <p>Copy all text content to clipboard</p>
              </div>
              <Button onClick={handleCopyContent} variant="secondary">
                Copy Text
              </Button>
            </div>

            <div className="ActionsPlugin__action-item ActionsPlugin__action-item--danger">
              <div className="ActionsPlugin__action-info">
                <h4>Clear Editor</h4>
                <p>Remove all content from the editor</p>
              </div>
              <Button onClick={handleClear} variant="danger">
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      {showModal && (
        <Modal
          title="Document Actions"
          onClose={closeModal}
          className="ActionsPlugin__modal"
        >
          <ActionsModalContent editor={editor} onClose={closeModal} />
        </Modal>
      )}
    </>
  );
}

export function useActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [showModal, setShowModal] = useState(false);

  const openActionsModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeActionsModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    showModal,
    openActionsModal,
    closeActionsModal,
    ActionsModal: showModal ? (
      <Modal
        title="Document Actions"
        onClose={closeActionsModal}
        className="ActionsPlugin__modal"
      >
        <ActionsModalContent editor={editor} onClose={closeActionsModal} />
      </Modal>
    ) : null
  };
}

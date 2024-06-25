import React, { useEffect } from 'react';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './tiptapStyles.css';

interface CompleteReportTipTapEditorProps {
  reportTitle: string;
  reportQuestionsFocus: string;
  onUpdate: (reportTitle: string, reportQuestionsFocus: string) => void;
}

const CompleteReportTipTapEditor: React.FC<CompleteReportTipTapEditorProps> = ({
  reportTitle,
  reportQuestionsFocus,
  onUpdate,
}) => {
  const CustomDocument = Document.extend({
    content: 'heading block*',
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }: { node: any }) => {
          if (node.type.name === 'heading') {
            return 'Give your report a Name';
          }
          return 'Please provide additional context for generating the report';
        },
      }),
    ],
    content: `<h1>${reportTitle}</h1><p>${reportQuestionsFocus}</p>`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
      const h1 = parsedHtml.querySelector('h1');
      const p = parsedHtml.querySelector('p');
      const updatedReportTitle = h1 ? h1.textContent || '' : '';
      const updatedReportQuestionsFocus = p ? p.textContent || '' : '';
      onUpdate(updatedReportTitle, updatedReportQuestionsFocus);
    },
  });

  useEffect(() => {
    if (editor) {
      const firstNode = editor.state.doc.firstChild;
      if (firstNode) {
        editor.commands.focus();
        const positionAtEndOfFirstLine = firstNode.nodeSize - 1;
        editor.commands.setTextSelection({
          from: positionAtEndOfFirstLine,
          to: positionAtEndOfFirstLine,
        });
      }
    }
  }, [editor]);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
      }}
    >
      <EditorContent
        editor={editor}
        className="tiptap"
        style={{ outline: 'none' }}
      />
    </div>
  );
};

export default CompleteReportTipTapEditor;

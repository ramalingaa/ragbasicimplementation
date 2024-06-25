import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import Highlight from '@tiptap/extension-highlight';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import Typography from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import TiptapEditorMenuBar from './TiptapEditorMenuBar';
import './tiptapStyles.css';

export type TextBoxItem = {
  id: string;
  titleText: string;
  bodyText: string;
};

interface TextBoxItemBoxProps {
  textBoxItem: any;
  onViewMode?: boolean;
}

const TextBoxItemBox: React.FC<TextBoxItemBoxProps> = ({
  textBoxItem,
  onViewMode,
}) => {
  const { updateTextBoxItemInReportBoxes } = useReportsStore();

  const CustomDocument = Document.extend({
    content: 'heading block*',
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Paragraph,
      Text,
      Typography,
      Highlight,
      TaskList,
      TaskItem,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      StarterKit.configure({ document: false }),
      Placeholder.configure({
        placeholder: ({ node }: { node: any }) => {
          if (textBoxItem.titleText === '' && textBoxItem.bodyText === '') {
            if (node.type.name === 'heading') {
              return '';
            }
            return 'Please provide additional context';
          }
          return '';
        },
      }),
    ],
    content: `
      <h1>${textBoxItem.titleText}</h1>
      ${textBoxItem.bodyText}
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const titleText = html.match(/<h1>(.*?)<\/h1>/)?.[1] || '';
      const bodyText = html.replace(/<h1>.*?<\/h1>/, '').trim();
      updateTextBoxItemInReportBoxes(textBoxItem.id, titleText, bodyText);
    },
    editable: !onViewMode,
  });

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      style={{
        borderRadius: '4px',
        padding: '10px',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
      }}
      onMouseDown={handleMouseDown}
    >
      {editor && !onViewMode && <TiptapEditorMenuBar editor={editor} />}
      {!onViewMode ? (
        <EditorContent
          editor={editor}
          className="tiptap"
          style={{
            outline: 'none',
            flexGrow: 1,
            paddingLeft: '1rem',
            overflowY: 'auto',
            maxHeight: 'calc(100% - 40px)',
          }}
        />
      ) : (
        <div
          className="tiptap"
          style={{
            outline: 'none',
            flexGrow: 1,
            paddingLeft: '1rem',
            overflowY: 'auto',
            maxHeight: 'calc(100% - 40px)',
          }}
          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
        />
      )}
    </div>
  );
};

export default TextBoxItemBox;

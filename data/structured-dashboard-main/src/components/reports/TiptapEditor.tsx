import React, { useEffect } from 'react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './tiptapStyles.css';
import TiptapEditorMenuBar from './TiptapEditorMenuBar';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Mention from '@tiptap/extension-mention';
import suggestion from './suggestion';
import ReactComponent from './Extension';
import { QueryConversationItem } from 'zustand/queries/queriesStore';

interface TiptapEditorProps {
  reportTitle: string;
  reportQuestionsFocus: string;
  reactComponentData: Array<{
    position: string;
    queryConversationItem: QueryConversationItem;
  }> | null;
  onUpdate: (
    reportTitle: string,
    reportQuestionsFocus: string,
    reactComponentData: Array<{
      position: string;
      queryConversationItem: QueryConversationItem;
    }> | null,
  ) => void;
  handleCreateReport?: () => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  reportTitle,
  reportQuestionsFocus,
  reactComponentData,
  onUpdate,
  handleCreateReport,
}) => {
  const CustomDocument = Document.extend({
    content: 'heading block*',
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      ReactComponent,
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
      StarterKit.configure({
        document: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          ...suggestion,
          command: ({ editor, range, props }) => {
            const { id, queryConversationItem } = props;
            const position = range.from;
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent({
                type: 'reactComponent',
                attrs: {
                  queryConversationItem: JSON.stringify(queryConversationItem),
                  position: position.toString(),
                },
              })
              .run();
          },
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }: { node: any }) => {
          if (reportTitle === '' && reportQuestionsFocus === '') {
            if (node.type.name === 'heading') {
              return '';
            }
            return 'Please provide additional context for generating the report';
          }
          return '';
        },
      }),
    ],
    content: `
        <h1>${reportTitle}</h1>
        ${reportQuestionsFocus}
      `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
      const h1 = parsedHtml.querySelector('h1');
      const updatedReportTitle = h1 ? h1.textContent || '' : '';

      // Clone the parsed HTML to preserve the original structure
      const clonedHtml = parsedHtml.cloneNode(true) as Document;
      const clonedH1 = clonedHtml.querySelector('h1');

      // Remove the <h1> element from the cloned HTML
      if (clonedH1) {
        clonedH1.remove();
      }

      // Find all the custom React components in the cloned HTML
      const reactComponents = clonedHtml.querySelectorAll('.mention');

      // Extract the queryConversationItem data from the custom React components
      const updatedReactComponentData = Array.from(reactComponents).map(
        (component) => {
          const queryConversationItem = component.getAttribute(
            'data-query-conversation-item',
          );
          return {
            queryConversationItem: JSON.parse(queryConversationItem || '{}'),
            position: component.getAttribute('data-position'),
          };
        },
      );

      // Remove the custom React components from the cloned HTML
      reactComponents.forEach((component) => component.remove());

      // Get the remaining HTML content as the updated reportQuestionsFocus
      const updatedReportQuestionsFocus = clonedHtml.body.innerHTML;

      console.log('Updated reactComponentData:', updatedReactComponentData);

      onUpdate(
        updatedReportTitle,
        updatedReportQuestionsFocus,
        updatedReactComponentData,
      );
    },
    //Edit mode
    // onUpdate: ({ editor }) => {
    //   const html = editor.getHTML();
    //   const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
    //   const h1 = parsedHtml.querySelector('h1');
    //   const updatedReportTitle = h1 ? h1.textContent || '' : '';

    //   // Clone the parsed HTML to preserve the original structure
    //   const clonedHtml = parsedHtml.cloneNode(true) as Document;
    //   const clonedH1 = clonedHtml.querySelector('h1');

    //   // Remove the <h1> element from the cloned HTML
    //   if (clonedH1) {
    //     clonedH1.remove();
    //   }

    //   // Get the remaining HTML content as the updated reportQuestionsFocus
    //   const updatedReportQuestionsFocus = clonedHtml.body.innerHTML;

    //   console.log('');

    //   onUpdate(
    //     updatedReportTitle,
    //     updatedReportQuestionsFocus,
    //     reactComponentData,
    //   );
    // },
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

  // Insert the React components into the editor's content
  React.useEffect(() => {
    if (editor && reactComponentData) {
      reactComponentData.forEach((item) => {
        editor
          .chain()
          .insertContent({
            type: 'reactComponent',
            attrs: {
              queryConversationItem: JSON.stringify(item.queryConversationItem),
              position: item.position,
            },
          })
          .run();
      });
    }
  }, [editor]);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        height: '98%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {editor && <TiptapEditorMenuBar editor={editor} />}
      {reportTitle === '' &&
        reportQuestionsFocus === '' &&
        handleCreateReport && (
          <div className="mb-4 pl-4">
            <h3 className="text-gray-500 text-lg font-medium">
              Start typing, or{' '}
              <button
                className="text-blue-500 hover:underline"
                onClick={handleCreateReport}
              >
                start with default template
              </button>
            </h3>
          </div>
        )}
      <EditorContent
        editor={editor}
        className="tiptap"
        style={{
          outline: 'none',
          flexGrow: 1,
          paddingLeft: '1rem',
        }}
      />
    </div>
  );
};

export default TiptapEditor;

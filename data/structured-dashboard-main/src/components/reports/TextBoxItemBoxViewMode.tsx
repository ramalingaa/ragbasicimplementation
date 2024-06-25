import React from 'react';
import './tiptapStyles.css';
import { useReportsStore } from '../../zustand/reports/reportsStore';

export type TextBoxItem = {
  id: string;
  titleText: string;
  bodyText: string;
};

interface TextBoxItemBoxViewModeProps {
  textBoxItem: any;
}

const TextBoxItemBoxViewMode: React.FC<TextBoxItemBoxViewModeProps> = ({
  textBoxItem,
}) => {
  const { titleText, bodyText } = textBoxItem;

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
      <h1>{titleText}</h1>
      <div style={{ flexGrow: 1, paddingLeft: '1rem' }}>{bodyText}</div>
    </div>
  );
};

export default TextBoxItemBoxViewMode;

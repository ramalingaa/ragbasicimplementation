'use client';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ascetic } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface QueryPreviewProps {
    codeGen: string;
}
const QueryPreview: React.FC<QueryPreviewProps> = ({ codeGen }) => {
    console.log("codeGen", codeGen)
    return (
        <SyntaxHighlighter language="python" style={ascetic} wrapLines={true} >
            {codeGen ? `code:\n${codeGen}` : ``}
        </SyntaxHighlighter>
    )
}

export default QueryPreview;
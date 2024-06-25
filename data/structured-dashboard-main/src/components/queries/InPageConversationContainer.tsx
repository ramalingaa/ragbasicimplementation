import React from 'react';

import useThemeColors from 'hooks/useThemeColors';


export type LogItem = {
  logSearchQuery: string;
  logSearchResponse: string;
};

export type LogConversation = {
  id: string;
  conversationTitle: string;
  items: LogItem[];
  timeStamp?: string;
};

type InPageConversationContainerProps = {
  conversation: LogConversation;
};

const InPageConversationContainer: React.FC<
  InPageConversationContainerProps
> = ({ conversation }) => {
  const { themeSecondaryBgColor, themeTertiaryBgColor, themeContainerBgColor } =
    useThemeColors();
  return (
    <div
      className='flex flex-col items-center justify-center h-full p-4'
    >
      {conversation.items.map((item, index) => (
        <React.Fragment key={index}>
          <div
            className='flex flex-row justify-between items-center rounded-md w-full mt-4 p-4 border-1 border-gray-300 bg-white'
          >
            {item.logSearchQuery}
          </div>
          <div
            className='flex flex-col rounded-md w-full mt-4 p-4 border-1 border-gray-300 bg-white'
          >
            {item.logSearchResponse}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default InPageConversationContainer;

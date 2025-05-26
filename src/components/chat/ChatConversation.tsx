
import React from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp?: string;
}

interface ChatConversationProps {
  messages: Message[];
}

const ChatConversation: React.FC<ChatConversationProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id}
          isUser={message.isUser}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
    </div>
  );
};

export default ChatConversation;

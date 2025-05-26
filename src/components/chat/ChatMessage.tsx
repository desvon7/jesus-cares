
import React from 'react';

interface ChatMessageProps {
  isUser: boolean;
  content: string;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isUser, content, timestamp }) => {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white mt-1 ${isUser ? 'bg-gray-600' : 'bg-adam-pink'}`}>
        {isUser ? 'JP' : 'A'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{isUser ? 'Jean Paul' : 'Adam Object'}</span>
          {timestamp && <span className="text-xs text-white/60">{timestamp}</span>}
          {!isUser && <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/60">v1</span>}
        </div>
        <p className="text-sm text-white/90">{content}</p>
        {!isUser && (
          <div className="flex items-center mt-1 gap-2">
            <button className="flex items-center gap-1 px-2 py-0.5 text-xs text-white/60 bg-adam-gray/30 rounded hover:bg-adam-gray/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span>testing</span>
            </button>
            {Math.random() > 0.5 && (
              <button className="flex items-center gap-1 px-2 py-0.5 text-xs text-white/60 bg-adam-gray/30 rounded hover:bg-adam-gray/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10M18 14l-6-6-6 6"></path>
                </svg>
                <span>copy</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

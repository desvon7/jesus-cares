
import React, { useRef, useEffect } from 'react';
import { Share, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface MessageProps {
  id: string;
  content: string;
  isAI: boolean;
  verses?: string[];
  explanation?: string;
}

interface ChatInterfaceProps {
  messages: MessageProps[];
}

const ChatMessage: React.FC<MessageProps> = ({ content, isAI, verses, explanation }) => {
  if (isAI) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="py-6 px-4 max-w-3xl mx-auto w-full"
      >
        <div className="flex items-start gap-4">
          <div className="size-9 rounded-full bg-gradient-to-br from-[#EDE9FE] to-[#A5F3FC] flex-shrink-0 flex items-center justify-center text-indigo-600 font-semibold shadow-sm">JC</div>
          <div className="flex-1">
            <Card className="border-0 shadow-sm overflow-hidden bg-[#FAFAFA] dark:bg-[#111111] rounded-2xl">
              <CardContent className="p-4">
                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{content}</p>
                
                {verses && verses.length > 0 && (
                  <div className="mb-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-4">
                    <p className="font-medium text-indigo-900 dark:text-indigo-300 mb-2">{verses[0]}</p>
                    {verses[1] && (
                      <p className="italic text-slate-600 dark:text-slate-400">"{verses[1]}"</p>
                    )}
                  </div>
                )}
                
                {explanation && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{explanation}</p>
                )}
                
                <div className="flex gap-2 mt-4 justify-end">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 rounded-full h-8 px-3">
                    <Share className="size-4 mr-1" />
                    <span className="text-xs">Share</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 rounded-full h-8 px-3">
                    <BookmarkPlus className="size-4 mr-1" />
                    <span className="text-xs">Save</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="py-6 px-4 max-w-3xl mx-auto w-full"
      >
        <div className="flex items-start gap-4 justify-end">
          <div className="flex-1 max-w-[85%]">
            <Card className="border-none bg-indigo-50 dark:bg-indigo-900/20 shadow-sm overflow-hidden rounded-2xl">
              <CardContent className="p-4">
                <p className="text-slate-700 dark:text-slate-300">{content}</p>
              </CardContent>
            </Card>
          </div>
          <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold shadow-sm">
            You
          </div>
        </div>
      </motion.div>
    );
  }
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {messages.map((message) => (
        <ChatMessage key={message.id} {...message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;

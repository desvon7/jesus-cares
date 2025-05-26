
import React, { useState } from 'react';
import { ArrowUp, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const ChatPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      // In a real implementation, we would pass this prompt to the chat page
      navigate('/chat');
    }
  };

  const handleOpenBible = () => {
    navigate('/bible');
  };

  return (
    <div className="flex flex-col w-full gap-4 items-center">      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="overflow-hidden border border-[#E5E5E5] dark:border-[#2A2A2C] shadow-md bg-white dark:bg-[#111111] backdrop-blur-md rounded-2xl">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask a question about faith, life challenges, or seek spiritual comfort..."
                className="w-full bg-transparent border-0 text-slate-700 dark:text-slate-200 px-6 py-6 min-h-[120px] text-base focus:outline-none focus:ring-0 resize-none relative z-10 placeholder-slate-400 dark:placeholder-slate-500"
                style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
              />
              
              <div className="flex justify-between items-center p-4 bg-[#F9F9FA] dark:bg-[#1A1A1A] border-t border-[#E5E5E5] dark:border-[#333333]">
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Receive biblical guidance for your journey</p>
                  <Button 
                    type="button"
                    onClick={handleOpenBible}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Open Bible
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  disabled={!prompt.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 py-2 h-auto transition-all duration-200 disabled:bg-indigo-400 flex items-center gap-2"
                >
                  <span>Ask</span>
                  <div className="rounded-full bg-white/20 p-1">
                    <ArrowUp className="size-3" />
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatPrompt;

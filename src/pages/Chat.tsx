
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Bookmark, Grid, Sun, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ChatInterface from '@/components/chat/ChatInterface';
import TopicSidebar from '@/components/chat/TopicSidebar';
import SuggestedPrompt from '@/components/chat/SuggestedPrompt';
import { motion } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState<Array<{id: string; content: string; isAI: boolean; verses?: string[]; explanation?: string;}>>([
    {
      id: '1',
      isAI: true,
      content: "Hello, I'm here to provide Bible-based guidance and comfort. What's on your heart today?",
      verses: [],
      explanation: ""
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: inputMessage,
        isAI: false
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // Simulate AI response (would connect to actual AI in production)
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          isAI: true,
          content: "In times of uncertainty, Scripture offers comfort and guidance.",
          verses: ["Philippians 4:6-7", "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."],
          explanation: "This verse reminds us that we can bring all our worries directly to God. Instead of carrying anxiety, we're invited to pray specifically about our concerns while maintaining a thankful heart. The promised result is supernatural peace that protects our emotional and mental wellbeing in ways that exceed human logic or explanation."
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full px-4 py-3 border-b border-[#EBEBEB] dark:border-[#202020] bg-white/90 dark:bg-black/90 backdrop-blur-md z-10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center">
                <ChevronLeft className="size-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <div className="size-7 rounded-full bg-gradient-to-br from-[#EDE9FE] to-[#A5F3FC] flex items-center justify-center ml-1">
                  <span className="text-base font-semibold text-indigo-600">J</span>
                </div>
              </div>
              <h1 className="text-lg font-medium text-slate-800 dark:text-slate-200">Jesus Cares</h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 w-10 h-10 rounded-full p-0">
              <MessageSquare className="size-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 w-10 h-10 rounded-full p-0">
              <Bookmark className="size-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 w-10 h-10 rounded-full p-0">
              <Grid className="size-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 w-10 h-10 rounded-full p-0">
              <Sun className="size-5" />
            </Button>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-57px)]">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={75} className="bg-white dark:bg-black">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Chat Messages */}
                <ChatInterface messages={messages} />
                
                {/* Message Input */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="border-t border-[#EBEBEB] dark:border-[#202020] p-4 pb-6 bg-white/80 dark:bg-black/80 backdrop-blur-md"
                >
                  <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <SuggestedPrompt text="Help with anxiety" onClick={() => setInputMessage("I'm feeling anxious about my future. What does the Bible say about worry?")} />
                        <SuggestedPrompt text="Finding purpose" onClick={() => setInputMessage("I'm trying to find my purpose in life. What guidance does the Bible offer?")} />
                        <SuggestedPrompt text="Dealing with grief" onClick={() => setInputMessage("I recently lost someone close to me. How can faith help with grief?")} />
                      </div>
                      
                      <div className="relative mt-2">
                        <textarea 
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Ask a question or share what's on your heart..."
                          className="w-full rounded-2xl border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#111111] px-4 py-3.5 pr-24 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#A8A8A8] dark:focus:border-[#555555] focus:ring-0 min-h-[56px] resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          rows={1}
                        />
                        <Button 
                          type="submit"
                          disabled={!inputMessage.trim()}
                          className="absolute bottom-2.5 right-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 h-auto transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                          Send
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="bg-[#F5F5F7] dark:bg-[#1C1C1E] hover:bg-[#E5E5E7] dark:hover:bg-[#2C2C2E] transition-colors" withHandle />
          
          {/* Topics Panel */}
          <ResizablePanel defaultSize={25} className="bg-[#F9F5FF]/70 dark:bg-[#0D0D0D] backdrop-blur-sm">
            <TopicSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Chat;

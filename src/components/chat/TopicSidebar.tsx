
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TopicItemProps {
  title: string;
  verseCount: number;
  isActive?: boolean;
  onClick: () => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ title, verseCount, isActive = false, onClick }) => {
  return (
    <button 
      className={`w-full text-left p-3 rounded-xl transition-colors ${isActive 
        ? 'bg-indigo-100/70 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-300' 
        : 'hover:bg-[#F3F3F3] dark:hover:bg-[#1A1A1A] text-slate-700 dark:text-slate-300'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className={`${isActive ? 'font-medium' : ''}`}>{title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive 
          ? 'bg-white dark:bg-black text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
          : 'bg-[#F3F3F3] dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 border border-[#E5E5E5] dark:border-[#333333]'}`}>
          {verseCount}
        </span>
      </div>
    </button>
  );
};

const VerseCard: React.FC<{ verse: string; reference: string }> = ({ verse, reference }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-sm mb-3 overflow-hidden bg-white dark:bg-[#111111] rounded-xl">
        <CardContent className="p-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 italic leading-relaxed">"{verse}"</p>
          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">{reference}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TopicSidebar: React.FC = () => {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const topics = [
    { 
      title: "Comfort", 
      verseCount: 24,
      verses: [
        { reference: "Psalm 23:4", verse: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me." },
        { reference: "2 Corinthians 1:3-4", verse: "The Father of compassion and the God of all comfort, who comforts us in all our troubles." }
      ]
    },
    { 
      title: "Peace", 
      verseCount: 18,
      verses: [
        { reference: "John 14:27", verse: "Peace I leave with you; my peace I give you. I do not give to you as the world gives." },
        { reference: "Isaiah 26:3", verse: "You will keep in perfect peace those whose minds are steadfast, because they trust in you." }
      ]
    },
    { 
      title: "Hope", 
      verseCount: 22,
      verses: [
        { reference: "Romans 15:13", verse: "May the God of hope fill you with all joy and peace as you trust in him." },
        { reference: "Jeremiah 29:11", verse: "For I know the plans I have for you, plans to give you hope and a future." }
      ]
    },
    { 
      title: "Strength", 
      verseCount: 19,
      verses: [
        { reference: "Isaiah 40:31", verse: "Those who hope in the LORD will renew their strength." },
        { reference: "Philippians 4:13", verse: "I can do all things through Christ who strengthens me." }
      ]
    },
  ];

  const activeTopic = topics[activeTopicIndex];

  return (
    <div className="h-full flex flex-col p-6">
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-medium text-slate-800 dark:text-slate-200 mb-4"
      >
        Scripture Topics
      </motion.h3>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 size-4" />
        <Input 
          placeholder="Search topics..." 
          className="pl-10 bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-[#333333] focus:border-[#A8A8A8] dark:focus:border-[#555555] rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 space-y-1"
      >
        {topics.map((topic, index) => (
          <TopicItem 
            key={topic.title}
            title={topic.title}
            verseCount={topic.verseCount}
            isActive={index === activeTopicIndex}
            onClick={() => setActiveTopicIndex(index)}
          />
        ))}
      </motion.div>

      {activeTopic && (
        <>
          <motion.h4 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-medium text-slate-800 dark:text-slate-200 mb-3"
          >
            Featured Verses on {activeTopic.title}
          </motion.h4>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {activeTopic.verses.map((verse, index) => (
              <motion.div
                key={verse.reference}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              >
                <VerseCard 
                  verse={verse.verse}
                  reference={verse.reference}
                />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopicSidebar;

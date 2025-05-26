
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TopicCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  index: number;
}

const TopicCard: React.FC<TopicCardProps> = ({ title, description, icon, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1 
      }}
    >
      <Card 
        className="border border-[#E7E7E8] dark:border-[#2A2A2C] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden bg-white dark:bg-[#1C1C1E] rounded-xl"
        onClick={onClick}
      >
        <CardContent className="relative z-10 p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-4">{icon}</span>
          <h3 className="text-base font-medium text-[#1D1D1F] dark:text-white mb-2">{title}</h3>
          <p className="text-sm leading-relaxed text-[#86868B] dark:text-[#A1A1A6]">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TopicGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const handleTopicClick = (topic: string) => {
    navigate(`/chat?topic=${topic.toLowerCase()}`);
  };
  
  const topics = [
    {
      title: "Anxiety",
      description: "Find peace through Scripture for worried hearts",
      icon: "😌",
      bgClass: "bg-gradient-to-br from-blue-200 to-blue-300"
    },
    {
      title: "Purpose",
      description: "Discover God's plan for your unique journey",
      icon: "🌟",
      bgClass: "bg-gradient-to-br from-amber-200 to-amber-300"
    },
    {
      title: "Forgiveness",
      description: "Release burdens through biblical forgiveness",
      icon: "🕊️",
      bgClass: "bg-gradient-to-br from-green-200 to-green-300"
    },
    {
      title: "Love",
      description: "Understand godly love in all relationships",
      icon: "❤️",
      bgClass: "bg-gradient-to-br from-red-200 to-red-300"
    },
    {
      title: "Healing",
      description: "Scripture for emotional and spiritual healing",
      icon: "🌿",
      bgClass: "bg-gradient-to-br from-emerald-200 to-emerald-300"
    },
    {
      title: "Faith",
      description: "Strengthen belief through biblical wisdom",
      icon: "✝️",
      bgClass: "bg-gradient-to-br from-purple-200 to-purple-300"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {topics.map((topic, index) => (
        <TopicCard
          key={topic.title}
          title={topic.title}
          description={topic.description}
          icon={topic.icon}
          onClick={() => handleTopicClick(topic.title)}
          index={index}
        />
      ))}
    </div>
  );
};

export default TopicGrid;

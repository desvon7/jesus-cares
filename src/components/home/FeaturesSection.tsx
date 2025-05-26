
import React from 'react';
import { MessageSquare, Bookmark, Grid, Sun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-[#F5F5F7] dark:bg-[#1C1C1E]">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-6"
      >
        <h2 className="text-3xl font-semibold text-center mb-16">How Jesus Cares Helps You</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            title="AI Chat"
            description="Ask questions and receive compassionate, Bible-based guidance for your journey."
            icon={<MessageSquare className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />}
          />
          
          <FeatureCard 
            title="Save Favorites"
            description="Bookmark meaningful verses and responses to revisit when you need them most."
            icon={<Bookmark className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />}
          />
          
          <FeatureCard 
            title="Topic Explorer"
            description="Browse categories like anxiety, forgiveness, or purpose for targeted guidance."
            icon={<Grid className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />}
          />
          
          <FeatureCard 
            title="Daily Inspiration"
            description="Start each day with Scripture and reflection delivered to your inbox."
            icon={<Sun className="h-6 w-6 text-indigo-500" strokeWidth={1.5} />}
          />
        </div>
      </motion.div>
    </section>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="border-none shadow-sm bg-white/70 dark:bg-[#2C2C2E]/60 backdrop-blur-md hover:shadow-md transition-all duration-300 rounded-2xl">
      <CardContent className="pt-8 pb-8 px-6">
        <div className="mb-6 bg-[#F0F0F3] dark:bg-[#3A3A3C] rounded-xl h-14 w-14 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-3">{title}</h3>
        <p className="text-[15px] leading-relaxed text-[#86868B] dark:text-[#A1A1A6]">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;

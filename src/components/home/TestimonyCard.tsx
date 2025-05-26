
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonyCardProps {
  quote: string;
  author: string;
  topic: string;
}

const TestimonyCard: React.FC<TestimonyCardProps> = ({ quote, author, topic }) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 text-indigo-400 text-3xl">"</div>
        <p className="text-slate-700 mb-4 italic">{quote}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="font-medium text-indigo-900">{author}</p>
          </div>
          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            {topic}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonyCard;

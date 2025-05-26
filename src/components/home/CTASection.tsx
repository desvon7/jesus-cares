
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const CTASection: React.FC = () => {
  return (
    <section className="w-full py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <Card className="border-none overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500">
          <CardContent className="py-16 px-6 relative z-10">
            <h2 className="text-3xl font-semibold text-white mb-4">Begin Your Spiritual Journey Today</h2>
            <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
              Let Scripture illuminate your path through life's questions and challenges.
            </p>
            <Link to="/chat">
              <Button className="bg-white text-indigo-600 hover:bg-white/90 px-8 py-7 h-auto text-lg rounded-full shadow-lg">
                Start Chatting with Jesus Cares
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default CTASection;

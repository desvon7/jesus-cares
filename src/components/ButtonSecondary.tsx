
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonSecondaryProps {
  children: React.ReactNode;
  icon?: boolean;
  onClick?: () => void;
  className?: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ 
  children, 
  icon = false, 
  onClick,
  className = ""
}) => {
  return (
    <button 
      onClick={onClick}
      className={`glass-secondary group relative text-foreground rounded-2xl px-6 py-3 font-medium 
        flex items-center gap-2 ${className}`}
    >
      {children}
      {icon && (
        <ArrowRight 
          size={16} 
          className="transition-transform duration-300 group-hover:translate-x-1" 
        />
      )}
    </button>
  );
};

export default ButtonSecondary;

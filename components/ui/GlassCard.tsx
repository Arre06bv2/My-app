'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: boolean;
}

export function GlassCard({ children, className, hover = false, onClick, glow = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'glass',
        hover && 'cursor-pointer transition-shadow duration-300',
        glow && 'glow',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

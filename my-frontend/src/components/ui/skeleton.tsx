import React from 'react';
import { cn } from '../../lib/utils'; // Consistency with your other UI components

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rect' }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        // Match your project's specific rounded style
        variant === 'circle' ? 'rounded-full' : 'rounded-xl',
        variant === 'text' ? 'h-3 w-full mb-2' : '',
        className
      )}
    />
  );
};

export default Skeleton;
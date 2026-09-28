import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading data...',
  size = 'md',
  fullHeight = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-8 text-slate-400 ${
        fullHeight ? 'min-h-[60vh]' : ''
      }`}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-500`} />
      {label && <p className="text-sm font-medium text-slate-400 tracking-wide">{label}</p>}
    </div>
  );
};

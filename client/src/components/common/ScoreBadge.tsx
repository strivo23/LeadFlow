import React from 'react';
import { Flame, SunMedium, Snowflake } from 'lucide-react';
import { LeadClassification } from '../../types';

interface ScoreBadgeProps {
  score: number;
  classification?: LeadClassification;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  classification,
  showScore = true,
  size = 'md',
}) => {
  // Determine classification if not directly provided
  const resolvedClass: LeadClassification =
    classification || (score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : 'Cold');

  let style = '';
  let icon = null;

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const badgePaddings = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  if (resolvedClass === 'Hot') {
    style = 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:border-rose-500/60 shadow-sm shadow-rose-950/40';
    icon = <Flame className={`${iconSizes[size]} text-rose-400 fill-rose-500/20`} />;
  } else if (resolvedClass === 'Warm') {
    style = 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-500/60 shadow-sm shadow-amber-950/40';
    icon = <SunMedium className={`${iconSizes[size]} text-amber-400`} />;
  } else {
    style = 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:border-sky-500/60 shadow-sm shadow-sky-950/40';
    icon = <Snowflake className={`${iconSizes[size]} text-sky-400`} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all ${badgePaddings[size]} ${style}`}
      title={`AI Score: ${score}/100 (${resolvedClass})`}
    >
      {icon}
      <span>{resolvedClass}</span>
      {showScore && (
        <span className="opacity-80 font-mono font-semibold ml-0.5 text-[11px]">
          ({score})
        </span>
      )}
    </span>
  );
};

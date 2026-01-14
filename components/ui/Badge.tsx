import React from 'react';
import clsx from 'clsx';
import { IssueSeverity } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warn/10 text-warn border-warn/20",
    error: "bg-danger/10 text-danger border-danger/20",
    neutral: "bg-gray-100 text-gray-600 border-gray-200",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: IssueSeverity }> = ({ severity }) => {
  const map = {
    [IssueSeverity.HIGH]: 'error',
    [IssueSeverity.WARN]: 'warning',
    [IssueSeverity.INFO]: 'info',
  } as const;

  return (
    <Badge variant={map[severity]}>
      {severity}
    </Badge>
  );
};
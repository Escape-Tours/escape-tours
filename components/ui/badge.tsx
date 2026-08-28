import React from 'react';

export function Badge({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${className}`}>
      {children}
    </span>
  );
}
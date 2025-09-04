
import React from 'react';

interface StatusIndicatorProps {
  label: string;
  success: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, success }) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${success ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
             style={{ boxShadow: success ? '0 0 6px #22c55e' : '0 0 6px #ef4444' }}>
        </div>
        <span className={success ? 'text-green-400' : 'text-red-400'}>
          {success ? 'Authenticated' : 'Not Connected'}
        </span>
      </div>
    </div>
  );
};

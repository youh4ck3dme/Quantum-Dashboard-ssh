
import React from 'react';

interface ControlPanelProps {
  title: string;
  children: React.ReactNode;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ title, children }) => {
  return (
    <div className="bg-quantum-panel/70 backdrop-blur-md border border-quantum-border rounded-lg shadow-2xl flex-grow flex flex-col">
      <div className="border-b border-quantum-border px-4 py-2">
        <h3 className="text-lg font-display font-semibold text-quantum-cyan">{title}</h3>
      </div>
      <div className="p-4 flex-grow">
        {children}
      </div>
    </div>
  );
};

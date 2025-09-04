
import React from 'react';
import { IbmQuantumLogo, QiskitLogo } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-quantum-panel/50 backdrop-blur-sm border-b border-quantum-border p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
           <div className="text-quantum-cyan">
            <IbmQuantumLogo />
          </div>
          <div className="text-quantum-cyan">
             <QiskitLogo />
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-quantum-cyan animate-text-focus-in" style={{ textShadow: '0 0 8px rgba(0, 209, 255, 0.7)' }}>
          Quantum AI Command Center
        </h1>
        <div className="hidden md:block w-48"></div>
      </div>
    </header>
  );
};


import React from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-quantum-dark text-gray-200 font-sans scanline-effect">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        Quantum AI Command Center v1.0 | Status: All systems nominal.
      </footer>
    </div>
  );
};

export default App;

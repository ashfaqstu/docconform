import React from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-primary2/30">
      {/* Top Nav */}
      <nav className="h-16 border-b border-white/10 bg-bg/95 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded bg-primary2 flex items-center justify-center text-white shadow-lg group-hover:bg-blue-500 transition-colors">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">DocConform</span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-white font-medium">Jane Doe</p>
                <p className="text-[10px] text-gray-400">Risk Ops Lead</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-gray-300">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-bg py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-subtext">
            © 2024 DocConform Regulatory Solutions. SOC2 Type II Certified.
          </p>
        </div>
      </footer>
    </div>
  );
};
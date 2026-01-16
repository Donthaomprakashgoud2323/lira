
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: 'fa-house', label: 'Home' },
    { view: AppView.CHAT, icon: 'fa-comment-dots', label: 'Connect' },
    { view: AppView.TASKS, icon: 'fa-list-check', label: 'Tasks' },
    { view: AppView.PAMPER, icon: 'fa-spa', label: 'Pamper' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 z-50">
      <nav className="glass rounded-full md:rounded-3xl p-2 md:p-3 flex md:flex-col items-center gap-4 shadow-2xl border-white/50">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
              currentView === item.view 
              ? 'bg-indigo-500 text-white shadow-lg scale-110' 
              : 'text-gray-500 hover:bg-white hover:text-indigo-500'
            }`}
            title={item.label}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

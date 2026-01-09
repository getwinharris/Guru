
import React from 'react';
import { ViewMode } from '../types';
import { 
  HomeIcon,
  GlobeAltIcon, 
  RectangleGroupIcon, 
  ArchiveBoxIcon, 
  CurrencyDollarIcon,
  EllipsisHorizontalIcon,
  BellIcon,
  UserCircleIcon,
  ArrowDownTrayIcon,
  BoltIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, setViewMode, isAdmin }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'discover', label: 'Discover', icon: GlobeAltIcon },
    { id: 'spaces', label: 'Spaces', icon: RectangleGroupIcon },
    { id: 'library', label: 'Library', icon: ArchiveBoxIcon },
    { id: 'finance', label: 'Finance', icon: CurrencyDollarIcon },
  ];

  return (
    <aside className="w-[72px] h-screen bg-[#0d0d0d] border-r border-white/5 flex flex-col items-center py-6 z-[200] fixed left-0 top-0">
      {/* Brand Icon */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-white/20 transition-all cursor-pointer">
          <BoltIcon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 flex flex-col space-y-4">
        <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white">
          <PlusIcon className="w-5 h-5" />
        </button>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id as ViewMode)}
            title={item.label}
            className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-all group ${
              viewMode === item.id 
                ? 'text-white' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            <item.icon className="w-6 h-6 mb-0.5" />
            <span className="text-[8px] font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </button>
        ))}

        <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-all">
          <EllipsisHorizontalIcon className="w-6 h-6" />
        </button>
      </nav>

      {/* Footer Nav */}
      <div className="flex flex-col space-y-6 mt-auto pb-4 items-center">
        <button className="p-2 text-white/40 hover:text-white transition-all relative">
          <BellIcon className="w-6 h-6" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0d0d0d]" />
        </button>
        
        <button onClick={() => setViewMode('billing')} className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-cyan-500 transition-all">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=GuruUser" alt="pfp" className="w-full h-full object-cover" />
        </button>

        <div className="flex flex-col items-center space-y-4 opacity-40">
           <button title="Install App">
             <ArrowDownTrayIcon className="w-5 h-5" />
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

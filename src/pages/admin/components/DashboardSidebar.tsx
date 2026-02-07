import { LayoutDashboard, Code, Award, Mail, Settings, LogOut } from 'lucide-react';

interface DashboardSidebarProps {
  currentPage: string;
  setCurrentPage: (page: 'dashboard' | 'projects' | 'skills' | 'messages' | 'settings') => void;
  onLogout: () => void;
}

export default function DashboardSidebar({ currentPage, setCurrentPage, onLogout }: DashboardSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800 shadow-2xl flex flex-col">
      {/* Logo/Header */}
      <div className="p-4 sm:p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-100">Admin Panel</h1>
            <p className="text-xs text-slate-400">Portfolio Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as any)}
              className={`
                w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 sm:p-4 border-t border-slate-800 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Logout</span>
        </button>
      </div>
    </div>
  );
}
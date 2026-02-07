import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminNavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

export default function AdminNavItem({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  isCollapsed = false,
}: AdminNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white font-medium shadow-lg shadow-blue-500/30'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}
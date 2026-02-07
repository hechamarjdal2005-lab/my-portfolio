import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: number;
  trendLabel: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color,
}: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 via-cyan-600 to-teal-600',
    purple: 'from-purple-600 via-violet-600 to-indigo-600',
    green: 'from-emerald-600 via-green-600 to-teal-600',
    orange: 'from-orange-600 via-amber-600 to-yellow-600',
    red: 'from-red-600 via-rose-600 to-pink-600',
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-xl p-6 border border-slate-800 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400 mb-1 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
        <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', colorClasses[color])}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2 rtl:space-x-reverse">
        {trend >= 0 ? (
          <div className="flex items-center space-x-1 bg-emerald-950 border border-emerald-800 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              {Math.abs(trend)}%
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 bg-red-950 border border-red-800 px-2 py-1 rounded-full">
            <TrendingDown className="h-3 w-3 text-red-400" />
            <span className="text-xs font-medium text-red-400">
              {Math.abs(trend)}%
            </span>
          </div>
        )}
        <span className="text-xs text-slate-500">{trendLabel}</span>
      </div>
    </div>
  );
}
interface DashboardHeaderProps {
  currentPage: string;
}

export default function DashboardHeader({ currentPage }: DashboardHeaderProps) {
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your portfolio statistics',
    },
    projects: {
      title: 'Projects',
      subtitle: 'Manage your portfolio projects',
    },
    skills: {
      title: 'Skills',
      subtitle: 'Manage your technical skills and expertise',
    },
    messages: {
      title: 'Messages',
      subtitle: 'View and manage contact form messages',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your profile and personal information',
    },
  };

  const currentPageInfo = pageTitles[currentPage] || pageTitles.dashboard;

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="pl-12 lg:pl-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100">
            {currentPageInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 hidden sm:block">
            {currentPageInfo.subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
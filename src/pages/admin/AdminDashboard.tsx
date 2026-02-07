import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardStats from './components/DashboardStats';
import ProjectsManager from './components/ProjectsManager';
import SkillsManager from './components/SkillsManager';
import MessagesManager from './components/MessagesManager';
import SettingsManager from './components/SettingsManager';

type AdminPage = 'dashboard' | 'projects' | 'skills' | 'messages' | 'settings';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardStats />;
      case 'projects':
        return <ProjectsManager />;
      case 'skills':
        return <SkillsManager />;
      case 'messages':
        return <MessagesManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardStats />;
    }
  };

  const handlePageChange = (page: AdminPage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <DashboardSidebar 
          currentPage={currentPage} 
          setCurrentPage={handlePageChange}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen bg-slate-950">
        <DashboardHeader currentPage={currentPage} />
        
        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-slate-950">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
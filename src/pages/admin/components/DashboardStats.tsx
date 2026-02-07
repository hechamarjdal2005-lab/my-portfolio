import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Code,
  Mail,
  Database,
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import StatCard from './StatCard';
import { supabase } from '@/lib/supabase';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSkills: 0,
    totalMessages: 0,
    unreadMessages: 0,
    recentProjects: [],
    recentMessages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (projectsError) {
        console.error('Projects error:', projectsError);
      }

      // Get skills count
      const { count: skillsCount, error: skillsError } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true });

      if (skillsError) {
        console.error('Skills error:', skillsError);
      }

      // Get messages count
      const { count: messagesCount, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (messagesError) {
        console.error('Messages count error:', messagesError);
        console.error('Full error details:', JSON.stringify(messagesError, null, 2));
      }

      // Get unread messages count
      const { count: unreadCount, error: unreadError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (unreadError) {
        console.error('Unread messages error:', unreadError);
      }

      // Get recent projects
      const { data: recentProjects, error: recentProjectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentProjectsError) {
        console.error('Recent projects error:', recentProjectsError);
      }

      // Get recent messages with detailed error logging
      const { data: recentMessages, error: recentMessagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentMessagesError) {
        console.error('Recent messages error:', recentMessagesError);
        console.error('Error code:', recentMessagesError.code);
        console.error('Error message:', recentMessagesError.message);
        console.error('Error details:', recentMessagesError.details);
        console.error('Error hint:', recentMessagesError.hint);
        setError(`Failed to load messages: ${recentMessagesError.message}`);
      } else {
        console.log('✅ Recent messages loaded successfully:', recentMessages);
      }

      setStats({
        totalProjects: projectsCount || 0,
        totalSkills: skillsCount || 0,
        totalMessages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
        recentProjects: recentProjects || [],
        recentMessages: recentMessages || [],
      });
    } catch (error: any) {
      console.error('Fatal error fetching stats:', error);
      setError(error.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent mb-4"></div>
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-950 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              className="ml-4 border-red-800 text-red-400 hover:bg-red-900"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={Code}
          trend={12}
          trendLabel="increase this month"
          color="blue"
        />
        <StatCard
          title="Total Skills"
          value={stats.totalSkills}
          icon={Database}
          trend={8}
          trendLabel="increase this month"
          color="purple"
        />
        <StatCard
          title="Total Messages"
          value={stats.totalMessages}
          icon={Mail}
          trend={25}
          trendLabel="increase this month"
          color="green"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={Users}
          trend={-5}
          trendLabel="decrease this month"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="p-6 bg-slate-900 shadow-xl hover:shadow-2xl transition-shadow border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Recent Projects</h3>
            <Button variant="outline" size="sm" className="border-blue-800 text-blue-400 hover:bg-blue-950 hover:text-blue-300 bg-transparent">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {stats.recentProjects.map((project: any) => (
              <div key={project.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800">
                <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-3 rounded-lg shadow-lg shadow-blue-500/20">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-slate-200">{project.title}</h4>
                    <Badge variant={project.featured ? "default" : "secondary"} className={project.featured ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0" : "bg-slate-800 text-slate-400 border-slate-700"}>
                      {project.featured ? "Featured" : "Regular"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(project.created_at).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentProjects.length === 0 && (
              <p className="text-center text-slate-500 py-8">No recent projects</p>
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="p-6 bg-slate-900 shadow-xl hover:shadow-2xl transition-shadow border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Recent Messages</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchStats}
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="border-emerald-800 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300 bg-transparent">
                View All
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {stats.recentMessages.map((message: any) => (
              <div key={message.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-lg shadow-lg shadow-emerald-500/20">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-slate-200">{message.name}</h4>
                    <Badge variant={message.read ? "secondary" : "default"} className={!message.read ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0" : "bg-slate-800 text-slate-400 border-slate-700"}>
                      {message.read ? "Read" : "New"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {message.email} • {new Date(message.created_at).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentMessages.length === 0 && (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">No recent messages</p>
                <p className="text-xs text-slate-600 mt-2">
                  Messages will appear here when received
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
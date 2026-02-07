import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save, 
  Upload, 
  Download, 
  FileText, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AboutStat {
  id: number;
  icon_name: string;
  label: string;
  value: string;
  display_order: number;
}

export default function AboutManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile data
  const [profileData, setProfileData] = useState({
    experience_years: '',
    education: '',
    projects_completed: '',
    location: '',
    about_title: '',
    about_description_1: '',
    about_description_2: '',
    cv_url: '',
    cv_filename: '',
  });

  // About stats cards
  const [stats, setStats] = useState<AboutStat[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setProfileData({
          experience_years: profile.experience_years || '',
          education: profile.education || '',
          projects_completed: profile.projects_completed || '',
          location: profile.location || '',
          about_title: profile.about_title || '',
          about_description_1: profile.about_description_1 || '',
          about_description_2: profile.about_description_2 || '',
          cv_url: profile.cv_url || '',
          cv_filename: profile.cv_filename || '',
        });
      }

      // Fetch about stats
      const { data: statsData, error: statsError } = await supabase
        .from('about_stats')
        .select('*')
        .order('display_order');

      if (statsError) {
        console.error('Stats error:', statsError);
      } else {
        setStats(statsData || []);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const { error: updateError } = await supabase
        .from('profile')
        .update({
          experience_years: profileData.experience_years,
          education: profileData.education,
          projects_completed: profileData.projects_completed,
          location: profileData.location,
          about_title: profileData.about_title,
          about_description_1: profileData.about_description_1,
          about_description_2: profileData.about_description_2,
        })
        .eq('id', 1); // Assuming single profile

      if (updateError) throw updateError;

      setSuccess('About section updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error saving:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `cv_${timestamp}.pdf`;
      const filePath = `${filename}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile with CV URL
      const { error: updateError } = await supabase
        .from('profile')
        .update({
          cv_url: publicUrl,
          cv_filename: file.name,
        })
        .eq('id', 1);

      if (updateError) throw updateError;

      // Save to cv_files table
      const { error: cvError } = await supabase
        .from('cv_files')
        .insert({
          profile_id: 1,
          filename: file.name,
          file_url: publicUrl,
          file_size: file.size,
          is_active: true,
        });

      if (cvError) console.error('CV files table error:', cvError);

      setProfileData(prev => ({
        ...prev,
        cv_url: publicUrl,
        cv_filename: file.name,
      }));

      setSuccess('CV uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error uploading CV:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!confirm('Are you sure you want to delete the CV?')) return;

    try {
      setError('');
      setSuccess('');

      const { error: updateError } = await supabase
        .from('profile')
        .update({
          cv_url: null,
          cv_filename: null,
        })
        .eq('id', 1);

      if (updateError) throw updateError;

      setProfileData(prev => ({
        ...prev,
        cv_url: '',
        cv_filename: '',
      }));

      setSuccess('CV deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error deleting CV:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent mb-4"></div>
            <p className="text-slate-400">Loading about section...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">About Section Manager</h2>
          <p className="text-slate-400 mt-1">Manage your about section and CV</p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          size="sm"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <Alert className="bg-emerald-950 border-emerald-900">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-emerald-400">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-950 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - About Info */}
        <div className="space-y-6">
          {/* Main Info Card */}
          <Card className="p-6 bg-slate-900 border-slate-800">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">About Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="about_title" className="text-slate-300">About Title</Label>
                <Input
                  id="about_title"
                  value={profileData.about_title}
                  onChange={(e) => setProfileData({ ...profileData, about_title: e.target.value })}
                  placeholder="Passionate Developer & Creative Problem Solver"
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="description1" className="text-slate-300">Description (Paragraph 1)</Label>
                <Textarea
                  id="description1"
                  value={profileData.about_description_1}
                  onChange={(e) => setProfileData({ ...profileData, about_description_1: e.target.value })}
                  rows={4}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                  placeholder="First paragraph about yourself..."
                />
              </div>

              <div>
                <Label htmlFor="description2" className="text-slate-300">Description (Paragraph 2)</Label>
                <Textarea
                  id="description2"
                  value={profileData.about_description_2}
                  onChange={(e) => setProfileData({ ...profileData, about_description_2: e.target.value })}
                  rows={4}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                  placeholder="Second paragraph about yourself..."
                />
              </div>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card className="p-6 bg-slate-900 border-slate-800">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience" className="text-slate-300">Experience</Label>
                <Input
                  id="experience"
                  value={profileData.experience_years}
                  onChange={(e) => setProfileData({ ...profileData, experience_years: e.target.value })}
                  placeholder="5+ Years"
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="education" className="text-slate-300">Education</Label>
                <Input
                  id="education"
                  value={profileData.education}
                  onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                  placeholder="CS Degree"
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-slate-300">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="San Francisco"
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="projects" className="text-slate-300">Projects</Label>
                <Input
                  id="projects"
                  value={profileData.projects_completed}
                  onChange={(e) => setProfileData({ ...profileData, projects_completed: e.target.value })}
                  placeholder="50+ Done"
                  className="bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - CV Upload */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 border-slate-800">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CV Management
            </h3>

            {/* Current CV */}
            {profileData.cv_url ? (
              <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium">Current CV</p>
                      <p className="text-sm text-slate-400">{profileData.cv_filename}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(profileData.cv_url, '_blank')}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-950"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteCV}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-8 bg-slate-800 rounded-lg border border-dashed border-slate-700 text-center">
                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No CV uploaded yet</p>
              </div>
            )}

            {/* Upload Button */}
            <div className="space-y-2">
              <Label htmlFor="cv-upload" className="text-slate-300">
                Upload New CV (PDF only, max 5MB)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleCVUpload}
                  disabled={uploading}
                  className="bg-slate-800 border-slate-700 text-slate-200 file:bg-slate-700 file:text-slate-300 file:border-0 file:mr-4"
                />
              </div>
              {uploading && (
                <p className="text-sm text-cyan-400 flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Uploading CV...
                </p>
              )}
            </div>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg h-12"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
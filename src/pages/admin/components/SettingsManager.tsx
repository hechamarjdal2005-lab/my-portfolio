import { useState, useEffect } from 'react';
import { Save, User, Briefcase, Mail, Phone, MapPin, Github, Linkedin, Instagram, Twitter, Image as ImageIcon, AlertCircle, FileText, Download, Trash2, GraduationCap, Award, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile, type ProfileFormData } from '@/pages/hooks/useProfile';
import { supabase } from '@/lib/supabase';

export default function SettingsManager() {
  const { profile, loading, error, updateProfile } = useProfile();
  
  const [formData, setFormData] = useState<Partial<ProfileFormData>>({
    name: '',
    title: '',
    greeting: '',
    description: '',
    photo_url: '',
    github_url: '',
    linkedin_url: '',
    instagram_url: '',
    twitter_url: '',
    email: '',
    phone: '',
    location: '',
    experience_years: 0,
    education: '',
    projects_completed: 0,
    about_title: '',
    about_description_1: '',
    about_description_2: '',
    cv_url: '',
    cv_filename: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        greeting: profile.greeting || 'Hello, I\'m',
        description: profile.description || '',
        photo_url: profile.photo_url || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        instagram_url: profile.instagram_url || '',
        twitter_url: profile.twitter_url || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        experience_years: profile.experience_years || 0,
        education: profile.education || '',
        projects_completed: profile.projects_completed || 0,
        about_title: profile.about_title || '',
        about_description_1: profile.about_description_1 || '',
        about_description_2: profile.about_description_2 || '',
        cv_url: profile.cv_url || '',
        cv_filename: profile.cv_filename || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setSuccessMessage('');
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccessMessage('Profile updated successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      alert('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSave = async (section: 'basic' | 'social' | 'contact' | 'about') => {
    setSubmitting(true);
    setSuccessMessage('');
    
    let dataToUpdate: Partial<ProfileFormData> = {};
    
    if (section === 'basic') {
      dataToUpdate = {
        name: formData.name,
        title: formData.title,
        greeting: formData.greeting,
        description: formData.description,
        photo_url: formData.photo_url,
      };
    } else if (section === 'social') {
      dataToUpdate = {
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        instagram_url: formData.instagram_url,
        twitter_url: formData.twitter_url,
      };
    } else if (section === 'contact') {
      dataToUpdate = {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      };
    } else if (section === 'about') {
      dataToUpdate = {
        about_title: formData.about_title,
        about_description_1: formData.about_description_1,
        about_description_2: formData.about_description_2,
        experience_years: formData.experience_years,
        education: formData.education,
        projects_completed: formData.projects_completed,
      };
    }
    
    const result = await updateProfile(dataToUpdate);
    
    if (result.success) {
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} info saved! ✅`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert(result.error || 'Failed to save');
    }
    
    setSubmitting(false);
  };

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      setSuccessMessage('');

      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filename = `photo_${timestamp}.${fileExt}`;
      const filePath = `photos/${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio-cvs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-cvs')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile with new photo URL
      const result = await updateProfile({
        photo_url: publicUrl,
      });

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          photo_url: publicUrl,
        }));
        setSuccessMessage('Photo uploaded successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Delete Photo
  const handleDeletePhoto = async () => {
    if (!confirm('Are you sure you want to delete the profile photo?')) return;

    try {
      setSuccessMessage('');

      // Delete from storage if exists
      if (formData.photo_url && formData.photo_url.includes('portfolio-cvs')) {
        const urlParts = formData.photo_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const filePath = `photos/${filename}`;

        await supabase.storage
          .from('portfolio-cvs')
          .remove([filePath]);
      }

      const result = await updateProfile({
        photo_url: '',
      });

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          photo_url: '',
        }));
        setSuccessMessage('Photo deleted successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      alert(err.message);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setSuccessMessage('');

      const timestamp = Date.now();
      const filename = `cv_${timestamp}.pdf`;
      const filePath = `cvs/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-cvs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('portfolio-cvs')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const result = await updateProfile({
        cv_url: publicUrl,
        cv_filename: file.name,
      });

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          cv_url: publicUrl,
          cv_filename: file.name,
        }));
        setSuccessMessage('CV uploaded successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      console.error('Error uploading CV:', err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!confirm('Are you sure you want to delete the CV?')) return;

    try {
      setSuccessMessage('');

      // Delete from storage if exists
      if (formData.cv_url) {
        const urlParts = formData.cv_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const filePath = `cvs/${filename}`;

        await supabase.storage
          .from('portfolio-cvs')
          .remove([filePath]);
      }

      const result = await updateProfile({
        cv_url: '',
        cv_filename: '',
      });

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          cv_url: '',
          cv_filename: '',
        }));
        setSuccessMessage('CV deleted successfully! ✅');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      console.error('Error deleting CV:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
          <p className="text-slate-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Profile Settings</h2>
        <p className="text-sm sm:text-base text-slate-400 mt-1">Manage your personal information, social links, about section and CV</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-emerald-950 border-emerald-900 text-emerald-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-950 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-4 sm:space-y-6">
          {/* FIXED: TabsList avec scroll horizontal sur mobile */}
          <div className="w-full overflow-x-auto">
            <TabsList className="bg-slate-900/50 border border-slate-700 inline-flex min-w-full sm:grid sm:grid-cols-4 gap-1.5 p-1.5 rounded-lg backdrop-blur-sm">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs sm:text-sm transition-all duration-200 rounded-md py-2.5 px-4 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Basic</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="social" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs sm:text-sm transition-all duration-200 rounded-md py-2.5 px-4 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>Social</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/30 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs sm:text-sm transition-all duration-200 rounded-md py-2.5 px-4 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="about" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs sm:text-sm transition-all duration-200 rounded-md py-2.5 px-4 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                <span>About</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="mt-6">
            <Card className="p-4 sm:p-6 bg-slate-900 border-slate-800">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">Basic Information</h3>
                  <Button
                    type="button"
                    onClick={() => handleQuickSave('basic')}
                    disabled={submitting}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Save Basic Info</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="greeting" className="text-slate-300 text-sm">Greeting Text</Label>
                    <Input
                      id="greeting"
                      value={formData.greeting}
                      onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                      placeholder="Hello, I'm"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-slate-300 text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="John Doe"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-slate-300 text-sm">Professional Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      placeholder="Full Stack Developer"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-slate-300 text-sm">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={4}
                      placeholder="A brief description about yourself..."
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  {/* Photo Upload Section */}
                  <div className="md:col-span-2">
                    <Label className="text-slate-300 flex items-center gap-2 mb-3 text-sm">
                      <ImageIcon className="h-4 w-4" />
                      Profile Photo
                    </Label>

                    {formData.photo_url ? (
                      <div className="mb-4 p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <img 
                            src={formData.photo_url} 
                            alt="Profile preview" 
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-cyan-500/30"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23334155" width="96" height="96" rx="48"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 font-medium text-sm sm:text-base">Current Photo</p>
                            <p className="text-xs sm:text-sm text-slate-400">Click delete to remove or upload new to replace</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDeletePhoto}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950 w-full sm:w-auto text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4 p-6 sm:p-8 bg-slate-800 rounded-lg border border-dashed border-slate-700 text-center">
                        <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No photo uploaded yet</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="photo-upload" className="text-slate-300 text-sm">
                        Upload Photo (JPG, PNG, WEBP - max 5MB)
                      </Label>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="bg-slate-800 border-slate-700 text-slate-200 text-xs sm:text-sm file:bg-gradient-to-r file:from-cyan-600 file:to-blue-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:font-medium hover:file:from-cyan-700 hover:file:to-blue-700"
                      />
                      {uploadingPhoto && (
                        <p className="text-xs sm:text-sm text-cyan-400 flex items-center gap-2">
                          <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-cyan-500 border-r-transparent"></div>
                          Uploading photo...
                        </p>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-blue-950/30 border border-blue-900/30 rounded-lg">
                      <p className="text-xs text-blue-400">
                        💡 <strong>Tip:</strong> For best results, use a square image (e.g., 500x500px) with a transparent background or solid color.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="mt-6">
            <Card className="p-4 sm:p-6 bg-slate-900 border-slate-800">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">Social Media Links</h3>
                  <Button
                    type="button"
                    onClick={() => handleQuickSave('social')}
                    disabled={submitting}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Save Social Links</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="github_url" className="text-slate-300 flex items-center gap-2 text-sm">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Label>
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                      placeholder="https://github.com/username"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin_url" className="text-slate-300 flex items-center gap-2 text-sm">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram_url" className="text-slate-300 flex items-center gap-2 text-sm">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram_url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                      placeholder="https://instagram.com/username"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter_url" className="text-slate-300 flex items-center gap-2 text-sm">
                      <Twitter className="h-4 w-4" />
                      Twitter/X
                    </Label>
                    <Input
                      id="twitter_url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                      placeholder="https://twitter.com/username"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="mt-6">
            <Card className="p-4 sm:p-6 bg-slate-900 border-slate-800">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">Contact Information</h3>
                  <Button
                    type="button"
                    onClick={() => handleQuickSave('contact')}
                    disabled={submitting}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Save Contact Info</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="email" className="text-slate-300 flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="hello@example.com"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 234 567 890"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="location" className="text-slate-300 flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="San Francisco, CA"
                      className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* About & CV Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column - About Section */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="p-4 sm:p-6 bg-slate-900 border-slate-800">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-4">About Section</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="about_title" className="text-slate-300 text-sm">About Title</Label>
                      <Input
                        id="about_title"
                        value={formData.about_title}
                        onChange={(e) => setFormData({...formData, about_title: e.target.value})}
                        placeholder="Passionate Developer & Creative Problem Solver"
                        className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="about_desc_1" className="text-slate-300 text-sm">Description (Paragraph 1)</Label>
                      <Textarea
                        id="about_desc_1"
                        value={formData.about_description_1}
                        onChange={(e) => setFormData({...formData, about_description_1: e.target.value})}
                        rows={4}
                        className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                        placeholder="First paragraph about yourself..."
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="about_desc_2" className="text-slate-300 text-sm">Description (Paragraph 2)</Label>
                      <Textarea
                        id="about_desc_2"
                        value={formData.about_description_2}
                        onChange={(e) => setFormData({...formData, about_description_2: e.target.value})}
                        rows={4}
                        className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                        placeholder="Second paragraph about yourself..."
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 bg-slate-900 border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100">Quick Stats</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_years" className="text-slate-300 flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4" />
                        Experience (Years)
                      </Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})}
                        placeholder="5"
                        className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="projects_completed" className="text-slate-300 text-sm">Projects Completed</Label>
                      <Input
                        id="projects_completed"
                        type="number"
                        value={formData.projects_completed}
                        onChange={(e) => setFormData({...formData, projects_completed: parseInt(e.target.value) || 0})}
                        placeholder="50"
                        className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                        disabled={submitting}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="education" className="text-slate-300 flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </Label>
                      <Input
                        id="education"
                        value={formData.education}
                        onChange={(e) => setFormData({...formData, education: e.target.value})}
                        placeholder="Bachelor's in Computer Science"
                        className="bg-slate-800 border-slate-700 text-slate-200 mt-1.5"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - CV Upload */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="p-4 sm:p-6 bg-slate-900 border-slate-800">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    CV Management
                  </h3>

                  {formData.cv_url ? (
                    <div className="mb-4 p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex-shrink-0">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-200 font-medium text-sm sm:text-base">Current CV</p>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">{formData.cv_filename}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(formData.cv_url, '_blank')}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-950 flex-1 sm:flex-initial text-xs sm:text-sm"
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">Download</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteCV}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950 flex-1 sm:flex-initial text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-6 sm:p-8 bg-slate-800 rounded-lg border border-dashed border-slate-700 text-center">
                      <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No CV uploaded yet</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="cv-upload" className="text-slate-300 text-sm">
                      Upload New CV (PDF only, max 5MB)
                    </Label>
                    <Input
                      id="cv-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleCVUpload}
                      disabled={uploading}
                      className="bg-slate-800 border-slate-700 text-slate-200 text-xs sm:text-sm file:bg-gradient-to-r file:from-orange-600 file:to-red-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:font-medium hover:file:from-orange-700 hover:file:to-red-700"
                    />
                    {uploading && (
                      <p className="text-xs sm:text-sm text-cyan-400 flex items-center gap-2">
                        <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-cyan-500 border-r-transparent"></div>
                        Uploading CV...
                      </p>
                    )}
                  </div>
                </Card>

                <Button
                  type="button"
                  onClick={() => handleQuickSave('about')}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Save About & Stats</span>
                  <span className="sm:hidden">Save</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Main Save Button */}
        <div className="flex justify-end mt-4 sm:mt-6">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg px-6 sm:px-8 w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
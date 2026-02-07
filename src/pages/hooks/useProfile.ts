import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: number;
  name: string;
  title: string;
  greeting: string;
  description: string;
  photo_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  experience_years: number | null;
  education: string | null;
  projects_completed: number | null;
  about_title: string | null;
  about_description_1: string | null;
  about_description_2: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  title: string;
  greeting: string;
  description: string;
  photo_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  twitter_url: string;
  email: string;
  phone: string;
  location: string;
  cv_url: string;
  cv_filename: string;
  experience_years: number;
  education: string;
  projects_completed: number;
  about_title: string;
  about_description_1: string;
  about_description_2: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile from Supabase
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
    try {
      setError(null);

      if (!profile) {
        throw new Error('No profile loaded');
      }

      // Clean and prepare data
      const cleanData: any = {};
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          cleanData[key] = typeof value === 'string' ? value.trim() : value;
        }
      });

      const { data, error: updateError } = await supabase
        .from('profile')
        .update(cleanData)
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Update local state
      setProfile(data);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    }
  }, [profile]);

  // Update single field
  const updateField = useCallback(async (field: keyof ProfileFormData, value: string | number) => {
    return updateProfile({ [field]: value });
  }, [updateProfile]);

  // Update social links
  const updateSocialLinks = useCallback(async (socialData: {
    github_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    email?: string;
  }) => {
    return updateProfile(socialData);
  }, [updateProfile]);

  // Update basic info
  const updateBasicInfo = useCallback(async (basicData: {
    name?: string;
    title?: string;
    greeting?: string;
    description?: string;
  }) => {
    return updateProfile(basicData);
  }, [updateProfile]);

  // Update about section
  const updateAboutSection = useCallback(async (aboutData: {
    about_title?: string;
    about_description_1?: string;
    about_description_2?: string;
    experience_years?: number;
    education?: string;
    projects_completed?: number;
  }) => {
    return updateProfile(aboutData);
  }, [updateProfile]);

  // Update CV
  const updateCV = useCallback(async (cvData: {
    cv_url?: string;
    cv_filename?: string;
  }) => {
    return updateProfile(cvData);
  }, [updateProfile]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateField,
    updateSocialLinks,
    updateBasicInfo,
    updateAboutSection,
    updateCV,
  };
};
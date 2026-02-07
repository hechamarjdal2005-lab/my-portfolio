import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  tags: string;
  live_url: string;
  github_url: string;
  featured: boolean;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from Supabase
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new project
  const addProject = useCallback(async (projectData: ProjectFormData) => {
    try {
      setError(null);

      // Process tags and URLs
      const processedData = {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        image: projectData.image.trim(),
        tags: projectData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        live_url: projectData.live_url.trim() || null,
        github_url: projectData.github_url.trim() || null,
        featured: projectData.featured,
      };

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert([processedData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      // Update local state
      setProjects(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error adding project:', err);
      setError(err.message || 'Failed to add project');
      return { success: false, error: err.message };
    }
  }, []);

  // Update existing project
  const updateProject = useCallback(async (id: number, projectData: ProjectFormData) => {
    try {
      setError(null);

      // Process tags and URLs
      const processedData = {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        image: projectData.image.trim(),
        tags: projectData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        live_url: projectData.live_url.trim() || null,
        github_url: projectData.github_url.trim() || null,
        featured: projectData.featured,
      };

      const { data, error: updateError } = await supabase
        .from('projects')
        .update(processedData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === id ? data : project
      ));
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(err.message || 'Failed to update project');
      return { success: false, error: err.message };
    }
  }, []);

  // Delete project
  const deleteProject = useCallback(async (id: number) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Update local state
      setProjects(prev => prev.filter(project => project.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
      return { success: false, error: err.message };
    }
  }, []);

  // Toggle featured status
  const toggleFeatured = useCallback(async (id: number) => {
    try {
      setError(null);

      const project = projects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');

      const { data, error: updateError } = await supabase
        .from('projects')
        .update({ featured: !project.featured })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Toggle featured error:', updateError);
        throw updateError;
      }

      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === id ? data : p
      ));
      return { success: true, data };
    } catch (err: any) {
      console.error('Error toggling featured:', err);
      setError(err.message || 'Failed to toggle featured status');
      return { success: false, error: err.message };
    }
  }, [projects]);

  // Get featured projects
  const featuredProjects = useCallback(() => {
    return projects.filter(project => project.featured);
  }, [projects]);

  // Get regular projects
  const regularProjects = useCallback(() => {
    return projects.filter(project => !project.featured);
  }, [projects]);

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    featuredProjects,
    regularProjects,
  };
};
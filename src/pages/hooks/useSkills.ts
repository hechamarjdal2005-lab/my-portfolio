import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  created_at: string;
}

export interface SkillFormData {
  name: string;
  category: string;
  level: number;
}

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch skills from Supabase
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      setSkills(data || []);
    } catch (err: any) {
      console.error('Error fetching skills:', err);
      setError(err.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new skill
  const addSkill = useCallback(async (skillData: SkillFormData) => {
    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('skills')
        .insert([skillData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      // Update local state
      setSkills(prev => [...prev, data]);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error adding skill:', err);
      setError(err.message || 'Failed to add skill');
      return { success: false, error: err.message };
    }
  }, []);

  // Update existing skill
  const updateSkill = useCallback(async (id: number, skillData: SkillFormData) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Update local state
      setSkills(prev => prev.map(skill => 
        skill.id === id ? data : skill
      ));
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating skill:', err);
      setError(err.message || 'Failed to update skill');
      return { success: false, error: err.message };
    }
  }, []);

  // Delete skill
  const deleteSkill = useCallback(async (id: number) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Update local state
      setSkills(prev => prev.filter(skill => skill.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      setError(err.message || 'Failed to delete skill');
      return { success: false, error: err.message };
    }
  }, []);

  // Group skills by category
  const groupedSkills = useCallback(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  }, [skills]);

  // Initial fetch
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    skills,
    loading,
    error,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    groupedSkills,
  };
};
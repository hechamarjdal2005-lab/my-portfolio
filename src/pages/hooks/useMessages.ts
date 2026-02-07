import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string | number) => {
    try {
      const message = messages.find((m) => m.id === id);
      if (!message) {
        return { success: false, error: 'Message not found' };
      }

      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ read: !message.read })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchMessages();
      return { success: true };
    } catch (err: any) {
      console.error('Error toggling read status:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteMessage = async (id: string | number) => {
    try {
      const { error: deleteError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchMessages();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting message:', err);
      return { success: false, error: err.message };
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('read', false);

      if (updateError) throw updateError;

      await fetchMessages();
      return { success: true };
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      return { success: false, error: err.message };
    }
  };

  const unreadCount = () => {
    return messages.filter((m) => !m.read).length;
  };

  return {
    messages,
    loading,
    error,
    toggleRead,
    deleteMessage,
    markAllAsRead,
    unreadCount,
    refetch: fetchMessages,
  };
};
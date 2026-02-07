import { useState } from 'react';
import { Mail, Trash2, Eye, CheckCircle, Clock, AlertCircle, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMessages, type Message } from '@/pages/hooks/useMessages';

export default function MessagesManager() {
  const {
    messages,
    loading,
    error,
    toggleRead,
    deleteMessage,
    markAllAsRead,
    unreadCount,
  } = useMessages();

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const handleMarkAsRead = async (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await toggleRead(id);
    if (!result.success) {
      alert(result.error || 'Failed to update message');
    }
  };

  const handleDelete = async (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const result = await deleteMessage(id);
    if (!result.success) {
      alert(result.error || 'Failed to delete message');
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // Mark as read when viewing
    if (!message.read) {
      toggleRead(message.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount() === 0) {
      alert('No unread messages');
      return;
    }
    
    if (!confirm(`Mark all ${unreadCount()} messages as read?`)) return;
    
    const result = await markAllAsRead();
    if (!result.success) {
      alert(result.error || 'Failed to mark all as read');
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage) return;
    
    if (!replyMessage.trim()) {
      alert('Please write a reply message');
      return;
    }

    // Here you would typically send an email via API
    // For now, we'll just show a success message
    const mailtoLink = `mailto:${selectedMessage.email}?subject=Re: Contact Form Message&body=${encodeURIComponent(replyMessage)}`;
    window.open(mailtoLink, '_blank');
    
    setReplyMessage('');
    setIsViewDialogOpen(false);
    alert('Email client opened. Please send your reply.');
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Messages</h2>
          <p className="text-slate-400 mt-1">Manage contact form messages</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount() > 0 && (
            <>
              <Badge className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white text-sm px-4 py-2 border-0 shadow-lg shadow-red-500/30">
                <Mail className="h-3 w-3 mr-1" />
                {unreadCount()} unread
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <MailCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-950 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
          <p className="text-slate-400 mt-4">Loading messages...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Messages List */}
          {messages.map((message) => (
            <Card 
              key={message.id} 
              className={`
                p-6 hover:shadow-2xl transition-all duration-300 bg-slate-900 border-l-4 cursor-pointer
                ${!message.read 
                  ? 'border-l-blue-500 bg-gradient-to-r from-blue-950/30 to-transparent hover:from-blue-950/40' 
                  : 'border-l-slate-700 hover:border-l-slate-600'
                }
              `}
              onClick={() => handleViewMessage(message)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Message Info */}
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-3 rounded-lg shadow-lg flex-shrink-0 ${
                    !message.read 
                      ? 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 shadow-blue-500/30' 
                      : 'bg-gradient-to-br from-slate-700 to-slate-600'
                  }`}>
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-100 truncate">
                        {message.name}
                      </h3>
                      {!message.read && (
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate mb-2">
                      {message.email}
                    </p>
                    <p className="text-slate-300 line-clamp-2 text-sm">
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* Timestamp & Actions */}
                <div className="flex flex-col sm:items-end gap-3">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">
                      {new Date(message.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {!message.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleMarkAsRead(message.id, e)}
                        className="bg-emerald-950 text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300 border border-emerald-800 h-8"
                      >
                        <CheckCircle className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Read</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMessage(message);
                      }}
                      className="bg-blue-950 text-blue-400 hover:bg-blue-900 hover:text-blue-300 border border-blue-800 h-8"
                    >
                      <Eye className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(message.id, e)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950 border border-red-800 h-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800">
              <Mail className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No messages yet</p>
              <p className="text-slate-500 text-sm mt-2">
                Messages from your contact form will appear here
              </p>
            </div>
          )}
        </div>
      )}

      {/* View & Reply Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Message Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              From {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4 mt-4">
              {/* Message Info Card */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">From</p>
                    <p className="text-slate-200 font-medium">{selectedMessage.name}</p>
                  </div>
                  <Badge variant={selectedMessage.read ? "secondary" : "default"} 
                    className={selectedMessage.read 
                      ? "bg-slate-700 text-slate-300" 
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0"
                    }
                  >
                    {selectedMessage.read ? 'Read' : 'Unread'}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-slate-200">
                    {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {/* Original Message */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400 mb-3 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Message:
                </p>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              
              {/* Reply Section */}
              <div>
                <Label htmlFor="reply" className="text-slate-300 flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4" />
                  Your Reply (Optional)
                </Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  placeholder="Write your reply here... (This will open your email client)"
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div className="flex gap-2">
                  {!selectedMessage.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        handleMarkAsRead(selectedMessage.id, e);
                      }}
                      className="border-emerald-700 text-emerald-400 hover:bg-emerald-950"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      setReplyMessage('');
                    }}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Close
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSendReply}
                    className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
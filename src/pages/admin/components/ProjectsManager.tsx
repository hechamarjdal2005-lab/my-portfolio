import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Code, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProjects, type Project, type ProjectFormData } from '@/pages/hooks/useProjects';

export default function ProjectsManager() {
  const {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
  } = useProjects();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image: '',
    tags: '',
    live_url: '',
    github_url: '',
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.image.trim()) {
      alert('Please fill in all required fields (Title, Description, Image)');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (editingProject) {
        result = await updateProject(editingProject.id, formData);
      } else {
        result = await addProject(formData);
      }

      if (result.success) {
        setIsDialogOpen(false);
        resetForm();
      } else {
        alert(result.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      alert('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const result = await deleteProject(id);
    if (!result.success) {
      alert(result.error || 'Failed to delete project');
    }
  };

  const handleToggleFeatured = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await toggleFeatured(id);
    if (!result.success) {
      alert(result.error || 'Failed to toggle featured status');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      featured: project.featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: '',
      live_url: '',
      github_url: '',
      featured: false,
    });
    setEditingProject(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Projects Manager</h2>
          <p className="text-slate-400 mt-1">Add, edit and delete your projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-100">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingProject ? 'Edit the project details' : 'Enter the new project details'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title" className="text-slate-300">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g. Portfolio Website"
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    disabled={submitting}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description" className="text-slate-300">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={3}
                    placeholder="Describe your project..."
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    disabled={submitting}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="image" className="text-slate-300">Image URL *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    disabled={submitting}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="tags" className="text-slate-300">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="React, TypeScript, Tailwind CSS"
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="live_url" className="text-slate-300">Live URL</Label>
                  <Input
                    id="live_url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({...formData, live_url: e.target.value})}
                    placeholder="https://project-demo.com"
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="github_url" className="text-slate-300">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    placeholder="https://github.com/username/repo"
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    disabled={submitting}
                  />
                </div>
                
                <div className="col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900"
                    disabled={submitting}
                  />
                  <Label htmlFor="featured" className="text-slate-300 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Featured Project
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingProject ? 'Update' : 'Add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-950 border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
          <p className="text-slate-400 mt-4">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group relative p-6 hover:shadow-2xl transition-all duration-300 border-slate-800 bg-slate-900 hover:border-slate-700 overflow-hidden"
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Project Image Preview */}
              {project.image && (
                <div className="mb-4 rounded-lg overflow-hidden bg-slate-800 h-40">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23334155" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-100 line-clamp-1">
                    {project.title}
                  </h3>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleToggleFeatured(project.id, e)}
                    className={`h-8 w-8 ${project.featured ? 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-950' : 'text-slate-500 hover:text-yellow-500 hover:bg-yellow-950'}`}
                    title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(project)}
                    className="h-8 w-8 hover:bg-blue-950 text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="border-cyan-800 text-cyan-400 bg-cyan-950/30 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Links */}
              <div className="flex space-x-3 pt-4 border-t border-slate-800">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center font-medium transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-300 text-sm flex items-center font-medium transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    GitHub
                  </a>
                )}
              </div>
              
              <p className="text-xs text-slate-500 mt-4">
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </Card>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Code className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No projects yet</p>
              <p className="text-slate-500 text-sm mt-2">Click "Add Project" to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
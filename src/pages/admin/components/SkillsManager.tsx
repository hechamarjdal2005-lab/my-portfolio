import { useState } from 'react';
import { Plus, Edit, Trash2, Award, AlertCircle, Code2 } from 'lucide-react';
import * as SiIcons from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSkills, type Skill, type SkillFormData } from '@/pages/hooks/useSkills';
import { getSmartIconSuggestions, type TechIcon } from '@/lib/techIconSuggestions';

// Extended form data with icon info
interface ExtendedSkillFormData extends SkillFormData {
  iconName?: string; // Icon name from react-icons/si (e.g., "SiReact")
  iconColor?: string; // Color for the icon
}

export default function SkillsManager() {
  const { 
    skills, 
    loading, 
    error, 
    addSkill, 
    updateSkill, 
    deleteSkill, 
    groupedSkills 
  } = useSkills();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<ExtendedSkillFormData>({
    name: '',
    category: '',
    level: 50,
    iconName: '',
    iconColor: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Render icon from react-icons/si
  const renderIcon = (iconName: string, color: string, className = "h-4 w-4") => {
    const IconComponent = (SiIcons as any)[iconName];
    if (!IconComponent) {
      return <Award className={className} style={{ color }} />;
    }
    return <IconComponent className={className} style={{ color }} />;
  };

  // Get icon from skill data
  const getSkillIcon = (skill: any, className = "h-4 w-4") => {
    if (skill.icon) {
      try {
        const iconData = JSON.parse(skill.icon);
        if (iconData.iconName && iconData.color) {
          return renderIcon(iconData.iconName, iconData.color, className);
        }
      } catch (e) {
        // Fallback if JSON parsing fails
      }
    }
    return <Award className={className} />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare icon data to save
      const iconData = formData.iconName ? JSON.stringify({
        iconName: formData.iconName,
        color: formData.iconColor || '#ffffff',
      }) : '';

      const skillData = {
        name: formData.name,
        category: formData.category,
        level: formData.level,
        icon: iconData,
      };

      let result;
      if (editingSkill) {
        result = await updateSkill(editingSkill.id, skillData);
      } else {
        result = await addSkill(skillData);
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
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    const result = await deleteSkill(id);
    if (!result.success) {
      alert(result.error || 'Failed to delete skill');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    
    // Parse existing icon data
    let iconName = '';
    let iconColor = '';
    
    if ((skill as any).icon) {
      try {
        const iconData = JSON.parse((skill as any).icon);
        iconName = iconData.iconName || '';
        iconColor = iconData.color || '';
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      iconName,
      iconColor,
    });
    setIsDialogOpen(true);
  };

  const handleSelectIcon = (techIcon: TechIcon) => {
    setFormData({
      ...formData,
      iconName: techIcon.iconName,
      iconColor: techIcon.color,
    });
    setShowIconPicker(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: 50,
      iconName: '',
      iconColor: '',
    });
    setEditingSkill(null);
    setShowIconPicker(false);
  };

  const categoryColors: Record<string, string> = {
    'Frontend': 'from-blue-600 via-cyan-600 to-teal-600',
    'Backend': 'from-purple-600 via-violet-600 to-indigo-600',
    'Database': 'from-emerald-600 via-green-600 to-teal-600',
    'DevOps': 'from-orange-600 via-amber-600 to-yellow-600',
    'Tools': 'from-rose-600 via-pink-600 to-fuchsia-600',
  };

  // Icon Picker Component
  const IconPicker = () => {
    const suggestions = getSmartIconSuggestions(formData.name, 12);

    return (
      <div className="space-y-4 mt-3">
        {/* Smart Suggestions with REAL logos */}
        <div>
          <label className="text-sm font-medium mb-3 block text-slate-300">
            🎯 Suggestions for "{formData.name || '...'}"
          </label>
          <div className="grid grid-cols-4 gap-3">
            {suggestions.map((techIcon, idx) => {
              const isSelected = formData.iconName === techIcon.iconName;
              
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectIcon(techIcon)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/30"
                      : "border-slate-700 hover:border-cyan-500/50 bg-slate-800"
                  }`}
                  title={techIcon.name}
                >
                  <div className="flex flex-col items-center gap-2">
                    {renderIcon(techIcon.iconName, techIcon.color, "h-8 w-8 mx-auto")}
                    <span className="text-xs text-slate-400 text-center truncate w-full">
                      {techIcon.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info message */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            ✨ <strong>Real logos!</strong> These are the actual brand icons for each technology.
            <br />
            💡 Just type the skill name and we'll find the perfect logo automatically!
          </p>
        </div>
      </div>
    );
  };

  // Preview current selected icon
  const IconPreview = () => {
    if (!formData.iconName) return null;

    return (
      <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-2 bg-slate-700 rounded">
          {renderIcon(formData.iconName, formData.iconColor || '#ffffff', "h-6 w-6")}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-300 font-medium">
            {formData.iconName.replace('Si', '')}
          </p>
          <p className="text-xs text-slate-500">
            Real Logo
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFormData({...formData, iconName: '', iconColor: ''})}
          className="text-red-400 hover:text-red-300 hover:bg-red-950"
        >
          Clear
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Skills Manager</h2>
          <p className="text-slate-400 mt-1">Add, edit and delete your technical skills with real logos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-100">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingSkill ? 'Edit the skill details' : 'Enter the new skill details - real logos will be suggested automatically!'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Skill Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g. React, Python, Docker, TypeScript..."
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                  disabled={submitting}
                />
                <p className="text-xs text-slate-500 mt-1">
                  💡 Type any technology name to get its real logo automatically
                </p>
              </div>

              {/* Icon Preview */}
              <IconPreview />

              {/* Icon Selection */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/50"
                  disabled={submitting}
                >
                  {formData.iconName ? '✏️ Change Logo' : '🎨 Choose Logo'}
                </Button>

                {showIconPicker && <IconPicker />}
              </div>
              
              <div>
                <Label htmlFor="category" className="text-slate-300">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                  disabled={submitting}
                  required
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="level" className="text-slate-300">
                  Proficiency Level: {formData.level}%
                </Label>
                <input
                  type="range"
                  id="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
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
                  className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingSkill ? 'Update' : 'Add')}
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
          <p className="text-slate-400 mt-4">Loading skills...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills()).map(([category, categorySkills]) => (
            <Card key={category} className="p-6 bg-slate-900 shadow-xl border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${categoryColors[category] || 'from-gray-500 to-gray-600'}`}></div>
                  <h3 className="text-xl font-bold text-slate-100">{category}</h3>
                  <Badge variant="secondary" className="bg-slate-800 text-cyan-400 border-slate-700">
                    {categorySkills.length} skills
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:shadow-lg hover:border-slate-600 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryColors[category] || 'from-gray-500 to-gray-600'} shadow-lg`}>
                          {getSkillIcon(skill, "h-5 w-5")}
                        </div>
                        <h4 className="font-semibold text-slate-200">{skill.name}</h4>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(skill)}
                          className="h-8 w-8 hover:bg-blue-950 text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(skill.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Proficiency</span>
                        <span className="font-semibold text-slate-200">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${categoryColors[category] || 'from-gray-500 to-gray-600'} rounded-full transition-all duration-500`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          
          {skills.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No skills yet</p>
              <p className="text-slate-500 text-sm mt-2">Click "Add Skill" to get started with real technology logos!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
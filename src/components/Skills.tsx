import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import * as SiIcons from 'react-icons/si';
import { Award, ChevronDown } from 'lucide-react';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Skill {
  id: number;
  name: string;
  icon: string; // JSON string with iconName and color
  category: string;
  level: number;
  color: string;
  order_index: number;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAll, setShowAll] = useState(false);

  // Categories for filtering
  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

  // Category colors
  const categoryColors: Record<string, string> = {
    'Frontend': '#61DAFB',
    'Backend': '#8B5CF6',
    'Database': '#10B981',
    'DevOps': '#F59E0B',
    'Tools': '#EC4899',
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false }) // Sort by level (highest first)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching skills:', error);
      } else {
        setSkills(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter skills based on selected category
  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  // Show only first 10 if showAll is false
  const displayedSkills = showAll ? filteredSkills : filteredSkills.slice(0, 10);

  // Check if we need "View All" button
  const hasMore = filteredSkills.length > 10;

  // Render REAL icon from react-icons/si
  const renderSkillIcon = (skill: Skill) => {
    try {
      // Parse the icon JSON data
      const iconData = JSON.parse(skill.icon);
      
      if (iconData.iconName && iconData.color) {
        // Get the icon component from react-icons/si
        const IconComponent = (SiIcons as any)[iconData.iconName];
        
        if (IconComponent) {
          return (
            <IconComponent
              className="w-12 h-12"
              style={{ 
                color: iconData.color,
                filter: `drop-shadow(0 0 8px ${iconData.color}40)` // Glow effect
              }}
            />
          );
        }
      }
    } catch (e) {
      // If parsing fails or icon not found, try to use the icon field as emoji
      if (skill.icon && !skill.icon.startsWith('{')) {
        return <span className="text-5xl">{skill.icon}</span>;
      }
    }
    
    // Fallback to default icon
    return <Award className="w-12 h-12 text-primary" />;
  };

  if (loading) {
    return (
      <section id="skills" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading skills...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
          <div className="w-20 h-1 gradient-bg rounded-full mx-auto mt-4" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const categoryColor = categoryColors[category] || '#64748b';
            
            return (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowAll(false); // Reset to first 10 when changing category
                }}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  isSelected
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-card hover:bg-accent text-muted-foreground hover:text-foreground border border-border'
                }`}
                style={
                  isSelected
                    ? {
                        background: `linear-gradient(135deg, ${categoryColor}dd, ${categoryColor}99)`,
                        boxShadow: `0 0 20px ${categoryColor}40`,
                      }
                    : {}
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
                {category !== 'All' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({skills.filter(s => s.category === category).length})
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {displayedSkills.map((skill, index) => {
              const categoryColor = categoryColors[skill.category] || '#64748b';
              
              return (
                <motion.div
                  key={skill.id}
                  className="skill-card group cursor-pointer relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {/* Hover gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${categoryColor}80, ${categoryColor}40)`
                    }}
                  />
                  
                  <div className="relative text-center">
                    {/* Icon */}
                    <motion.div
                      className="mb-4 flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {renderSkillIcon(skill)}
                    </motion.div>

                    {/* Skill Name */}
                    <p className="font-semibold text-foreground group-hover:gradient-text transition-all duration-300 mb-3">
                      {skill.name}
                    </p>

                    {/* Proficiency Level */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Proficiency</span>
                        <span 
                          className="font-bold"
                          style={{ color: categoryColor }}
                        >
                          {skill.level}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full relative"
                          style={{
                            background: `linear-gradient(90deg, ${categoryColor}dd, ${categoryColor}99)`,
                            boxShadow: `0 0 10px ${categoryColor}60`,
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 1, 
                            delay: index * 0.05,
                            ease: "easeOut" 
                          }}
                        >
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mt-3">
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor,
                          border: `1px solid ${categoryColor}40`,
                        }}
                      >
                        {skill.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* View All / Show Less Button */}
        {hasMore && !showAll && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setShowAll(true)}
              className="group px-8 py-4 rounded-full font-semibold text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              />
              
              <span className="relative flex items-center gap-2">
                View All Skills ({filteredSkills.length})
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Show Less Button */}
        {showAll && hasMore && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setShowAll(false)}
              className="px-8 py-4 rounded-full font-semibold bg-accent hover:bg-accent/80 text-foreground transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Show Less
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {displayedSkills.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Award className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {selectedCategory === 'All' 
                ? 'No skills added yet' 
                : `No ${selectedCategory} skills found`
              }
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
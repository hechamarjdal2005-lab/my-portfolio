import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap, MapPin, Code } from "lucide-react";
import { useProfile } from "@/pages/hooks/useProfile";

const About = () => {
  const { profile, loading } = useProfile();

  // Icon mapping
  const iconMap: Record<string, any> = {
    Briefcase,
    GraduationCap,
    MapPin,
    Download: Code, // Changed from Download to Code for Projects
  };

  // Default stats in case database is empty
  const defaultStats = [
    { icon: Briefcase, label: "Experience", value: "5+ Years" },
    { icon: GraduationCap, label: "Education", value: "CS Degree" },
    { icon: MapPin, label: "Location", value: "San Francisco" },
    { icon: Code, label: "Projects", value: "50+ Done" },
  ];

  // Build stats from profile data
  const stats = profile ? [
    { 
      icon: Briefcase, 
      label: "Experience", 
      value: profile.experience_years || "5+ Years" 
    },
    { 
      icon: GraduationCap, 
      label: "Education", 
      value: profile.education || "CS Degree" 
    },
    { 
      icon: MapPin, 
      label: "Location", 
      value: profile.location || "San Francisco" 
    },
    { 
      icon: Code, 
      label: "Projects", 
      value: profile.projects_completed || "50+ Done" 
    },
  ] : defaultStats;

  if (loading) {
    return (
      <section id="about" className="py-24 section-alt">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 section-alt">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 gradient-bg rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Info Cards */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                className="glass-card rounded-2xl p-6 text-center glow-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Right - Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-foreground">
              {profile?.about_title || "Passionate Developer & Creative Problem Solver"}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              {profile?.about_description_1 || 
                `I'm a full-stack developer with a passion for creating beautiful, 
                functional, and user-centered digital experiences. With 5+ years 
                of experience in web development, I specialize in building modern 
                web applications using cutting-edge technologies.`}
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              {profile?.about_description_2 || 
                `When I'm not coding, you can find me exploring new technologies, 
                contributing to open-source projects, or sharing my knowledge 
                through technical writing. I believe in continuous learning and 
                staying up-to-date with the latest industry trends.`}
            </p>

            {/* CV Download Button - Only show if CV exists */}
            {profile?.cv_url && (
              <motion.a
                href={profile.cv_url}
                download={profile.cv_filename || "cv.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                Download CV
              </motion.a>
            )}

            {/* Fallback if no CV */}
            {!profile?.cv_url && (
              <div className="text-sm text-muted-foreground italic">
                CV not available at the moment
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
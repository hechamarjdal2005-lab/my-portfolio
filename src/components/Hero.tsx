import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Twitter, Mail } from "lucide-react";
import { useProfile } from "@/pages/hooks/useProfile";

const Hero = () => {
  const { profile, loading } = useProfile();
  
  // Default fallback data
  const defaultData = {
    greeting: "Hello, I'm",
    name: "John Doe",
    title: "Full Stack Developer",
    description: "Crafting digital experiences with clean code and creative design. Let's build something amazing together.",
    photo_url: "/assets/profile-photo.jpg",
  };

  // Social links from profile or defaults
  const getSocialLinks = () => {
    if (!profile) {
      return [
        { icon: Github, href: "https://github.com", label: "GitHub" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
      ];
    }

    const links = [];
    
    if (profile.github_url) {
      links.push({ icon: Github, href: profile.github_url, label: "GitHub" });
    }
    if (profile.linkedin_url) {
      links.push({ icon: Linkedin, href: profile.linkedin_url, label: "LinkedIn" });
    }
    if (profile.instagram_url) {
      links.push({ icon: Instagram, href: profile.instagram_url, label: "Instagram" });
    }
    if (profile.twitter_url) {
      links.push({ icon: Twitter, href: profile.twitter_url, label: "Twitter" });
    }
    if (profile.email) {
      links.push({ icon: Mail, href: `mailto:${profile.email}`, label: "Email" });
    }

    return links.length > 0 ? links : [
      { icon: Github, href: "https://github.com", label: "GitHub" },
      { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
      { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
      { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
      { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
    ];
  };

  const socialLinks = getSocialLinks();

  // Use profile data or fallback to defaults
  const displayData = {
    greeting: profile?.greeting || defaultData.greeting,
    name: profile?.name || defaultData.name,
    title: profile?.title || defaultData.title,
    description: profile?.description || defaultData.description,
    photo_url: profile?.photo_url || defaultData.photo_url,
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32"
    >
      {/* Background gradient orbs - more vibrant */}
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-cyan-500/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full bg-purple-500/20 blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left - Image with CRAZY animations behind it */}
          {/* 🔧 تم تصغير الصورة للموبايل: 280×350 | تابلت: 380×480 | كمبيوتر: 500×600 */}
          <motion.div
            className="order-2 lg:order-1 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 📱 Mobile: 280×350 | 💻 Tablet: 380×480 | 🖥️ Desktop: 500×600 */}
            <div className="relative w-[280px] h-[350px] sm:w-[380px] sm:h-[480px] lg:w-[500px] lg:h-[600px]">
              
              {/* ANIMATED BACKGROUND ELEMENTS - BEHIND IMAGE */}
              
              {/* Rotating gradient rings */}
              <motion.div
                className="absolute inset-0 -z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 sm:border-4 border-transparent border-t-cyan-500/30 border-r-purple-500/30 rounded-full" />
              </motion.div>

              <motion.div
                className="absolute inset-0 -z-10 scale-110"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border sm:border-2 border-transparent border-l-blue-500/20 border-b-pink-500/20 rounded-full" />
              </motion.div>

              {/* Pulsing circles */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 -z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-gradient-to-l from-blue-500/10 to-pink-500/10 -z-10"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              {/* Floating geometric shapes - smaller on mobile */}
              <motion.div
                className="absolute -top-6 sm:-top-10 -left-6 sm:-left-10 w-16 sm:w-24 h-16 sm:h-24 border-2 sm:border-4 border-cyan-500/20 rounded-2xl -z-10"
                animate={{ 
                  y: [0, -30, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />

              <motion.div
                className="absolute -bottom-6 sm:-bottom-10 -right-6 sm:-right-10 w-20 sm:w-32 h-20 sm:h-32 border-2 sm:border-4 border-purple-500/20 rounded-full -z-10"
                animate={{ 
                  y: [0, 30, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />

              <motion.div
                className="absolute top-1/3 -right-10 sm:-right-16 w-14 sm:w-20 h-14 sm:h-20 -z-10"
                animate={{ 
                  x: [0, 20, 0],
                  rotate: [0, 90, 0]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="w-full h-full border-2 sm:border-4 border-blue-500/20" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 -left-10 sm:-left-16 w-12 sm:w-16 h-12 sm:h-16 border-2 sm:border-4 border-pink-500/20 -z-10"
                animate={{ 
                  x: [0, -20, 0],
                  y: [0, 15, 0],
                  rotate: [0, -45, 0]
                }}
                transition={{ 
                  duration: 9, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />

              {/* Orbiting dots */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
                <div className="absolute top-1/4 right-0 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                <div className="absolute bottom-1/4 left-0 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-pink-400 to-pink-600" />
                <div className="absolute top-1/2 right-0 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600" />
              </motion.div>

              {/* Animated gradient beams */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent -z-10"
                animate={{ 
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
              />

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent -z-10"
                animate={{ 
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 12, 
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
              />

              {/* Particle effect simulation */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-cyan-400/50 -z-10"
                  animate={{
                    x: [0, Math.cos(i * Math.PI / 4) * 100, 0],
                    y: [0, Math.sin(i * Math.PI / 4) * 100, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              ))}

              {/* THE IMAGE - Clean, no background, no borders */}
              <motion.div
                className="relative w-full h-full z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="inline-block h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
                  </div>
                ) : (
                  <motion.img
                    src={displayData.photo_url}
                    alt={displayData.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Ctext fill="%2394a3b8" font-family="system-ui" font-size="24" font-weight="600" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EProfile Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                )}
              </motion.div>

            </div>
          </motion.div>

          {/* Right - Enhanced Content */}
          <motion.div
            className="order-1 lg:order-2 text-center lg:text-left space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Greeting badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-400 font-medium text-xs sm:text-sm tracking-wider uppercase">
                {displayData.greeting}
              </span>
            </motion.div>

            {/* Name - Enhanced Typography */}
            {/* 🔧 تم تصغير الاسم للموبايل: text-3xl | تابلت: text-5xl | كمبيوتر: text-7xl */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
                {loading ? "Loading..." : displayData.name}
              </span>
            </motion.h1>

            {/* Title with accent */}
            {/* 🔧 تم تصغير العنوان للموبايل: text-xl | تابلت: text-2xl | كمبيوتر: text-4xl */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-200 mb-2">
                {loading ? "..." : displayData.title}
              </h2>
              <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto lg:mx-0" />
            </motion.div>

            {/* Description */}
            {/* 🔧 تم تصغير الوصف للموبايل: text-sm | تابلت: text-base | كمبيوتر: text-lg */}
            <motion.p
              className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {loading ? "Loading..." : displayData.description}
            </motion.p>

            {/* Social Links */}
            {/* 🔧 تم تصغير الأيقونات للموبايل: w-10 h-10 | تابلت: w-12 h-12 */}
            <motion.div
              className="flex gap-2 sm:gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all hover:border-cyan-500/50"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-cyan-400 transition-colors relative z-10" />
                </motion.a>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            {/* 🔧 تم تصغير الأزرار للموبايل: px-5 py-2.5 | تابلت: px-8 py-4 */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.a 
                href="#projects" 
                className="group relative px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl font-semibold overflow-hidden text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                  View Projects
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.a>
              
              <motion.a 
                href="#contact" 
                className="group px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl font-semibold border-2 border-cyan-500/30 hover:border-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-cyan-400 flex items-center justify-center gap-2">
                  Contact Me
                  <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 sm:w-8 sm:h-12 border-2 border-cyan-500/30 rounded-full flex justify-center pt-2 relative overflow-hidden"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 sm:w-1.5 sm:h-3 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <p className="text-cyan-400/50 text-xs mt-2 text-center font-medium">Scroll</p>
      </motion.div>
    </section>
  );
};

export default Hero;
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreenTypewriter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);

  const fullText = "LOADING YOUR EXPERIENCE";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 45);

    // Typewriter effect
    const typeInterval = setInterval(() => {
      setDisplayedChars((prev) => {
        if (prev >= fullText.length) {
          clearInterval(typeInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0a1628 0%, #1a2332 25%, #0d3d56 50%, #1a2332 75%, #0a1628 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-20">
            
            {/* Logo with Simple Frame */}
            <div className="relative">
              {/* Corner Brackets */}
              <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-white/40" />
              <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-white/40" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-white/40" />
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-white/40" />

              <motion.div
                className="w-40 h-40 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/src/assets/logo.png"
                  alt="Logo"
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div className="text-6xl font-bold text-white hidden">
                  H
                </div>
              </motion.div>
            </div>

            {/* Typewriter Text */}
            <div className="flex flex-col items-center gap-6">
              <div className="font-mono text-xl text-white tracking-widest h-8">
                {fullText.split('').map((char, index) => {
                  if (index < displayedChars) {
                    return (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                      >
                        {char}
                      </motion.span>
                    );
                  } else if (index === displayedChars) {
                    // Show glitch effect on current character
                    return (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0, 1],
                        }}
                        transition={{ 
                          duration: 0.1,
                          repeat: 2,
                        }}
                      >
                        {characters[Math.floor(Math.random() * characters.length)]}
                      </motion.span>
                    );
                  }
                  return null;
                })}
                {displayedChars < fullText.length && (
                  <motion.span
                    className="inline-block w-2 h-5 bg-white ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Progress Number */}
              <motion.div
                className="font-mono text-4xl text-white/60"
                key={progress}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                {Math.floor(progress).toString().padStart(2, '0')}%
              </motion.div>

              {/* ASCII Progress Bar */}
              <div className="font-mono text-white/40 text-sm">
                [
                {Array.from({ length: 30 }).map((_, i) => {
                  const filled = (progress / 100) * 30;
                  if (i < filled) return '█';
                  if (i === Math.floor(filled)) return '▓';
                  return '░';
                }).join('')}
                ]
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreenTypewriter;
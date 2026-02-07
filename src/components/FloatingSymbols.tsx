import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const symbols = ["</>", "{}", "[]", "()", "//", "=>", "&&", "||", "++", "--", "/*", "*/", "===", "!=", "&&"];

interface FloatingSymbol {
  id: number;
  symbol: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const FloatingSymbols = () => {
  const [floatingSymbols, setFloatingSymbols] = useState<FloatingSymbol[]>([]);

  useEffect(() => {
    const generated: FloatingSymbol[] = [];
    for (let i = 0; i < 15; i++) {
      generated.push({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        x: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 20,
        size: 16 + Math.random() * 24,
      });
    }
    setFloatingSymbols(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingSymbols.map((item) => (
        <motion.span
          key={item.id}
          className="absolute font-mono text-primary/10 dark:text-primary/5"
          style={{
            left: `${item.x}%`,
            fontSize: `${item.size}px`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 0.1, 0.1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingSymbols;
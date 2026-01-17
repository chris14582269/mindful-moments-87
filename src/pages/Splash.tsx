import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrainIcon from '@/components/BrainIcon';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 via-background to-background flex flex-col items-center justify-center relative overflow-hidden max-w-lg mx-auto">
      {/* Background brain pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 800" className="w-full h-full">
          {/* Abstract brain-like curves */}
          <path
            d="M50 100 Q 150 50, 200 150 Q 250 250, 150 300 Q 50 350, 100 450 Q 150 550, 250 500 Q 350 450, 300 350"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-primary"
          />
          <path
            d="M350 150 Q 250 100, 300 200 Q 350 300, 250 350 Q 150 400, 200 500 Q 250 600, 350 550"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-primary"
          />
          <path
            d="M100 200 Q 200 180, 180 280 Q 160 380, 260 400 Q 360 420, 320 520"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-primary"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BrainIcon size={100} className="mx-auto mb-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-3xl font-bold text-primary mb-3"
        >
          Brain Care SG
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg text-muted-foreground"
        >
          Your personal coach for
          <br />
          a healthier brain.
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-20"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Splash;

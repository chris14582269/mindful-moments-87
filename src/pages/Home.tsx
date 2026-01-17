import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Info, ChevronRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import BrainIcon from '@/components/BrainIcon';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <MobileLayout>
      {/* Hero Section */}
      <section className="flex-1 flex flex-col">
        {/* Hero Background with brain pattern */}
        <div className="relative flex-1 bg-gradient-to-b from-secondary/50 to-background px-6 pt-8 pb-6">
          {/* Decorative brain outline in background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <path
                d="M200 50 C 120 50, 60 120, 60 200 C 60 280, 120 350, 200 350 C 280 350, 340 280, 340 200 C 340 120, 280 50, 200 50"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-primary"
              />
              <path
                d="M100 150 Q 150 100, 200 120 Q 250 140, 300 100"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-primary"
              />
              <path
                d="M80 200 Q 140 180, 200 200 Q 260 220, 320 200"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-primary"
              />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h1 className="text-3xl font-bold text-primary mb-2">
              Hello Sunny,
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Let's care for your brain!
            </p>

            <Link to="/quiz">
              <Button size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold shadow-soft">
                Take Quiz <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="px-4 pb-8 -mt-4">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/quiz" className="block">
                <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 hover:shadow-soft transition-shadow h-full">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-primary mb-1">Take Quiz</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Discover your score
                  </p>
                  <span className="text-sm font-medium text-primary inline-flex items-center">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/about" className="block">
                <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 hover:shadow-soft transition-shadow h-full">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-primary mb-1">About Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    About Braincare SG
                  </p>
                  <span className="text-sm font-medium text-primary inline-flex items-center">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </MobileLayout>
  );
};

export default Home;

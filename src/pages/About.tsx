import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import BrainIcon from '@/components/BrainIcon';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-primary mb-6">
            Outsmart your brain.
          </h1>

          {/* Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50 to-primary/10" />
            <svg viewBox="0 0 200 200" className="relative w-full h-full">
              {/* Person thinking */}
              <circle cx="100" cy="80" r="30" fill="hsl(30, 80%, 85%)" />
              <circle cx="90" cy="75" r="3" fill="hsl(215, 25%, 20%)" />
              <circle cx="110" cy="75" r="3" fill="hsl(215, 25%, 20%)" />
              <path d="M95 88 Q 100 92, 105 88" stroke="hsl(215, 25%, 20%)" strokeWidth="2" fill="none" strokeLinecap="round" />
              
              {/* Body */}
              <path d="M70 110 Q 100 130, 130 110 L 130 160 Q 100 150, 70 160 Z" fill="hsl(207, 90%, 45%)" />
              
              {/* Thought bubble with brain */}
              <ellipse cx="150" cy="50" rx="25" ry="20" fill="hsl(207, 40%, 95%)" stroke="hsl(207, 40%, 80%)" strokeWidth="1" />
              <circle cx="135" cy="70" r="5" fill="hsl(207, 40%, 95%)" stroke="hsl(207, 40%, 80%)" strokeWidth="1" />
              <circle cx="125" cy="80" r="3" fill="hsl(207, 40%, 95%)" stroke="hsl(207, 40%, 80%)" strokeWidth="1" />
              
              {/* Mini brain in thought bubble */}
              <ellipse cx="150" cy="48" rx="12" ry="10" fill="hsl(350, 70%, 85%)" stroke="hsl(350, 50%, 70%)" strokeWidth="1" />
              <path d="M143 45 Q 150 43, 157 45" stroke="hsl(350, 50%, 70%)" strokeWidth="1" fill="none" />
              <path d="M144 51 Q 150 49, 156 51" stroke="hsl(350, 50%, 70%)" strokeWidth="1" fill="none" />
              
              {/* Decorative elements */}
              <circle cx="50" cy="60" r="4" fill="hsl(207, 70%, 70%)" opacity="0.5" />
              <circle cx="160" cy="120" r="3" fill="hsl(350, 70%, 75%)" opacity="0.5" />
              <path d="M45 100 L 48 95 L 51 100" stroke="hsl(207, 70%, 70%)" strokeWidth="2" fill="none" opacity="0.5" />
            </svg>
          </div>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            As we grow older, looking after our brain is just as important as caring for the rest of our body. Brain Care Score SG is an easy-to-use tool that helps you check in on brain health – one small step at a time.
          </p>

          <h2 className="text-lg font-bold text-primary mb-4">
            What is Brain Care Score SG?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            A personalized score that shows how your everyday choices are helping (or hurting) your brain.
          </p>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Simple, science-backed tips you can use right away to boost your focus, mood, and long-term brain health.
          </p>

          <h2 className="text-lg font-bold text-primary mb-4">
            What do I need to do?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Take the Brain Care Score quiz to understand your current brain health status. Based on your answers, you'll receive personalized recommendations to improve your brain wellness.
          </p>

          <Link to="/quiz">
            <Button size="lg" className="w-full rounded-xl py-6 text-lg font-semibold">
              Take Quiz <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default About;

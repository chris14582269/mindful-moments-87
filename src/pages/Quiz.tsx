import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/data/quizQuestions';
import BrainIcon from '@/components/BrainIcon';

const Quiz = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});

  const question = quizQuestions[currentQuestion];
  const totalQuestions = quizQuestions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleOptionSelect = (optionId: string) => {
    if (question.multiSelect) {
      const currentAnswers = answers[question.id] || [];
      if (currentAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [question.id]: currentAnswers.filter((id) => id !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [question.id]: [...currentAnswers, optionId],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [question.id]: [optionId],
      });
    }
  };

  const isOptionSelected = (optionId: string) => {
    return (answers[question.id] || []).includes(optionId);
  };

  const hasAnswer = (answers[question.id] || []).length > 0;

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate scores and navigate to results
      let physicalScore = 0;
      let lifestyleScore = 0;
      let socialEmotionalScore = 0;

      quizQuestions.forEach((q) => {
        const selectedIds = answers[q.id] || [];
        const score = selectedIds.reduce((acc, id) => {
          const option = q.options.find((o) => o.id === id);
          return acc + (option?.score || 0);
        }, 0);

        if (q.category === 'physical') physicalScore += score;
        else if (q.category === 'lifestyle') lifestyleScore += score;
        else socialEmotionalScore += score;
      });

      navigate('/scores', {
        state: {
          physicalScore,
          lifestyleScore,
          socialEmotionalScore,
          date: new Date().toISOString(),
        },
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setStarted(false);
    }
  };

  if (!started) {
    return (
      <MobileLayout>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold text-primary mb-6">
              Brain Care Score
            </h1>

            {/* Decorative brain illustration */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-50 to-pink-50" />
              <svg viewBox="0 0 200 200" className="relative w-full h-full">
                {/* Brain with flowers growing from it */}
                <ellipse cx="100" cy="100" rx="50" ry="55" fill="hsl(350, 80%, 85%)" />
                <ellipse cx="85" cy="100" rx="25" ry="30" fill="hsl(350, 70%, 88%)" stroke="hsl(350, 50%, 70%)" strokeWidth="1" />
                <ellipse cx="115" cy="100" rx="25" ry="30" fill="hsl(350, 70%, 88%)" stroke="hsl(350, 50%, 70%)" strokeWidth="1" />
                
                {/* Brain folds */}
                <path d="M70 90 Q 85 85, 100 90" stroke="hsl(350, 50%, 70%)" strokeWidth="1.5" fill="none" />
                <path d="M100 90 Q 115 85, 130 90" stroke="hsl(350, 50%, 70%)" strokeWidth="1.5" fill="none" />
                <path d="M75 105 Q 90 100, 100 105" stroke="hsl(350, 50%, 70%)" strokeWidth="1.5" fill="none" />
                <path d="M100 105 Q 110 100, 125 105" stroke="hsl(350, 50%, 70%)" strokeWidth="1.5" fill="none" />
                
                {/* Flowers growing from brain */}
                <line x1="75" y1="70" x2="75" y2="45" stroke="hsl(160, 60%, 35%)" strokeWidth="2" />
                <circle cx="75" cy="38" r="8" fill="hsl(350, 70%, 65%)" />
                <circle cx="75" cy="38" r="4" fill="hsl(45, 90%, 60%)" />
                
                <line x1="100" y1="65" x2="100" y2="35" stroke="hsl(160, 60%, 35%)" strokeWidth="2" />
                <circle cx="100" cy="28" r="6" fill="hsl(200, 70%, 70%)" />
                
                <line x1="125" y1="70" x2="125" y2="45" stroke="hsl(160, 60%, 35%)" strokeWidth="2" />
                <circle cx="125" cy="38" r="8" fill="hsl(350, 70%, 65%)" />
                <circle cx="125" cy="38" r="4" fill="hsl(45, 90%, 60%)" />
                
                {/* Leaves */}
                <path d="M60 75 Q 55 65, 65 60" stroke="hsl(160, 60%, 35%)" strokeWidth="2" fill="hsl(160, 50%, 50%)" />
                <path d="M140 75 Q 145 65, 135 60" stroke="hsl(160, 60%, 35%)" strokeWidth="2" fill="hsl(160, 50%, 50%)" />
                
                {/* Small decorative elements */}
                <circle cx="55" cy="85" r="3" fill="hsl(207, 70%, 70%)" />
                <circle cx="145" cy="90" r="2" fill="hsl(350, 70%, 75%)" />
                <path d="M50 100 L 52 95 L 54 100 L 52 98 Z" fill="hsl(207, 70%, 70%)" />
              </svg>
            </div>

            <p className="text-muted-foreground mb-10 text-lg">
              This quiz has {totalQuestions} questions and will take around 5 to 10 minutes to complete.
            </p>

            <Button
              onClick={() => setStarted(true)}
              size="lg"
              className="w-full rounded-xl py-6 text-lg font-semibold"
            >
              Let's Begin!
            </Button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showHeader={false}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 px-4 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-primary font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>

        {/* Question Content */}
        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {question.id}. {question.title}
              </h2>
              <p className="text-muted-foreground mb-6">{question.instruction}</p>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isOptionSelected(option.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                          isOptionSelected(option.id)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}
                      >
                        {isOptionSelected(option.id) && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="text-foreground leading-relaxed">
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4">
          <p className="text-center text-sm text-muted-foreground mb-3">
            {currentQuestion + 1} of {totalQuestions}
          </p>
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="w-full rounded-xl py-6 text-lg font-semibold"
          >
            {isLastQuestion ? 'Done' : 'Next'}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Quiz;

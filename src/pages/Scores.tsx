import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info, ChevronRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { maxScoreByCategory, totalMaxScore } from '@/data/quizQuestions';
import { useState } from 'react';

interface ScoreData {
  physicalScore: number;
  lifestyleScore: number;
  socialEmotionalScore: number;
  date: string;
}

const Scores = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'score' | 'graph'>('score');
  
  // Get score from navigation state or use demo data
  const scoreData: ScoreData = location.state || {
    physicalScore: 11,
    lifestyleScore: 8,
    socialEmotionalScore: 5,
    date: new Date().toISOString(),
  };

  const totalScore = scoreData.physicalScore + scoreData.lifestyleScore + scoreData.socialEmotionalScore;
  const normalizedScore = Math.round((totalScore / totalMaxScore) * 100);

  // Calculate changes (demo data - in real app would compare to previous)
  const changes = {
    physical: 5,
    lifestyle: -2,
    socialEmotional: 0,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-score-positive';
    if (change < 0) return 'text-score-negative';
    return 'text-score-neutral';
  };

  const getMessage = () => {
    if (normalizedScore >= 80) {
      return "Your efforts are making a difference. Let's continue at your pace!";
    } else if (normalizedScore >= 60) {
      return "You're on the right track! Small changes can lead to big improvements.";
    } else {
      return "Every step counts. Let's work together to improve your brain health!";
    }
  };

  const getCategoryMessage = (category: string, change: number) => {
    if (change > 0) return "You're doing better than last time—keep it up!";
    if (change < 0) return "It's okay you can do it! Keep working!";
    return "Same as your last check-in—it's a good sign.";
  };

  // Demo graph data
  const graphData = [
    { date: '11 Nov', score: 72 },
    { date: '20 Nov', score: 78 },
    { date: '1 Dec', score: 82 },
    { date: '8 Dec', score: normalizedScore },
  ];

  return (
    <MobileLayout>
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-primary mb-1">Hello Sunny,</h1>
          <p className="text-muted-foreground mb-6">This is your Brain Care Score.</p>

          {/* Score Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-6">
            {/* Tab Switcher */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('score')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  activeTab === 'score'
                    ? 'text-primary bg-secondary/50'
                    : 'text-muted-foreground'
                }`}
              >
                Score
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  activeTab === 'graph'
                    ? 'text-primary bg-secondary/50'
                    : 'text-muted-foreground'
                }`}
              >
                Graph
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'score' ? (
                <>
                  <p className="text-sm text-primary font-medium text-center mb-2">
                    Your Current Score
                  </p>
                  <div className="text-center mb-4">
                    <span className="text-6xl font-bold text-primary">{normalizedScore}</span>
                    <span className="text-2xl text-muted-foreground ml-1">/ 100</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>Taken on: {formatDate(scoreData.date)}</span>
                    <span className="inline-flex items-center gap-1 text-score-positive font-medium">
                      <TrendingUp className="w-4 h-4" /> +3
                    </span>
                  </div>
                  <p className="text-center text-muted-foreground">{getMessage()}</p>
                </>
              ) : (
                <div className="h-48 flex items-end justify-between gap-2 px-4">
                  {graphData.map((point, index) => (
                    <div key={point.date} className="flex flex-col items-center flex-1">
                      <div className="relative w-full flex justify-center mb-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${point.score * 1.5}px` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="w-3 bg-primary rounded-full"
                        />
                        <div className="absolute -top-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-medium">
                            {point.score}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-auto">
                        {point.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link to explanation */}
          <Link
            to="/about"
            className="inline-flex items-center text-primary font-medium mb-6 hover:underline"
          >
            Find out how the brain care score works.
          </Link>

          {/* Scores Breakdown */}
          <h2 className="text-lg font-bold text-primary mb-4">Scores Breakdown</h2>
          
          <div className="space-y-4">
            {/* Physical */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Physical</span>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className={`flex items-center gap-1 font-bold ${getChangeColor(changes.physical)}`}>
                {getChangeIcon(changes.physical)}
                <span>{changes.physical > 0 ? '+' : ''}{changes.physical}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getCategoryMessage('physical', changes.physical)}
              </p>
            </div>

            {/* Lifestyle */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Lifestyle</span>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className={`flex items-center gap-1 font-bold ${getChangeColor(changes.lifestyle)}`}>
                {getChangeIcon(changes.lifestyle)}
                <span>{changes.lifestyle}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getCategoryMessage('lifestyle', changes.lifestyle)}
              </p>
            </div>

            {/* Social Emotional */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Social Emotional</span>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className={`flex items-center gap-1 font-bold ${getChangeColor(changes.socialEmotional)}`}>
                {getChangeIcon(changes.socialEmotional)}
                <span>{changes.socialEmotional === 0 ? '→ ' : ''}{changes.socialEmotional}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getCategoryMessage('social', changes.socialEmotional)}
              </p>
            </div>
          </div>

          {/* Take Quiz Again */}
          <div className="mt-8">
            <Link
              to="/quiz"
              className="block w-full text-center py-4 rounded-xl bg-secondary text-primary font-semibold hover:bg-secondary/80 transition-colors"
            >
              Take Quiz Again
            </Link>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Scores;

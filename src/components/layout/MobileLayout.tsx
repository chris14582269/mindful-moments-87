import { ReactNode } from 'react';
import Header from './Header';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const MobileLayout = ({ children, showHeader = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {showHeader && <Header />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;

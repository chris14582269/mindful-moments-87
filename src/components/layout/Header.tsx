import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/quiz', label: 'Take Quiz' },
    { href: '/scores', label: 'My Scores' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14 px-4">
        <button className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
          <User className="w-5 h-5 text-primary" />
        </button>
        
        <Link to="/" className="font-bold text-lg text-primary">
          Brain Care SG
        </Link>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border-b border-border overflow-hidden"
          >
            <div className="container py-4 px-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Download, Github } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        isScrolled 
          ? 'bg-broco-bg/90 backdrop-blur-md py-4' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="w-full px-[clamp(16px,2.2vw,28px)] flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display font-bold text-xl tracking-tight text-broco-text hover:text-broco-accent transition-colors"
        >
          BROCO
        </button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('features')}
            className="font-display font-medium text-sm link-animated"
          >
            Gallery
          </button>
          <button 
            onClick={() => scrollToSection('download')}
            className="font-display font-medium text-sm link-animated"
          >
            Download
          </button>
          <a 
            href="https://github.com/s-poony/BROCO"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-medium text-sm flex items-center gap-1.5 link-animated"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>

        {/* CTA */}
        <a 
          href="https://s-poony.github.io/BROCO/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm flex items-center gap-2"
        >
          Try the demo in your browser
        </a>
      </div>
    </nav>
  );
};

export default Navigation;

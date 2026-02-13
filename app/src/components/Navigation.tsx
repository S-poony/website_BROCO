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
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (ScrollTrigger) {
        // Force a refresh to ensure all positions are up-to-date
        ScrollTrigger.refresh();
        const allTriggers = ScrollTrigger.getAll();
        const st = allTriggers.find((t: any) => t.trigger === element && (t.vars && t.vars.pin)) ||
          allTriggers.find((t: any) => t.trigger === element);
        if (st && typeof st.start === 'number' && typeof st.end === 'number') {
          // ROBUST REVEAL LOGIC:
          // Pinned sections usually have entrance/exit animations. 
          // We want to land in the "settled" state (usually around the middle).
          // Defaults: 50% for pinned sections, 0% for standard ones.
          // Can be overridden via data-scroll-reveal attribute (0.0 to 1.0)
          const revealPercent = element.dataset.scrollReveal
            ? parseFloat(element.dataset.scrollReveal)
            : (st.vars && st.vars.pin ? 0.5 : 0);

          const targetScroll = st.start + (st.end - st.start) * revealPercent;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          return;
        }
      }
      // Fallback: manually calculate position accounting for potential pinning offsets
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({ top: rect.top + scrollTop, behavior: 'smooth' });
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
            onClick={() => scrollToSection('gallery')}
            className="font-display font-medium text-sm link-animated"
          >
            Gallery
          </button>
          <a
            href="https://github.com/s-poony/BROCO/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-medium text-sm flex items-center gap-1.5 link-animated"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
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

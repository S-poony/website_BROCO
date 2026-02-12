import { useRef, useLayoutEffect, useState } from 'react';
import { Send, Github } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Download', href: 'https://github.com/s-poony/BROCO/releases' },
    { label: 'Features', href: '#features' },
    { label: 'Changelog', href: 'https://github.com/s-poony/BROCO/releases' },
  ],
  Resources: [
    { label: 'Shortcuts', href: 'https://github.com/s-poony/BROCO/blob/main/public/assets/shortcuts.md' },
    { label: 'GitHub', href: 'https://github.com/s-poony/BROCO' },
  ],
};

export const FooterSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState<'license' | 'privacy' | null>(null);

  useLayoutEffect(() => {
    const cta = ctaRef.current;
    const links = linksRef.current;

    if (!cta || !links) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    // CTA reveal
    gsap.fromTo(cta,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: cta,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 0.5,
        }
      }
    );

    // Links reveal
    gsap.fromTo(links,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: links,
          start: 'top 90%',
          end: 'top 65%',
          scrub: 0.5,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st: { kill: () => void }) => st.kill());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thanks for subscribing! We\'ll keep you updated on BROCO releases.');
    setEmail('');
  };

  return (
    <footer
      ref={sectionRef}
      className="w-full bg-broco-dark py-[10vh]"
    >
      {/* Modal for License/Privacy */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowModal(null)}
        >
          <div
            className="bg-broco-bg p-8 max-w-md w-full border border-[var(--color-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-xl text-broco-text mb-4">
              {showModal === 'license' ? 'License' : 'Privacy Policy'}
            </h3>
            <p className="body-text text-broco-textSecondary mb-6">
              BROCO is open source and does not collect any user data.
              However, we haven&apos;t had the legal work done to write proper
              {showModal === 'license' ? ' license ' : ' privacy policy '}
              sections yet. Check back soon!
            </p>
            <button
              onClick={() => setShowModal(null)}
              className="btn-primary"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="w-[92vw] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          {/* Left CTA Block */}
          <div ref={ctaRef} className="w-full lg:w-[46vw] will-change-transform">
            <h2 className="headline-lg font-display font-bold text-white mb-4">
              Start building<br />layouts.
            </h2>
            <p className="body-text text-white/70 mb-6">
              Get the latest release, or try the web demo.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-white/10 border border-white/20 px-5 py-3 text-white placeholder:text-white/50 font-sans text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                required
              />
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Get updates
              </button>
            </form>
          </div>

          {/* Right Links Block */}
          <div ref={linksRef} className="w-full lg:w-[40vw] will-change-transform">
            <div className="grid grid-cols-2 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-mono text-xs uppercase tracking-wide text-white/50 mb-4">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display font-medium text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-white/50">
            © {new Date().getFullYear()} BROCO Team
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowModal('license')}
              className="font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              License
            </button>
            <button
              onClick={() => setShowModal('privacy')}
              className="font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              Privacy
            </button>
            <a
              href="https://github.com/s-poony/BROCO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

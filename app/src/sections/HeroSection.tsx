import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';
import { Download, Github } from 'lucide-react';

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const rule = ruleRef.current;
    const headline = headlineRef.current;
    const tile = tileRef.current;
    const cta = ctaRef.current;

    if (!section || !rule || !headline || !tile || !cta) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const headlineLines = headline.querySelectorAll('.headline-line');

      // ── AUTO-PLAY ENTRANCE (on page load) ─────────────────
      const entranceTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (!isMobile) {
        entranceTl.fromTo(rule,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, transformOrigin: 'top' }
        );
      }

      entranceTl
        .fromTo(headlineLines,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          isMobile ? 0 : '-=0.3'
        )
        .fromTo(tile,
          isMobile
            ? { y: 30, opacity: 0, scale: 0.98 }
            : { x: '12vw', opacity: 0, scale: 0.98 },
          { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.9 },
          '-=0.5'
        )
        .fromTo(cta,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.4'
        );

      // ── SCROLL-DRIVEN EXIT ────────────────────────────────
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.3,
        }
      });

      // Rule dims as scroll begins (desktop only)
      if (!isMobile) {
        scrollTl.fromTo(rule,
          { scaleY: 1, opacity: 1 },
          { scaleY: 0.5, opacity: 0.2, transformOrigin: 'top', ease: 'none' },
          0
        );
      }

      // ── EXIT PHASE (0.7 → 1.0) ───────────────────────────
      scrollTl
        .fromTo(headline,
          { x: 0, opacity: 1 },
          { x: isMobile ? '-8vw' : '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(tile,
          { x: 0, y: 0, opacity: 1 },
          isMobile
            ? { y: '10vh', opacity: 0, ease: 'power2.in' }
            : { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        );

      if (!isMobile) {
        scrollTl.fromTo(rule,
          { scaleY: 0.5, opacity: 0.2 },
          { scaleY: 0, opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl
        .fromTo(cta,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.75
        )
        // Fade the entire section out at the tail end
        .fromTo(section,
          { opacity: 1 },
          { opacity: 0, ease: 'power1.in' },
          0.88
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned bg-broco-bg flex items-center justify-center md:flex-row flex-col md:pt-0 pt-[14vh]"
    >
      {/* Vertical Rule - hidden on mobile */}
      <Rule
        ref={ruleRef}
        orientation="vertical"
        className="absolute left-1/2 top-[10vh] h-[80vh] -translate-x-1/2 z-[1] hidden md:block"
      />

      {/* Left Content */}
      <div className="md:absolute md:left-[4vw] md:top-[18vh] md:w-[40vw] w-[88vw] z-[3] md:text-left text-center">
        {/* Label */}
        <p className="label-mono mb-4">BROCO — Layout Editor</p>

        {/* Headline */}
        <div ref={headlineRef} className="mb-8">
          <h1 className="headline-xl font-display font-bold text-broco-text">
            <span className="headline-line block"><span className="text-broco-accent">B</span>eautiful</span>
            <span className="headline-line block"><span className="text-broco-accent">Ro</span>ws &</span>
            <span className="headline-line block">
              <span className="text-broco-accent">Co</span>lumns<span className="text-broco-accent">.</span>
            </span>
          </h1>
        </div>

        {/* CTA Row */}
        <div ref={ctaRef} className="flex items-center gap-4 md:justify-start justify-center">
          <a
            href="https://github.com/s-poony/BROCO/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download
          </a>
          <a
            href="https://github.com/s-poony/BROCO"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-medium text-sm flex items-center gap-1.5 link-animated"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </div>

      {/* Right Hero Tile */}
      <div
        ref={tileRef}
        className="md:absolute md:left-[52vw] md:top-[14vh] md:w-[72vh] md:h-[72vh] w-[88vw] h-[50vw] mt-8 md:mt-0 z-[2] will-change-transform"
      >
        <Tile className="w-full h-full" noHover>
          <img
            src="/images/layoutMadeEasy.jpg"
            alt="Creative workspace"
            className="broco-img"
          />
        </Tile>
      </div>
    </section>
  );
};

export default HeroSection;

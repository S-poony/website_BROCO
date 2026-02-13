import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';
import { Download, Github } from 'lucide-react';

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  trigger?: unknown;
  kill: () => void;
}

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

    // Get headline lines for stagger
    const headlineLines = headline.querySelectorAll('.headline-line');

    // AUTO-PLAY ENTRANCE ANIMATION (on page load)
    const entranceTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    entranceTl
      .fromTo(rule,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.6, transformOrigin: 'top' }
      )
      .fromTo(headlineLines,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
        '-=0.3'
      )
      .fromTo(tile,
        { x: '12vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, duration: 0.9 },
        '-=0.5'
      )
      .fromTo(cta,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.4'
      );

    // SCROLL-DRIVEN EXIT ANIMATION
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onLeaveBack: () => {
          // Reset to visible when scrolling back to top
          gsap.set(headlineLines, { x: 0, opacity: 1 });
          gsap.set(tile, { x: 0, opacity: 1 });
          gsap.set(rule, { scaleY: 1, opacity: 1, transformOrigin: 'top' });
          gsap.set(cta, { opacity: 1 });
        }
      }
    });

    // Animate rule immediately as user scrolls
    scrollTl.to(rule, {
      scaleY: 0.5,
      opacity: 0.2,
      transformOrigin: 'top',
      ease: 'none'
    }, 0);

    // EXIT PHASE (70% - 100%) for main content
    scrollTl
      .fromTo(headline,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(tile,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(rule,
        { scaleY: 0, opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(cta,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

    return () => {
      const allTriggers = ScrollTrigger.getAll() as ScrollTriggerInstance[];
      allTriggers.forEach((st: ScrollTriggerInstance) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned bg-broco-bg flex items-center justify-center"
    >
      {/* Vertical Rule - lower z-index */}
      <Rule
        ref={ruleRef}
        orientation="vertical"
        className="absolute left-1/2 top-[10vh] h-[80vh] -translate-x-1/2 z-[1]"
      />

      {/* Left Content */}
      <div className="absolute left-[4vw] top-[18vh] w-[40vw] z-[3]">
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
        <div ref={ctaRef} className="flex items-center gap-4">
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
        className="absolute left-[52vw] top-[14vh] w-[72vh] h-[72vh] z-[2] will-change-transform"
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

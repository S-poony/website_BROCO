import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';
import { ArrowRight } from 'lucide-react';

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  trigger?: unknown;
  kill: () => void;
}

export const FeatureHighlightSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const tile = tileRef.current;
    const text = textRef.current;
    const rule = ruleRef.current;

    if (!section || !tile || !text || !rule) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    gsap.registerPlugin(ScrollTrigger);

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
      }
    });

    // ENTRANCE (0% - 30%)
    scrollTl
      .fromTo(tile, 
        { x: '-60vw', opacity: 0, scale: 0.96 }, 
        { x: 0, opacity: 1, scale: 1, ease: 'none' }, 
        0
      )
      .fromTo(rule, 
        { scaleX: 0 }, 
        { scaleX: 1, ease: 'none', transformOrigin: 'left' }, 
        0
      )
      .fromTo(text, 
        { x: '18vw', opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'none' }, 
        0.05
      );

    // Set timeline to entrance end at 30%
    scrollTl.to({}, {}, 0.3);

    // EXIT (70% - 100%)
    scrollTl
      .fromTo(tile, 
        { x: 0, opacity: 1 }, 
        { x: '-22vw', opacity: 0, ease: 'power2.in' }, 
        0.7
      )
      .fromTo(text, 
        { x: 0, opacity: 1 }, 
        { x: '10vw', opacity: 0, ease: 'power2.in' }, 
        0.7
      )
      .fromTo(rule, 
        { scaleX: 1, opacity: 1 }, 
        { scaleX: 0.2, opacity: 0, ease: 'power2.in' }, 
        0.7
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
      id="features"
      className="section-pinned bg-broco-bg flex items-center justify-center"
    >
      {/* Horizontal Rule - lower z-index */}
      <Rule 
        ref={ruleRef}
        orientation="horizontal" 
        className="absolute left-[6vw] top-1/2 w-[88vw] z-[1]"
      />

      {/* Left Big Tile */}
      <div 
        ref={tileRef}
        className="absolute left-[6vw] top-[16vh] w-[52vw] h-[68vh] z-[2] will-change-transform"
      >
        <Tile className="w-full h-full" noHover>
          <img 
            src="/images/feature_01_lifestyle.jpg" 
            alt="Designer sketching layout"
            className="broco-img"
          />
        </Tile>
      </div>

      {/* Right Text Block */}
      <div 
        ref={textRef}
        className="absolute left-[64vw] top-[26vh] w-[30vw] z-[3] will-change-transform"
      >
        <h2 className="headline-lg font-display font-bold text-broco-text mb-6">
          Design with<br />tiles.
        </h2>
        <p className="body-text text-broco-textSecondary mb-6">
          BROCO turns every page into a set of split-ready panels—resize, nest, 
          and rearrange without breaking the grid.
        </p>
        <a 
          href="https://s-poony.github.io/BROCO/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-medium text-sm flex items-center gap-1.5 link-animated text-broco-accent"
        >
          Explore features
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default FeatureHighlightSection;

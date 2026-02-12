import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';
import { Download, Play } from 'lucide-react';

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  trigger?: unknown;
  kill: () => void;
}

export const DarkFeatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const tile = tileRef.current;
    const text = textRef.current;
    const rule = ruleRef.current;
    const cta = ctaRef.current;

    if (!section || !tile || !text || !rule || !cta) return;

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
      .fromTo(rule,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', transformOrigin: 'top' },
        0
      )
      .fromTo(tile,
        { x: '60vw', opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(text,
        { x: '-18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo(cta,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

    // Set to 30%
    scrollTl.to({}, {}, 0.3);

    // EXIT (60% - 100%)
    scrollTl
      .fromTo(text,
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in', duration: 0.4 },
        0.6
      )
      .fromTo(tile,
        { x: 0, opacity: 1 },
        { x: '14vw', opacity: 0, ease: 'power2.in', duration: 0.4 },
        0.6
      )
      .fromTo(rule,
        { scaleY: 1, opacity: 1 },
        { scaleY: 0.2, opacity: 0, ease: 'power2.in', duration: 0.4 },
        0.6
      )
      .fromTo(cta,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in', duration: 0.35 },
        0.65
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
      id="download"
      className="section-pinned bg-broco-dark flex items-center justify-center"
    >
      {/* Vertical Rule - lower z-index */}
      <Rule
        ref={ruleRef}
        orientation="vertical"
        className="absolute left-1/2 top-[10vh] h-[80vh] -translate-x-1/2 z-[1]"
        light
      />

      {/* Left Text */}
      <div
        ref={textRef}
        className="absolute left-[6vw] top-[24vh] w-[40vw] z-[3] will-change-transform"
      >
        <h2 className="headline-lg font-display font-bold text-white mb-6">
          Built for<br />speed.
        </h2>
        <p className="body-text text-white/70 mb-8">
          Keyboard-first controls, instant splits, and a layout engine that
          stays out of your way.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex items-center gap-4 will-change-transform">
          <a
            href="https://github.com/s-poony/BROCO/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download BROCO
          </a>
          <a
            href="https://youtu.be/cvfVd9Yq398"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-medium text-sm flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <Play className="w-4 h-4" />
            Watch demo
          </a>
        </div>
      </div>

      {/* Right Tile */}
      <div
        ref={tileRef}
        className="absolute left-[52vw] top-[16vh] w-[42vw] h-[68vh] z-[2] will-change-transform"
      >
        <Tile className="w-full h-full" noHover>
          <img
            src="/images/dark_feature_lifestyle.jpg"
            alt="Designer working late"
            className="broco-img"
          />
        </Tile>
      </div>
    </section>
  );
};

export default DarkFeatureSection;

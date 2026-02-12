import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';
import { FileText, Image, Download } from 'lucide-react';

const bullets = [
  { icon: FileText, text: 'Markdown with shortcuts' },
  { icon: Image, text: 'Cover / contain per image' },
  { icon: Download, text: 'Export to PDF or images' },
];

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  trigger?: unknown;
  kill: () => void;
}

export const DeepFeatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const bulletsRef = useRef<(HTMLLIElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const tile = tileRef.current;
    const text = textRef.current;
    const rule = ruleRef.current;
    const bulletItems = bulletsRef.current.filter(Boolean);

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
        { x: '70vw', opacity: 0, scale: 0.97 }, 
        { x: 0, opacity: 1, scale: 1, ease: 'none' }, 
        0
      )
      .fromTo(rule, 
        { scaleY: 0 }, 
        { scaleY: 1, ease: 'none', transformOrigin: 'top' }, 
        0
      )
      .fromTo(text, 
        { x: '-18vw', opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'none' }, 
        0.05
      );

    // Bullets stagger
    bulletItems.forEach((bullet, i) => {
      scrollTl.fromTo(bullet,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1 + i * 0.02
      );
    });

    // Set to 30%
    scrollTl.to({}, {}, 0.3);

    // EXIT (70% - 100%)
    scrollTl
      .fromTo(tile, 
        { x: 0, opacity: 1 }, 
        { x: '18vw', opacity: 0, ease: 'power2.in' }, 
        0.7
      )
      .fromTo(text, 
        { x: 0, opacity: 1 }, 
        { x: '-14vw', opacity: 0, ease: 'power2.in' }, 
        0.7
      )
      .fromTo(rule, 
        { scaleY: 1, opacity: 1 }, 
        { scaleY: 0.2, opacity: 0, ease: 'power2.in' }, 
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
      className="section-pinned bg-broco-bg flex items-center justify-center"
    >
      {/* Vertical Rule - lower z-index */}
      <Rule 
        ref={ruleRef}
        orientation="vertical" 
        className="absolute left-[44vw] top-[10vh] h-[80vh] z-[1]"
      />

      {/* Left Text Block */}
      <div 
        ref={textRef}
        className="absolute left-[6vw] top-[22vh] w-[34vw] z-[3] will-change-transform"
      >
        <h2 className="headline-lg font-display font-bold text-broco-text mb-6">
          Focus on<br />what matters.
        </h2>
        <p className="body-text text-broco-textSecondary mb-8">
          Hide the noise. Zoom into a cell, edit markdown, refine images, 
          and snap back to the full spread.
        </p>
        
        {/* Feature List */}
        <ul className="space-y-4">
          {bullets.map((bullet, index) => (
            <li 
              key={bullet.text}
              ref={(el) => { bulletsRef.current[index] = el; }}
              className="flex items-center gap-3 will-change-transform"
            >
              <bullet.icon className="w-5 h-5 text-broco-accent" strokeWidth={2} />
              <span className="font-display font-medium text-sm text-broco-text">
                {bullet.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Tall Tile */}
      <div 
        ref={tileRef}
        className="absolute left-[46vw] top-[12vh] w-[48vw] h-[76vh] z-[2] will-change-transform"
      >
        <Tile className="w-full h-full" noHover>
          <img 
            src="/images/deep_feature_lifestyle.jpg" 
            alt="Designer reviewing layouts"
            className="broco-img"
          />
        </Tile>
      </div>
    </section>
  );
};

export default DeepFeatureSection;

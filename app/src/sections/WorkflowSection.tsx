import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Rule } from '@/components/Rule';

const steps = [
  {
    number: '01',
    title: 'Split',
    description: 'Add rows or columns to any cell.',
  },
  {
    number: '02',
    title: 'Fill',
    description: 'Drop in images, text, or markdown.',
  },
  {
    number: '03',
    title: 'Export',
    description: 'Print-ready PDF or image slices.',
  },
];

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  trigger?: unknown;
  kill: () => void;
}

export const WorkflowSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const tile = tileRef.current;
    const text = textRef.current;
    const rule = ruleRef.current;
    const stepItems = stepsRef.current.filter(Boolean);

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
        { x: '-60vw', opacity: 0, scale: 0.97 }, 
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

    // Steps stagger
    stepItems.forEach((step, i) => {
      scrollTl.fromTo(step,
        { x: '10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08 + i * 0.04
      );
    });

    // Set to 30%
    scrollTl.to({}, {}, 0.3);

    // EXIT (70% - 100%)
    scrollTl
      .fromTo(tile, 
        { x: 0, opacity: 1 }, 
        { x: '-18vw', opacity: 0, ease: 'power2.in' }, 
        0.7
      )
      .fromTo(text, 
        { x: 0, opacity: 1 }, 
        { x: '14vw', opacity: 0, ease: 'power2.in' }, 
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
      className="section-pinned bg-broco-bg flex items-center justify-center"
    >
      {/* Horizontal Rule - lower z-index */}
      <Rule 
        ref={ruleRef}
        orientation="horizontal" 
        className="absolute left-[6vw] top-[54vh] w-[88vw] z-[1]"
      />

      {/* Left Tile */}
      <div 
        ref={tileRef}
        className="absolute left-[6vw] top-[18vh] w-[44vw] h-[64vh] z-[2] will-change-transform"
      >
        <Tile className="w-full h-full" noHover>
          <img 
            src="/images/workflow_lifestyle.jpg" 
            alt="Creative desk with materials"
            className="broco-img"
          />
        </Tile>
      </div>

      {/* Right Steps Block */}
      <div 
        ref={textRef}
        className="absolute left-[56vw] top-[20vh] w-[38vw] z-[3] will-change-transform"
      >
        <h2 className="headline-lg font-display font-bold text-broco-text mb-10">
          Build in<br />three moves.
        </h2>
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => { stepsRef.current[index] = el; }}
              className="flex items-start gap-4 will-change-transform"
            >
              <span className="font-mono text-sm text-broco-accent font-medium">
                {step.number}
              </span>
              <div>
                <h3 className="font-display font-bold text-lg text-broco-text mb-1">
                  {step.title}
                </h3>
                <p className="body-text text-broco-textSecondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;

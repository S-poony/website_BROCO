import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Split, MousePointerClick, Keyboard } from 'lucide-react';

const features = [
  {
    icon: Split,
    title: 'Recursive Split',
    description: 'Click any edge to split rows or columns. Nest as deep as you need.',
  },
  {
    icon: MousePointerClick,
    title: 'Drag & Drop',
    description: 'Drop images into any cell. Toggle cover/contain with one click.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard First',
    description: 'Move, resize, and reorder without lifting your hands from the keyboard.',
  },
];

export const ThreeUpFeatures = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!heading || cards.length === 0) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    gsap.registerPlugin(ScrollTrigger);

    // Heading reveal
    gsap.fromTo(heading,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
          end: 'top 55%',
          scrub: 0.5,
        }
      }
    );

    // Cards stagger reveal
    cards.forEach((card) => {
      gsap.fromTo(card,
        { y: '10vh', opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 0.5,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st: { kill: () => void }) => st.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-broco-bg py-[10vh]"
    >
      <div className="w-[92vw] mx-auto">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="headline-lg font-display font-bold text-broco-text text-center mb-[6vh]"
        >
          Everything you need to<br />layout pages.
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(14px,1.6vw,22px)]">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="will-change-transform"
            >
              <Tile className="p-8 h-full">
                <feature.icon className="w-10 h-10 text-broco-accent mb-6" strokeWidth={2} />
                <h3 className="font-display font-bold text-xl mb-3 text-broco-text">
                  {feature.title}
                </h3>
                <p className="body-text text-broco-textSecondary">
                  {feature.description}
                </p>
              </Tile>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeUpFeatures;

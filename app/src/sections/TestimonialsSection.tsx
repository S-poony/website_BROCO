import { useRef, useLayoutEffect } from 'react';
import { Tile } from '@/components/Tile';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "BROCO is the first layout tool that feels like my sketchbook—fast, modular, and clean.",
    name: 'Aiko Tanaka',
    role: 'Editorial Designer',
    avatar: '/images/avatar_aiko.jpg',
  },
  {
    quote: "I use it to build mood boards and pitch decks in minutes. The recursive splitting is genius.",
    name: 'Leo Vance',
    role: 'Creative Director',
    avatar: '/images/avatar_leo.jpg',
  },
  {
    quote: "The keyboard shortcuts are chef's kiss. I can layout an entire portfolio without touching the mouse.",
    name: 'Mina Rahman',
    role: 'Product Designer',
    avatar: '/images/avatar_mina.jpg',
  },
];

export const TestimonialsSection = () => {
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
      { y: 20, opacity: 0 },
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
        { y: '8vh', opacity: 0, scale: 0.98 },
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
          Loved by designers.
        </h2>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(14px,1.6vw,22px)]">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="will-change-transform"
            >
              <Tile className="p-8 h-full flex flex-col">
                <Quote className="w-8 h-8 text-broco-accent mb-4" strokeWidth={2} />
                <p className="body-text text-broco-text mb-6 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <p className="font-display font-semibold text-sm text-broco-text">
                      {testimonial.name}
                    </p>
                    <p className="font-mono text-xs text-broco-textSecondary uppercase tracking-wide">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Tile>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

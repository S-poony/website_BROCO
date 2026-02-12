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

// Type for ScrollTrigger instance
interface ScrollTriggerInstance {
  trigger?: unknown;
  kill: () => void;
}

export const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !heading || !cardsContainer || cards.length === 0) return;

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
      .fromTo(heading,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(cards,
        { y: 60, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.05, ease: 'none' },
        0.05
      );

    // PAUSE (30% - 70%)
    scrollTl.to({}, {}, 0.3);

    // EXIT (70% - 100%)
    scrollTl
      .fromTo(heading,
        { y: 0, opacity: 1 },
        { y: -30, opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(cardsContainer,
        { y: 0, opacity: 1 },
        { y: -40, opacity: 0, ease: 'power2.in' },
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
      id="testimonials"
      className="section-pinned bg-broco-bg flex flex-col items-center justify-center pt-[10vh]"
    >
      <div className="w-[92vw] mx-auto flex flex-col items-center">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="headline-lg font-display font-bold text-broco-text text-center mb-[8vh] will-change-transform"
        >
          Loved by designers.
        </h2>

        {/* Testimonial Cards */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(14px,1.6vw,22px)] w-full will-change-transform"
        >
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
